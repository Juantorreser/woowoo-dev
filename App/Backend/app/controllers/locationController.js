const fs = require("fs");
const db = require("../models");
const Location = db.location;
const Op = db.Sequelize.Op;

const geocode = require("../middleware/geocoding");
const errorLog = ('../../errorLog.txt');

const writeError = (errMsg) => {
  const dateString = new Date().getDate().toString();
  const time = new Date().getTime().toString();
  fs.appendFile(errorLog, `${dateString} @ ${time}: ${errMsg.toString()}`, (err) => {
    console.log(err);
  });
};

// Create and Save a new user
exports.createLocation = async (req, res) => {
    // Validate request
    console.log(req.body);

    if (!req.body.address) {
      let message = "address can not be empty!";
      await res.status(400).send({
        message: message
      });
      writeError(message);
      return;
    }

    if (!req.body.fbid) {
      let message = "id can not be empty!";
      await res.status(400).send({
        message: message
      });
      writeError(message);
      return;
    }

    var geoLat = "";
    var geoLng = "";

    try{
      let geoCoordinates = await geocode.FindByKeyWord(req,res);
      console.log(geoCoordinates);
        geoLat = (JSON.parse(geoCoordinates).results[0].geometry.location.lat);
        geoLng = (JSON.parse(geoCoordinates).results[0].geometry.location.lng);
    }
    catch (err) {
      console.log("error getting coordinates for the supplied address.");
      writeError("error getting coordinates for the supplied address.");
    }

    if(geoLat == "" || geoLng == ""){
      geoLat = 48.407326;
      geoLng = -123.329773;
    };

    const location = {
      lid:req.body.uid,
      uid: req.body.uid,
      fbid: req.body.fbid,
      address: req.body.address,
      lat: geoLat,
      lng: geoLng,
      createdAt: new Date('YYYY-MM-DD HH:MM:SS'),
      updatedAt: null
    };

    // Save Location in the database
    await Location.create(location)
      .then(data => {
        console.log('received: ' + data);
      })
      .catch(err => {
        console.log("Some error occurred while creating the User.");
      });
  };


// Retrieve all Users from the database where region is  ? 
exports.findAllLocations = async (req, res) => {
  console.log('req', req.body);
  await Location.findAll({
    where: {
      uid: req.body
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
// Update a user by the id in the request
exports.updateLocation = (req, res) => {
  const id = req.params.fbid;
  Location.update(req.body, {
    where: { fbid: id }

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
exports.deleteLocation = (req, res) => {
  const id = req.params.fbid;
  Location.destroy({
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
