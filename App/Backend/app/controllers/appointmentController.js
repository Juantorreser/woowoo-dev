const fs = require("fs");
const db = require("../models");
const Appointment = db.appointment;
const User = db.user;
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
const {EMAIL_PASS} = require('../config/db.config.js');
const { emitWarning } = require("process");
const axios = require('axios');
// const userFunction = require('./userController.js');
const transporter = nodemailer.createTransport({
  host: "woo-woo-network.firebaseapp.com",
  port: 4200,
  secure: false, 
  service: "gmail",
  auth: {
    type: 'OAuth2', 
    //clientId: process.env.OAUTH_CLIENT_ID, 
    clientId: "257418938856-8pck88n3cvhgf0ibi65iiuukv6aeo715.apps.googleusercontent.com",
    //clientSecret: process.env.OAUTH_CLIENT_SECRET,
    clientSecret: "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",
    //refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    refreshToken: "1//04gSd7p_7b3MhCgYIARAAGAQSNwF-L9Iryu7d520tG2gwzF_4_9rMmwXW7Pw_aqEzMVv40ccCaB5rSUoRSRhgGEZguhnKiquiSBQ",
    user: "woowoonetworkcanada@gmail.com", 
    pass: EMAIL_PASS
  }
})
// const {GOOGLE_SECRET_KEY} = require('../config/google.config.js');
// const initializeApp = require('firebase/app');
// const {getMessaging, getToken} = require('firebase/messaging');
// const {getTokenFromFirebase} = require('../firebase-messaging-sq.js');
// const firebaseConfig = {
//   apiKey: GOOGLE_SECRET_KEY
// }

// const app = initializeApp(firebaseConfig);
// const messaging = initializeApp(app);
// //Add the public key generated from the console:
// getToken(messaging, {vapidKey: GOOGLE_SECRET_KEY})
// .then((currentToken)=> {
//   if(currentToken){
//     //Add the token to the server.
//   }
//   else{
//     console.log('No registration token available');
//   }
// })
// .catch(err=> {
//   console.log('An error occur when retrieving token');
// });

// This function is responsible for creating a new appointment and saving it to the database. 
// It performs some basic input validation to ensure that required fields (healer, fbid, and uid) are provided in the request's body. 
// If any of the validations fail, it sends a 400 Bad Request response with an appropriate error message. 
// Otherwise, it generates a new aid for the appointment, constructs the appointment object, 
// and saves it to the database using Appointment.create().
exports.createAppointment = async (req, res) => {
    // Validate request
    console.log(req.body);
    var healerEmail = "";
    if (!req.body.healer) {
      let message = "healer id can not be empty!";
      await res.status(400).send({
        message: message
      });
      return;
    }

    console.log(!req.body.uid);
    // if (!req.body.fbid || !req.body.uid) {
      if (!req.body.uid) {
      let message = "id can not be empty!";
      await res.status(400).send({
        message: message
      });
      return;
    }
    //find the email of the healer.
    await User.findAll({   //find the account of the one being deleted.
      where: {uid: req.body.healer}   //find the email fo the healer.
    })
    .then(async data=> {
        
        try{
          healerEmail = data[0].email;
        }
        catch(err){
          console.log(err);
        }
    })
    console.log("Healer email is: "+ healerEmail);
    const lastid = await Appointment.max('aid');
    const appointment = {
      aid: lastid !== 0 && lastid ? lastid + 1 : 1,
      healer: req.body.healer,
      //client: req.body.ufbid,
      client: req.body.uid,
      timezone: req.body.timezone,
      date: req.body.date,
      time: req.body.time,
      createdAt: new Date('YYYY-MM-DD HH:MM:SS'),
      updatedAt: null,
      healerAccepted: 0
    };
    //find the email of the user as well as the intended healer:


    //get the token:
    //getTokenFromFirebase();
    const mailOptions = {
      from: "woowoonetworkcanada@gmail.com", 
      //to: "woowoonetworkcanada@gmail.com",  //this is just testing.
      to: healerEmail,   //this is the real one.
      subject: "Testing", 
      text: "Hello world", 
      html: `<div><h3>You have new appointment</h3> <p>Client:${appointment.client}</p> <p>Time: ${appointment.time}</p> <p>Date: ${appointment.date}</p></div>`
    };

    const info = await transporter.sendMail(mailOptions, function(err, data){
      if(err){
        console.log("Error with sending mail: " + err)
      }
      else{
        console.log("Email sent successfully");
      }
    })
    // Save Location in the database. location is not defined yet.

    // await Appointment.create(location)
    //   .then(data => {
    //     console.log('received: ' + data);
    //   })
    //   .catch(err => {
    //     console.log("Some error occurred while creating the User.");
    //   });



    await Appointment.create(appointment)
      .then(data => {
        console.log('received: ' + data);
        res.send(data);
      })
      .catch(err => {
        console.log("Some error occurred while creating the User.");
      });
  };

  // This function retrieves all appointments for a specified healer. 
  // It expects the healer parameter to be passed as a query parameter in the request. 
  // It then queries the database using Appointment.findAll() with the specified healer value and sends the retrieved data back as the response.
