
import React, { useEffect, useState } from "react";
import axios from 'axios';
import './search.css';
import './healerFrame.css';
import Booking from '../Booking';
import { Formik, Form, Field } from 'formik';
import FormRatings, { Stars } from 'form-ratings';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase/firebase-config';

//firebase authentication instance
const auth = getAuth(app);

const HealerModal = ({ healerState, setExpandedTicket, bookingModal, setBookingModal, reviewModal, setReviewModal, availability }) => {
    const [reviews, setReviews] = useState(null);
    const [avgReview, setAvgReview] = useState(null);
    const [currentUser, setCurrentUser] = useState();

    const toFormattedDateString = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const timeString = hours >= 12 ? 
            `${hours - 12 || 12}:${minutes.toString().padStart(2, '0')} PM` : 
            `${hours || 12}:${minutes.toString().padStart(2, '0')} AM`;
        
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${timeString}`;
    };

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        const getReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/review/${healerState.uid}`);
                const reviewsData = response.data;
                const reviewTotal = reviewsData.reduce((acc, review) => acc + review.rating, 0);
                const avgReviews = reviewsData.length > 0 ? reviewTotal / reviewsData.length : 0;

                setAvgReview(avgReviews);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        getReviews();
    }, [healerState.uid]);

    if (bookingModal) {
        return (
            <div className="healerClicked">
                <div className="closeModal" onClick={() => {
                    setExpandedTicket(false);
                    setBookingModal(false);
                }}>
                </div>
                <div className="singleHealer"> {healerState.name}
                    <div className="bookerSelected">
                        <div className="healerSelectedTop">
                            <p>{healerState.firstName} {healerState.lastName}</p>
                        </div>
                        <div className="healerSelectedMiddle">
                            <p>{healerState.services}</p>
                        </div>
                        <hr />
                        <Booking healer={healerState} /> {/*Booking.js*/}
                    </div>
                </div>
            </div>
        );
    } else if (reviewModal) {
        return (
            <div className="healerClicked">
                <div className="closeModal" onClick={() => {
                    setExpandedTicket(false);
                    setReviewModal(false);
                }}>
                </div>
                <div className="singleHealer"> {healerState.name}
                    <div className="reviewSelected">
                        <div className="healerSelectedTop">
                            <p>{healerState.firstName} {healerState.lastName}</p>
                        </div>
                        <div className="healerSelectedMiddle">
                            <p>{healerState.services}</p>
                        </div>
                        <hr />
                        <Formik
                            initialValues={{
                                "rating": 0,
                                "comment": ''
                            }}
                            onSubmit={(values, actions) => {
                                try {
                                    (async () => {
                                        values.reviewee = healerState.uid;
                                        values.reviewer = currentUser.uid;
                                        await axios.post('http://localhost:8080/review', values);
                                    })();
                                } catch (err) {
                                    console.log(err);
                                }
                            }}
                        >
                            {({ handleSubmit, values }) => (
                                <div className="reviewFormContainer">
                                    <Form
                                        className="reviewForm"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="reviewPageContainer">
                                            <div className="reviewRatingContainer">
                                                <p>Rating:</p>
                                                <Field
                                                    name="rating"
                                                    as={FormRatings}
                                                    id="reviewRating"
                                                    className="star-rating"
                                                />
                                            </div>
                                            <div className="reviewDescriptionContainer">
                                                <p>Review:</p>
                                                <Field
                                                    name="comment"
                                                    as="textarea"
                                                    id="reviewDescription"
                                                />
                                            </div>
                                            <div className="reviewSubmitButton">
                                                <button type="submit" className="btn">Submit</button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="healerClicked">
                <div className="closeModal" onClick={() => {
                    setExpandedTicket(false);
                }}>
                </div>
                <div className="singleHealer"> {healerState.name}
                    <div className="healerSelected">
                        <div className="healerSelectedColumn2">
                            <div className="healerSelectedTop">
                                <p>{healerState.firstName} {healerState.lastName}</p>
                            </div>
                            <div className="healerSelectedMiddle">
                                <p>{healerState.services.replace(',', ', ')}</p>
                            </div>
                            <hr />
                        </div>
                        <div className="description">
                            <pre>{healerState.description}</pre>
                        </div>
                    </div>
                    <div className="availabilityContainer">
                        <div className="availabilityHeader">
                            <h2>Availability</h2>
                            <hr />
                        </div>
                        <div className="availabilityDetails">
                            {availability ? availability.map((slot, index) => (
                                <div key={index}>
                                    <p>{toFormattedDateString(slot.start)} - {toFormattedDateString(slot.end)}</p>
                                </div>
                            )) : <p>Loading availability...</p>}
                        </div>
                    </div>
                    <div className="reviewContainer">
                        <div className="reviewHeaderContainer">
                            <div className="reviewTop">
                                <h1 className="reviewHeader">Reviews</h1>
                            </div>
                            <div className="reviewMiddle">
                                <div className="reviewStars">
                                    {
                                        avgReview == null ? <p>No Reviews Yet</p> : <Stars value={avgReview} />
                                    }
                                </div>
                            </div>
                            <hr />
                        </div>
                        
                        <div className="reviewsContainer">
                            {
                                reviews ? reviews.map((review) => {
                                    return (
                                        <div className="singleReview" key={review.rid}>
                                            <div>
                                                <p>{
                                                    toFormattedDateString(review.createdAt)
                                                    }</p>
                                            </div>
                                            <div className="reviewStars">
                                                <Stars
                                                    value={review.rating}
                                                    color="grey"
                                                />
                                            </div>
                                            <div className="reviewText">
                                                <pre>{review.comment}</pre>
                                            </div>
                                        </div>
                                    )
                                }) : <p id="noReviewText">No Reviews Yet!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HealerModal;
