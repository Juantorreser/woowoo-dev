const fs = require("fs");
const { builtinModules } = require("module");
const db = require("../models");
const User = db.user;
const Service = db.service;
const services = require('./servicesController');
const Location = db.location;
const locations = require('./locationController');
const Op = db.Sequelize.Op;   //Op meaning operator. You can think of it as a conditional clause.
const { off } = require("process");
const { sequelize } = require("../models");
const  argon2 = require('argon2');   //used for hashing and salting password
const {STRIPE_SECRET_KEY} = require('../config/stripe.config.js');
// Most comment blocks were added in June 2023, but most of the code was written at least on year prior and possibly not all at the same time
// There may be some inaccuracies with what exactly is happening because the I didn't write it originally
// const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);
const stripe = require('stripe')(STRIPE_SECRET_KEY);
// Create and Save a new user
const hashingFunction = async (password)=> {
  try{
    const hashedPassword = await argon2.hash(password);
    console.log(`Hashed password: ${hashedPassword}`)
    return hashedPassword;
  }
  catch(err){
    console.log(err);
  }
}
exports.createUser = async (req, res) => {
  console.log('createUser');
  // Create a User
  const lastid = await User.max('uid');
  // (async function(){
  //   try{
  //     hashedPassword = await argon2.hash(req.body.password);
  //   }
  //   catch(err){
  //     console.log("Having issue with hashing: "+ err);
  //   }
  // })()

  //testing hashing
  // try{
  //   console.log(await hashingFunction(req.body.password));
  // }
  // catch(err){
  //   console.log(err);
  // }
  const user = {
    uid: lastid !== 0 && lastid ? lastid + 1 : 1,
    fbid: req.body.fbid,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    emailVerified: false,
    //password: req.body.password,   //need to hash this.
    password: await hashingFunction(req.body.password),   //not sure yet.
    account: req.body.isHealer ? 1 : 0,
    description: req.body.description ? req.body.description : null,
    address: req.body.address ? req.body.address : null,
    city: req.body.city ? req.body.city : null,
    province: req.body.province ? req.body.province : null,
    country: req.body.country ? req.body.country : null,
    postal: req.body.postal ? req.body.postal : null,
    services: req.body.services ? req.body.services.toString() : null,
    enabled: true,
    region: req.body.region,
    format: req.body.format ? req.body.format : 0
  };

  // Validate request
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    console.log('no name email or password');
    await res.status(400).send({
      message: "Name, email, or password cannot be empty!"
    });
    return;
  }

  //if the user is a healer, add the healer to the stripe account. Not sure yet.
  
  
  // Create user and try to set a location based on address
  User.create(user)
    .then(data => {
      if(user.address !== null){
        locations.createLocation({
          body: {
            uid: user.uid,
            fbid: user.fbid,
            address: user.address
          }
        });
      }

      //if the user is a healer, then make a stripe user account for the healer to earn money.
      if(user.account == 1){
        // const customerSource = await stripe.customers.createSource({
        //   source: {
        //       account_number: req.body.accountNumber,
        //       country: user.country,
        //       currency: "cad",
        //       object: "bank_account",
        //       account_holder_name: user.firstName+ user.lastName
        //   }
        // })
    
        const newCustomer = stripe.customers.create({
          email: user.email,
          name: user.firstName + user.lastName, 
          // address: user.address,
          // country: user.country, 
          // province: user.province, 
          // postal_code: user.postalCode, 
          // city: user.city, 
          // region: user.region
        })
      
      }
    })
    .then(() => {
      //success - 201 created
      res.status(201).send({
        user
      });
    })
    .catch(err => {
      //500 server error
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the User.'
      });
    });
};

