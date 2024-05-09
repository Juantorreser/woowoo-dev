const fs = require("fs");
const db = require("../models");
const Appointment = db.appointment;
const Op = db.Sequelize.Op;

// This function is responsible for creating a new appointment and saving it to the database. 
// It performs some basic input validation to ensure that required fields (healer, fbid, and uid) are provided in the request's body. 
// If any of the validations fail, it sends a 400 Bad Request response with an appropriate error message. 
// Otherwise, it generates a new aid for the appointment, constructs the appointment object, 
// and saves it to the database using Appointment.create().
exports.createAppointment = async (req, res) => {
    // Validate request
    console.log(req.body);

    if (!req.body.healer) {
      let message = "healer id can not be empty!";
      await res.status(400).send({
        message: message
      });
      return;
    }

    if (!req.body.fbid || !req.body.uid) {
      let message = "id can not be empty!";
      await res.status(400).send({
        message: message
      });
      return;
    }

    const lastid = await Appointment.max('aid');
    const appointment = {
      aid: lastid !== 0 && lastid ? lastid + 1 : 1,
      healer: req.body.healer,
      client: req.body.ufbid,
      timezone: req.body.timezone,
      date: req.body.date,
      time: req.body.time,
      createdAt: new Date('YYYY-MM-DD HH:MM:SS'),
      updatedAt: null,
      healerAccepted: 0
    };

    // Save Location in the database
    await Appointment.create(location)
      .then(data => {
        console.log('received: ' + data);
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

// This function is used to update an existing appointment based on its aid (appointment ID). 
// It takes the aid from the request parameters and uses Appointment.update() to update the appointment with the new data provided in the request body. 
// If the update is successful (indicated by num == 1), it sends a success message; otherwise, it sends an error message.
exports.updateAppointment = (req, res) => {
  const id = req.params.aid;
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
  const id = req.params.fbid;
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
