const fs = require("fs");
const db = require("../models");
const Social = db.social;
const Op = db.Sequelize.Op;

// Create and Save a new user
exports.createSocial = (req, res) => {

    var accounts = [];
    var platforms = [];
    var result;

    if (!req.body.uid) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    //key fb is facebook, in is instagram, tw is twitter 
    if(req.body.fb){ accounts.push(req.body.fb); platforms.push( "fb" );}
    if(req.body.in){ accounts.push(req.body.in); platforms.push( "in" );}
    if(req.body.tw){ accounts.push(req.body.tw); platforms.push( "tw" );}

    // Create a social link for each link provided
    while( accounts.length > 0 ){
 
        const social = {
        uid: req.body.uid,
        type: platforms.pop(),
        tag: accounts.pop(),
        };
        // Save User in the database
        Social.create(social)
        .then(data => {
            result += data;
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while creating the User."
            });
        });


    }
    res.send(result);
  };
// Retrieve all Users from the database where region is  ? 
exports.findAllSocials = (req, res) => {
  const id = req.body.uid;
  //var condition = region ? { uid: { [Op.like]: `%${uid}%` } } : null;
  //Social.findAll({ where: condition })
  Social.findAll({ where: { uid:id} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving uesers."
      });
    });
};
// Update a user by the id in the request
exports.updateSocial = (req, res) => {
  const id = req.params.uid;
  Social.update(req.body, {
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
exports.deleteSocial = (req, res) => {
  const id = req.params.uid;
  Social.destroy({
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
