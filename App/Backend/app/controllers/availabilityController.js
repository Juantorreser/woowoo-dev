const fs = require("fs");
const db = require("../models");
const Availability = db.availability;
const Op = db.Sequelize.Op;

// This function is responsible for creating a new availability entry for a healer and saving it to the database. 
// It starts by validating the request's body, ensuring that the healer field is provided. 
// If not, it sends a 400 Bad Request response with an appropriate error message. 
// Then, it generates a new id for the availability, constructs the availability object using the request body data, 
// and saves it to the database using Availability.create().
exports.createAvailability = async (req, res) => {
    // Validate request
    console.log(req.body);

    if (!req.body.healer) {
        let message = "healer id can not be empty!";
        await res.status(400).send({
            message: message
        });
        return;
    }

    const lastid = await Availability.max('id');
    const availability = {
        id: lastid !== 0 && lastid ? lastid + 1 : 1,
        healer: req.body.healer,
        timeslots: req.body.timeslots,
        duration: req.body.duration,
        createdAt: new Date('YYYY-MM-DD HH:MM:SS'),
        updatedAt: null
    };

    // Save Location in the database
    await Availability.create(location)
        .then(data => {
            console.log('received: ' + data);
        })
        .catch(err => {
            console.log("Some error occurred while creating the User.");
        });
};

// This function retrieves all availabilities for a specific healer. 
// It expects the healer parameter to be passed as a query parameter in the request. 
// It then queries the database using Availability.findAll() with the specified healer value
// and sends the retrieved data back as the response.
exports.findAllAvailability = async (req, res) => {
    console.log('req', req.query.healer);
    await Availability.findAll({
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

// This function is used to update an existing availability entry based on its aid (availability ID).
// It takes the aid from the request parameters and uses Availability.update() to update the availability with the new data provided in the request body. 
// If the update is successful (indicated by num == 1), it sends a success message; otherwise, it sends an error message.
exports.updateAvailability = (req, res) => {
    const id = req.params.aid;
    Availability.update(req.body, {
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

// This function is responsible for deleting an availability entry based on its fbid (this may be a typo, it might be aid). 
// It utilizes Availability.destroy() to remove the availability from the database. 
// If the deletion is successful (indicated by num == 1), it sends a success message; otherwise, it sends an error message.
exports.deleteAvailability = (req, res) => {
    const id = req.params.fbid;
    Availability.destroy({
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
