const fs = require("fs");
const db = require("../models");
const Review = db.review;
const Op = db.Sequelize.Op;

// Create and Save a new review
exports.createReview = async (req, res) => {
    // Create a review
    const lastid = await Review.max('rid');
    const review = {
        rid: lastid !== 0 && lastid ? lastid + 1 : 1,
        reviewer: req.body.reviewer,
        reviewee: req.body.reviewee,
        rating: req.body.rating,
        comment: req.body.comment
    };

    // Validate request
    if (!req.body.reviewer || !req.body.reviewee || !req.body.rating || !req.body.comment) {
        await res.status(400).send({
            message: "Review must contain the reviewer, reviewee, rating, and a comment."
        });
        return;
    } else {
        // Create review
        Review.create(review)
            .then(data => {
                console.log(review);
                console.log(data);
                //success - 201 created
                res.status(201);
            })
            .catch(err => {
                //500 server error
                res.status(500).send({
                    message:
                    err.message || 'Some error occurred while creating the review.'
                });
            });
    }
};

// Retrieve all reviews from the database where region is  ? 
exports.findAllReviews = (req, res) => {
    Review.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving reviews."
            });
        });
};

exports.getReviewWithId = (req, res) => {
    const id = req.params.uid;
    let params = {};
    
    if(req.params.uid){
        params.reviewee = {
            [Op.eq]: `${id}`
        };
    }

    Review.findAll({
        attributes: [
            'rid', 
            'reviewer', 
            'reviewee', 
            'rating', 
            'comment',
            'createdAt'
        ],
        where: params,
        order: ['createdAt']
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving reviews."
        });
    });
};

// Update a review by the id in the request
exports.updateReview = async (req, res) => {
    const id = req.params.uid;
    await Review.update(req.body, {
        where: { rid: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "review was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update review with id=${id}. Maybe review was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating review with id=" + id
            });
        });
};

// Delete a review with the specified id in the request
exports.deleteReview = async (req, res) => {
    const id = req.body.rid;
    await Review.destroy({
        where: { rid: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "review was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete review with id=${id}. Maybe review was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete review with id=" + id
            });
        });
};