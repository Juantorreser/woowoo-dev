const db = require("../models");
const config = require('../config/db.config');
const Image = db.image;
const Op = db.Sequelize.Op;

//TO DO:
/*
1) Delete only 1 image using name
2) update image name 
3) select uid, name, filepath only instead of select * 
*/

// Retrieve all images from the database where uid is
exports.findAllImages = (req, res) => {
    const uid = req.query.uid;
    const type = req.query.type;
    var condition = uid ? { 
            uid: { [Op.like]: `%${uid}%` },
            name: { [Op.like]: `${type}%` }
    } : null;
    Image.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
     .then(data => {
        console.log("what the fuck");
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving uesers."
      });
    });
};
// Find a single user with an id
exports.findOneImage = (req, res) => {
    const uid = req.query.uid;
    const type = req.query.type;
    var condition = uid ? { 
            uid: { [Op.like]: `%${uid}%` },
            name: { [Op.like]: `${type}%` }
    } : null;
  Image.findOne(condition)
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
exports.updateImage = (req, res) => {
  const uid = req.query.uid;
  Image.update(req.query, {
    where: { uid: uid }
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
exports.deleteImage = (req, res) => {
  const uid = req.params.uid;
  Image.destroy({
    where: { uid: uid }
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
exports.deleteAllImages = (req, res) => {
  Image.destroy({
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