exports.findAllAppointments = async (req, res) => {
  console.log('req', req.query.healer);
  await Appointment.findAll({
    where: {
      healer: req.query.healer
    }
  })
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

//fidn the history of appointments from a specific client:
exports.getClientAppointments = async (req, res)=> {
  const id = req.params.uid;
  await Appointment.findAll({
    where: {
      client: id
    }
  })
  .then(data=> {
    console.log(data);
    res.send(data);
  })
  .catch(err=> {
    res.status(500).send(err);
  })
}

// This function is used to update an existing appointment based on its aid (appointment ID). 
// It takes the aid from the request parameters and uses Appointment.update() to update the appointment with the new data provided in the request body. 
// If the update is successful (indicated by num == 1), it sends a success message; otherwise, it sends an error message.
//Also, send a message back to the user to inform them of the update in the appointment.
exports.updateAppointment = async (req, res) => {
  const id = req.params.aid;
  const userId = req.body.client;
  var userEmail = "";
  //find the email of the user ID
  await axios.get("http://localhost:8080/users/"+ userId).then((result)=> {
    console.log(result.data.email);
    userEmail = result.data.email;
  })

  console.log(userEmail);
  const mailOptions = {
    from: "woowoonetworkcanada@gmail.com", 
    //to: "woowoonetworkcanada@gmail.com",  //this is just testing.
    to: userEmail,   //this is the real one. (Not tested yet)
    subject: "Testing", 
    text: "Hello world", 
    html: `<div><h3>Update on your appointment: </h3> <p>Client:${req.body.client}</p> <p>Time: ${req.body.time}</p> <p>Date: ${req.body.date}</p> <p>Healer Accepted: ${req.body.healerAccepted == 1 ? "Confirm" : "Deny"}</p></div>`
  };

  const info = await transporter.sendMail(mailOptions, function(err, data){
    if(err){
      console.log("Error with sending mail: " + err)
    }
    else{
      console.log("Email sent successfully");
    }
  })
  Appointment.update(req.body, {
    where: { aid: id }
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

// This function is responsible for deleting an appointment based on its fbid (assuming this is a typo, and it should be aid). 
// It utilizes Appointment.destroy() to remove the appointment from the database. 
// If the deletion is successful (indicated by num == 1), it sends a success message; otherwise, it sends an error message.
exports.deleteAppointment = (req, res) => {
  //const id = req.params.fbid;
  const id = req.params.aid;
  Appointment.destroy({
    where: { fbid: id }
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

// This function retrieves an appointment based on its aid (appointment ID).
// It expects the aid to be passed as a route parameter in the request.
// It then queries the database using Appointment.findByPk() with the specified aid and sends the retrieved data back as the response.
// If the appointment is not found, it sends a 404 Not Found response.
exports.getAppointments = (req, res) => {
  const id = req.params.aid;

  Appointment.findByPk(id)
    .then(appointment => {
      if (appointment) {
        res.send(appointment);
      } else {
        res.status(404).send({
          message: `Cannot find appointment with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving appointment with id=" + id
      });
    });
};