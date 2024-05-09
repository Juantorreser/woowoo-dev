const passport = require('passport');
const express = require('express');
const app = express();

const login = require('../controllers/login.js');
const images = require('../controllers/imageController.js');
const locations = require('../controllers/locationController.js');
const services = require('../controllers/servicesController.js');
const socials = require('../controllers/socialController.js');
const reviews = require('../controllers/reviewController.js');
const uploads = require('../controllers/upload.js');
const users = require('../controllers/userController.js');
const appointments = require('../controllers/appointmentController.js');
const authController = require('../controllers/login.js');

const router = express.Router();

module.exports = function(router){
    //Retrieve all users and create a new user
    router.route('/users')
        .get((req, res) => {
            users.findAllUsers(req, res);
        })
        .post((req, res) => {
            // Create a User
            users.createUser(req, res);
        })
        // Delete all user
        .delete((req, res) => {
            users.deleteAllUsers(req, res);
        });


    // Retrieve all enabled users
    router.route('/users/enabled')
        .get((req, res) => {
            users.findAllEnabled(req, res);
        });

    //finds all healers with parameters
    router.route('/users/healers')
        .get((req, res) => {
            users.findAllHealers(req, res);
        })
        .post((req, res) => {
            //uses request parameters to return healers
            users.findHealersWithParams(req, res);
        });


    // Retrieve a single user with id
    router.route('/users/:uid')
        .get((req, res) => {
            users.findOneUser(req, res);
        })
    // Update a user with id
        .put((req, res) => {
            users.updateUser(req, res);
        })
    // Delete a user with id
        .delete((req, res) => {
            users.deleteUser(req, res);
        });


    //login
    router.route('/login')
        .post(authController.login);
    // reset password request
    router.route('/reset-password')
        .post(authController.sendResetPasswordLink)
        .put(authController.resetPassword);

    router.get('/verify', authController.verifyActionLink);


    //images
    router.route('/images')
        //Retrieve all images
        .get((req, res) => {
            images.findAllImages(req, res);
        })
        // Delete all images
        .delete((req, res) => {
            images.deleteAllImages(req, res);
        });


    router.route('/images/:uid')
        // Retrieve a single images with id
        .get((req, res) => {
            images.findOneImage(req, res);
        })
        // Update a images with id
        .put((req, res) => {
            images.updateImage(req, res);
        })
        // Delete a images with id
        .delete((req, res) => {
            images.deleteImage(req, res);
        });


    //image-specific vars to handle upload
    const uploadController = require("../controllers/upload");
    const upload = require("../middleware/imageHandler");

    router.route('/images/upload')
    //upload image associated with user id
        .post(
            upload.single("file"),
            (req, res) => {
            images.uploadFiles(req, res);
            }
        );


    //bookings: use healer id
    router.route('/bookings')
        .get()


    //social
    router.route('/social')
        // Create a new social for a user
        .post((req, res) => {
            socials.createSocial(req, res);
        })
        // Retrieve all socials
        .get((req, res) => {
            socials.findAllSocials(req, res);
        })
        // Delete a social for a user
        .delete((req, res) => {
            socials.deleteSocial(req, res);
        });


    // Update a social for a user
    router.route('/social/:uid')
        .put((req, res) => {
            socials.updateSocial(req, res);
        });

    //Reviews
    router.route('/review/:uid')
        .get((req, res) => {
            reviews.getReviewWithId(req, res);
        });

    router.route('/review')
        .post((req, res) => {
            reviews.createReview(req, res);
        })
        .put((req, res) => {
            reviews.updateReview(req, res);
        })
        .delete((req, res) => {
            reviews.deleteReview(req, res);
        });


    //locations
    router.route('/locations')
        .post((req, res) => {
            locations.findAllLocations(req, res);
        });
        // Retrieve all locations in region
        // .post((req, res) => {
        //     locations.createLocation(req, res);
        // });

    router.route('/locations/:uid')
        // Update a location with id
        .put((req, res) => {
            locations.updateLocation(req, res);
        })
        // Delete a location with id
        .delete((req, res) => {
            locations.deleteLocation(req, res);
        });

    router.route('/services')
        .get((req, res) => {
            services.findAllServices(req, res);
        })
        .post((req, res) => {
            services.findServiceById(req, res);
        });

    router.route('/appointments')
        //create an appointment
        .post((req, res) => {
            appointments.createAppointment(req, res);
        })
        .get((req, res) => {
            appointments.getAppointments(req, res);
        })
        .delete((req, res) => {
            appointments.deleteAppointments(req, res);
        });
};
