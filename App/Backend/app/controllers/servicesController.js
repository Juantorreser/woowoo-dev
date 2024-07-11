const fs = require("fs");
const db = require("../models");
const Service = db.service;
const Op = db.Sequelize.Op;

// Create and Save a new user
exports.createService = async (req, res) => {
    // Validate request
    console.log(req.body);

    if (!req.body.service || !req.body.description) {
        await res.status(400).send({
            message: "service name and description cannot be empty!"
        });
        return;
        }

    const lastid = await Service.max('sid');
    const service = {
        sid: lastid !== 0 && lastid ? lastid + 1 : 1,
        service: req.body.service,
        description: req.body.description,
        createdAt: new Date('YYYY-MM-DD HH:MM:SS'),
        updatedAt: new Date('YYYY-MM-DD HH:MM:SS')
    };

    // Save Location in the database
    await Service.create(service)
        .then(data => {
            console.log('received: ' + data);
        })
        .catch(err => {
            console.log("Some error occurred while creating the Service.");
        });
};

// Retrieve all services from the database
exports.findAllServices = async (req, res) => {
    await Service.findAll({
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

exports.findServiceById = async (req, res) => {
    const serviceIds = req.query.ids;
    console.log(serviceIds);

    await Service.findAll({
        where: {
            sid: 1
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
exports.updateService = (req, res) => {
    const id = req.params.sid;
    Service.update(req.body, {
        where: { sid: id }
    })
    .then(num => {
        res.status(204).send({
            message: "User was updated successfully."
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating user with id=" + id
        });
    });
};
// Delete a user with the specified id in the request
exports.deleteService = (req, res) => {
    const sid = req.params.sid;
    Location.destroy({
        where: { sid: sid }
    })
    .then(num => {
        res.status(200).send({
            message: "User was deleted successfully!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete service with id=" + id
        });
    });
};