// Retrieve all Users from the database where region is  ? 
exports.findAllUsers = (req, res) => {
  console.log('findAllUsers');

  const region = req.query.region;
  var regionCond = region ? { region: { [Op.like]: `%${region}%` } } : null;
  User.findAll({ where: regionCond })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.findAllHealers = (req, res) => {
  console.log('findAllHealers');
  let details = {};

  let whereClause = {
    account: {
      [Op.eq]: 1
    },
    enabled: {
      [Op.eq]: 1
    }
  };

  if(req.query.email){
    whereClause.email = req.query.email;
  }

  sequelize.query(
    `select u.uid, firstName, lastName, email, account, u.description, enabled, region, city, group_concat(distinct(service)) as services, format
    from users u join services s 
    where find_in_set(s.sid, u.services)
    group by u.uid`
  )
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

/*
  This function uses the data from the request body to build up a variable containing all of the search parameters
  Each of the parameters are automatically formatted for sql using the db.sequelize.op library
  The query only includes relevant search clauses (e.g. it won't search for email if no email is in the request body)
*/ 
exports.findHealersWithParams = (req, res) => {
  console.log('findHealersWithParams req.body: ', req.body);

  //params to retrieve only active accounts that are also healers. 
  let params = {
      account: {
        [Op.eq]: 1
      },
      enabled: {
        [Op.eq]: 1
      }
  };
  
  if(req.body.fbid){
    params.fbid = {
      [Op.eq]: `${req.body.fbid}`
    };
  }

  if(req.body.email){
    params.email = {
      [Op.eq]: `${req.body.email}`
    };
  }

  //filter handling:
  if(req.body.cityParam){
    params.city = {
      [Op.like]: `${req.body.cityParam}`
    };
  } 
  
  if(req.body.serviceParam){
    params.services = {
      [Op.in]: `${req.body.serviceParam}`
    };
  } 

  if(req.body.deliveryFormat){
    switch(req.body.deliveryFormat){
      case 0:
        params.format = {
          [Op.in]: [0,1,2]
        };
        break;
      case 1: 
        params.format = {
          [Op.in]: [1 ,0]
        };
      case 2: 
        params.format = {
          [Op.in]: [2, 0]
        };
        break;
    }
  }

  /*
  include: [
    [
      sequelize.literal(`
        select firstName, u.services, group_concat(service) as serviceNames 
        from users u join services s 
        where find_in_set(s.sid, u.services)
        group by u.uid
      `)
    ]
  ]
  */

  /*
    The lines that look like "${params.[var] ? ... : ``}" are conditionally adding text to the SQL statement
    e.g. If params.city exists then the snippet between the '?' and ':' will be used
    if params.city doesn't exist then the empty string after the ':' will be used
  */
  sequelize.query(
    `SELECT u.uid, firstName, lastName, email, account, u.description, enabled, region, city, GROUP_CONCAT(DISTINCT(service)) as services, format
    FROM users u JOIN services s 
    WHERE FIND_IN_SET(s.sid, u.services) 
    ${params.city ? `AND city LIKE '${req.body.cityParam}'` : ``}
    ${params.format ? `AND format = ${req.body.deliveryFormat}` : ``}
    ${params.email ? `AND email LIKE ${req.body.email}` : ``}
    ${params.fbid ? `AND fbid LIKE '${req.body.fbid}'` : ``}
    GROUP BY u.uid
    ${params.services ? `HAVING services LIKE '%${req.body.serviceParam}%'` : ``}`
  )
  .then(data => {
    console.log(data[0]);
    res.status(200).send(data[0]);
  })
  .catch(err => {
    res.status(500).send(
      "Some error occurred while retrieving users."
    );
  });
};

// Find a single user with an id
exports.findOneUser = async (req, res) => {
  console.log('findOneUser');

  const id = req.params.uid;
  await User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
};

// Update a user by the id in the request
exports.updateUser = async (req, res) => {
  console.log('updateUser');

  const id = req.params.uid;
  await User.update(req.body, {
    where: { uid: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe user was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    });
};

// Delete a user with the specified id in the request
exports.deleteUser = async (req, res) => {
  console.log('deleteUser');

  const id = req.params.uid;
  await User.destroy({
    where: { uid: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete user with id=" + id
      });
    });
};

// Delete all users from the database.
exports.deleteAllUsers = async (req, res) => {
  console.log('deleteAllUsers');

  await User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    });
};

// Find all actived users
exports.findAllEnabled = async (req, res) => {
  console.log('findAllEnabled');

  await User.findAll({ where: { enabled: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

//accepting payment.
// exports.acceptPayment = async (req, res)=> {
//   console.log('payForSpecificHealer');
  
//   //confirm if the id is valid first.
//   const id = req.params.uid;
//   await User.find({
//     where: {uid : id}
//   }).then(async num => {   //confirm if the id is valid first.
//         if(num == 1){   //if they found the right healer.
//           // const payload = {
//           //   "transaction_id": req.params.transactionID,
//           //   "amount": req.params.amount,
//           //   "currency"
//           // }
//           await axios.post('https://api.stripe.com/v1/payment_intents', {
//             amount:req.params.amount,
//             currency: req.params.currency,
//             payment: req.params.paymentType,
//             customer: req.params.customer
            
//           })
//           res.send({message: "Payment completed"})
//         }
//         else{
//           res.send({message: `Can not found user with id: ${id}`})
//         }
//   })
//   .catch(err=>{
//     console.log("Can not find the user. Here is the error: "+ err);
//   })
// }


//create payment: Not sure yet.

exports.payForSpecificHealer = async (req, res)=> {
  console.log("payForSpecificHealer");
  // const {amount, token} = req.body;

  const {amount} = req.body;
  // try{
  //   const charge = await stripe.charges.create({
  //     token: process.env.STRIPE_SECRET_KEY,
  //     amount,
  //     currency: 'cad',
  //     description: 'payment for source',
  //     customer: req.body.customer
  //   })
  //   res.send('Payment successful');

  //   //res.status(201).send('payForSpecificHealers');
  // }
  // catch(err){
  //   console.log(err);
  //   let message = 'An error occurred with the payment process. Maybe there is an issue with the body of the request';

  //   if(err.type === 'StripeCardError'){    //there is a problem with the card.
  //     message = err.message;
  //   }
  //   res.status(500).send(message);
  // }

  //Method 2: Session payment:
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', 
      line_items: req.body.items.map(item=> {
        return {
          price_data: {
            currency: req.body.currency, 
            product_data: {
              name: item.service_name,
              //service_name: item.service
            },
            unit_amount: item.price
          },
          quantity: item.quantity
        }
      }),
      success_url: 'https://localhost:4200',
      cancel_url: 'https://localhost:4200'
    })
    res.json({url: session.url})
  }
  catch(err){
    res.status(500).json({error: err.message})
  }

}

exports.testing = async(req, res)=> {
  res.send("Testing");
}





