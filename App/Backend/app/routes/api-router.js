
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
const message = require('../controllers/messageController.js');
const availability = require('../controllers/availabilityController.js'); // Import availability controller
const authController = require('../controllers/login.js');
const router = express.Router();

module.exports = function(router){

    // Retrieve all users and create a new user
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
        })
        router.route('/users/:uid')
        // Update a user with id
        .put((req, res) => {
            users.updateUser(req, res);
        });

    // Retrieve all enabled users
    router.route('/users/enabled')
        .get((req, res) => {
            users.findAllEnabled(req, res);
        });

    // Finds all healers with parameters
    router.route('/users/healers')
        .get((req, res) => {
            users.findAllHealers(req, res);
        })
        .post((req, res) => {
            // Uses request parameters to return healers
            users.findHealersWithParams(req, res);
        });

    

    // Retrieve a single user with id
    router.route('/users/:uid')
        .get((req, res) => {
            users.findOneUser(req, res);
        })
        // Delete a user with id
        .delete((req, res) => {
            users.deleteUser(req, res);
        });

    // Login
    router.route('/login')
        .post(authController.login);
    // Reset password request
    router.route('/reset-password')
        .post(authController.sendResetPasswordLink)
        .put(authController.resetPassword);

    router.get('/verify', authController.verifyActionLink);

    // Images
    router.route('/images')
        // Retrieve all images
        .get((req, res) => {
            images.findAllImages(req, res);
        })
        // Delete all images
        .delete((req, res) => {
            images.deleteAllImages(req, res);
        });

    router.route('/images/:uid')
        // Retrieve a single image with id
        .get((req, res) => {
            images.findOneImage(req, res);
        })
        // Update an image with id
        .put((req, res) => {
            images.updateImage(req, res);
        })
        // Delete an image with id
        .delete((req, res) => {
            images.deleteImage(req, res);
        });

    // Image-specific vars to handle upload
    const uploadController = require("../controllers/upload");
    const upload = require("../middleware/imageHandler");

    router.route('/images/upload')
        // Upload image associated with user id
        .post(
            upload.single("file"),
            (req, res) => {
                images.uploadFiles(req, res);
            }
        );

    // Bookings: use healer id
    router.route('/bookings')
        .get();

    // Social
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

    // Reviews
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

    // Locations
    router.route('/locations')
        .post((req, res) => {
            locations.findAllLocations(req, res);
        });

    router.route('/locations/:uid')
        // Update a location with id
        .put((req, res) => {
            locations.updateLocation(req, res);
        })
        // Delete a location with id
        .delete((req, res) => {
            locations.deleteLocation(req, res);
        });

    // Services
    router.route('/services')
        .get((req, res) => {
            services.findAllServices(req, res);
        })
        .post((req, res) => {
            services.createService(req, res);
        });  
        
    //Enabled service
    router.route('/enabledServices')
    .get((req,res)=> {
        services.findAllEnabled(req,res);
    })
    //enable/disable service from admin side.
    router.route('/services/:sid')
    .put((req, res)=> {
        services.updateService(req,res);
    })
    .delete((req,res)=>{
        services.deleteService(req,res);
    });

    // Appointments
    router.route('/appointments')
        // Create an appointment
        .post((req, res) => {
            appointments.createAppointment(req, res);
        })
        .get((req, res) => {
            //appointments.getAppointments(req, res);
            appointments.findAllAppointments(req, res);
        })
        // .delete((req, res) => {
        //     appointments.deleteAppointments(req, res);
        // });

    //find specific appointments with specific aid
    router.route('/appointments/:aid').get((req, res)=> {
        appointments.getAppointments(req, res);
    }).put((req, res)=> appointments.updateAppointment(req, res))
    //delete specific appointments with specific fbid
    router.route('/appointments/:fbid').delete((req, res)=> {
        appointments.deleteAppointments(req, res);
    })

    //find specific appointments from a user:
    router.route('/appointments/clients/:uid').get((req, res)=> {
        appointments.getClientAppointments(req, res);
    })
    // Availability
    router.route('/availability')
        .post((req, res) => {
            availability.createAvailability(req, res);
        })
    // Availability by id 
    router.route('/availability/:uid')
        .get((req, res) => {
            availability.findAllAvailability(req, res);
        })
        .put((req, res) => {
            availability.updateAvailability(req, res);
        })
        .delete((req, res) => {
            availability.deleteAvailability(req, res);
        });
    

    // Using Stripe payment
    router.route('/payment')
        .post((req, res) => {
            users.payForSpecificHealer(req, res);
        });

    //retrive information about an account, including finance
    router.route('/financeReport/:stripeAccount')
    .get((req,res)=> {
        users.financeReport(req,res);
    })

    router.route('/stripeAccount/:stripeAccount')
    .get((req,res)=> {
        users.getStripeConnectedAccount(req,res);
    })

    router.route('/testing')
        .get((req, res) => {
            users.testing(req, res);
        });
    
    //Route for message
    router.route('/message/:uid')
    .get((req, res)=> {
        message.findAllMessage(req, res);
    })
    //reply to a message in the database
    router.route('/message/:mid')
    .put((req,res)=> {
        message.replyToMessage(req,res);
    })

    router.route('/message')
    .post((req,res)=> {
        message.sendMessage(req, res);
    })
};
