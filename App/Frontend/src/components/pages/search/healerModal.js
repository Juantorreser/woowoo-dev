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

const HealerModal = ({healerState, setExpandedTicket, bookingModal, setBookingModal, reviewModal, setReviewModal}) => {
    const [ reviews, setReviews ] = useState(null);
    const [ avgReview, setAvgReview ] = useState(null);
    const [ availability, setAvailability ] = useState(null);
	const [ currentUser, setCurrentUser ] = useState();

    //accepts a date string (returned from the api) 
    //returns a cleaned up date string returned.
    const toFormattedDateString = (dateString) => {
        const date = new Date(dateString);
        const year = 2000 + date.getYear() - 100;
        const day = date.getUTCDate();
        const month = date.getUTCMonth();
        const minutes = date.getMinutes();

		//a quick check to determine AM or PM
        const timeString = date.getUTCHours() > 12 ? 
        `${date.getUTCHours() - 12}:${minutes} PM`: 
        `${date.getUTCHours()}:${minutes} AM`;
        
        return `${year}-${month}-${day} ${timeString}`;
    };

    useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
		});

		//getReviews and getAvailability functions could alternatively be async immediately invoked anonymous functions and work the same..

		//when healer modal renders or rerenders, the reviews for the selected healer are fetched from the API
        const getReviews = async () => {
            await axios.get(`http://localhost:8080/review/${healerState.uid}`)
                .then((response) => {
                    let reviewTotal = 0;
                    const reviewAvgArray = response.data.map((review) => {
                        reviewTotal += review.rating;
                        return review.rating;
                    });

                    const avgReviews = reviewTotal/reviewAvgArray.length;

                    setAvgReview(avgReviews);
                    setReviews(response.data);
                });
        };

		//the availability api is not yet implemented as of July 2023
		/*
        const getAvailability = async () => {
            await axios.get(`http://localhost:8080/availability/${healerState.uid}`)
                .then((response) => {
                    setAvailability(response.data);
                });
        };

        getAvailability();
		*/
        getReviews();
    }, []);
	
	if (bookingModal) { //booking modal
		return (
			<div className="healerClicked">
				<div className="closeModal" onClick={() => {
					setExpandedTicket(false);
					setBookingModal(false);
				}}>
				</div>
				<div className="singleHealer"> {healerState.name} 
					{/*
					Produces an X to close the healer modal. Can also be closed by clicking outside the modal. 

					<div className="exit">
						<button className="exitButton exitButtonBack">
						</button>
						<button className="exitButton" onClick={() => {
							setExpandedTicket(false);
							setBookingModal(false);
						}}>
						</button>
					</div>
					*/}
					<div className="bookerSelected">
						<div className="healerSelectedTop">
							<p>{healerState.firstName} {healerState.lastName}</p>
						</div>
						<div className="healerSelectedMiddle">
							<p>{healerState.services}</p>
						</div>
						<hr/>
						<Booking healer={healerState}/> {/*Booking.js*/}
					</div>
				</div> 
			</div>
		)
	}
	else if (reviewModal) { //review modal
		return (
			<div className="healerClicked">
				<div className="closeModal" onClick={() => {
					setExpandedTicket(false);
					setReviewModal(false);
				}}>
				</div>
				<div className="singleHealer"> {healerState.name} 
					{/*
					<div className="exit">
						<button className="exitButton exitButtonBack">
						</button>
						<button className="exitButton" onClick={() => {
							setExpandedTicket(false);
							setReviewModal(false);
						}}>
						</button>
					</div>
					*/}
					<div className="reviewSelected">
						<div className="healerSelectedTop">
							<p>{healerState.firstName} {healerState.lastName}</p>
						</div>
						<div className="healerSelectedMiddle">
							<p>{healerState.services}</p>
						</div>
						<hr/>
						<Formik
							initialValues={{
								"rating": 0,
								"comment": ''
							}}
							onSubmit={(values, actions) => {
								try{
									(async () => {
										values.reviewee = healerState.uid;
										values.reviewer = currentUser.uid;
										axios.post('http://localhost:8080/review', values)
									})();
								}
								catch (err) {
									console.log(err);
								}
							}}
						>
							{

								({handleSubmit, values}) => (
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
								)
							}
						</Formik>
					</div>
				</div> 
			</div>
		)
	}
	else { //healer info modal
		return (
			<div className="healerClicked">
				<div className="closeModal" onClick={() => {
							setExpandedTicket(false);
						}}>
				</div>
				<div className="singleHealer"> {healerState.name} 
					{/*
					<div className="exit">
						<button className="exitButton exitButtonBack">
						</button>
						<button className="exitButton" onClick={() => {
							setExpandedTicket(false);
						}}>
						</button>
					</div>
					*/}
					<div className="healerSelected">
						<div className = "healerSelectedColumn2">
							<div className="healerSelectedTop">
								<p>{healerState.firstName} {healerState.lastName}</p>
							</div>
							<div className="healerSelectedMiddle">
								<p>{healerState.services.replace(',', ', ')}</p>
							</div>
							<hr/>
						</div>
						<div className="description">
							<pre>{healerState.description}</pre>
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
							<hr/>
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
		)
	}
}

export default HealerModal;