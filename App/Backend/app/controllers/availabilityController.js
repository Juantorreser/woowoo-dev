
const db = require("../models");
const Availability = db.availability;
const Op = db.Sequelize.Op;

// Create a new availability entry
exports.createAvailability = async (req, res) => {
    console.log(req.body);

    if (!req.body.healer) {
        return res.status(400).send({
            message: "Healer ID cannot be empty!"
        });
    }

    if (!req.body.date) {
        return res.status(400).send({
            message: "Date cannot be empty!"
        });
    }

    try {
        const lastId = await Availability.max('id');
        const availability = {
            id: lastId !== 0 && lastId ? lastId + 1 : 1,
            healer: req.body.healer,
            timeslots: req.body.timeslots, // Expecting an array here
            duration: req.body.duration,
            timezone: req.body.timezone || null,
            date: req.body.date,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const data = await Availability.create(availability);
        console.log('Created availability:', data);
        res.status(201).send(data);
    } catch (err) {
        console.error("Error while creating the availability:", err);
        res.status(500).send({
            message: "Some error occurred while creating the availability."
        });
    }
};




// Retrieve all availabilities for a specific healer and date
exports.findAllAvailability = async (req, res) => {
    const healerId = req.query.healer;
    const date = req.query.date;

    console.log('Healer ID:', healerId);
    console.log('Date:', date);

    try {
        const data = await Availability.findAll({
            where: {
                healer: healerId,
                date: date
            }
        });
        res.send(data);
    } catch (err) {
        console.error("Error while retrieving availabilities:", err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving availabilities."
        });
    }
};

// Update an existing availability entry based on its ID
exports.updateAvailability = async (req, res) => {
    const id = req.params.uid;

    if (req.body.date && new Date(req.body.date) === "Invalid Date") {
        return res.status(400).send({
            message: "Invalid date format!"
        });
    }

    try {
        const [num] = await Availability.update(req.body, { where: { id } });
        if (num == 1) {
            res.send({
                message: "Availability was updated successfully."
            });
        } else {
            res.status(404).send({
                message: `Cannot update availability with id=${id}. Maybe availability was not found or req.body is empty!`
            });
        }
    } catch (err) {
        console.error("Error updating availability with id=" + id, err);
        res.status(500).send({
            message: "Error updating availability with id=" + id
        });
    }
};

// Delete an availability entry based on its ID
exports.deleteAvailability = async (req, res) => {
    const id = req.params.uid;

    try {
        const num = await Availability.destroy({ where: { id } });
        if (num == 1) {
            res.send({
                message: "Availability was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete availability with id=${id}. Maybe availability was not found!`
            });
        }
    } catch (err) {
        console.error("Error deleting availability with id=" + id, err);
        res.status(500).send({
            message: "Could not delete availability with id=" + id
        });
    }
};
