import React, { useEffect, useState } from "react";
import axios from "axios";
import "./search.css";
import "./healerFrame.css";
import Booking from "../Booking";
import { Formik, Form, Field } from "formik";
import FormRatings, { Stars } from "form-ratings";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase/firebase-config";

const auth = getAuth(app);

const HealerModal = ({
  healerState,
  setExpandedTicket,
  bookingModal,
  setBookingModal,
  reviewModal,
  setReviewModal,
  availability,
  clientAvailability,
}) => {
  const [reviews, setReviews] = useState([]);
  const [avgReview, setAvgReview] = useState(0);
  const [currentUserNumericId, setCurrentUserNumericId] = useState(null);

  const toFormattedDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const timeString =
      hours >= 12
        ? `${hours - 12 || 12}:${minutes.toString().padStart(2, "0")} PM`
        : `${hours || 12}:${minutes.toString().padStart(2, "0")} AM`;

    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")} ${timeString}`;
  };

  useEffect(() => {
    const fetchCurrentUser = () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const response = await axios.get("http://localhost:8080/users");
            const users = response.data;
            const currentUser = users.find((u) => u.email === user.email);
            if (currentUser) {
              setCurrentUserNumericId(currentUser.uid);
            } else {
              console.error("User not found in the user list");
            }
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        } else {
          setCurrentUserNumericId(null);
        }
      });
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/review/${healerState.uid}`
        );
        const reviewsData = response.data;
        const reviewTotal = reviewsData.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const avgReviews =
          reviewsData.length > 0 ? reviewTotal / reviewsData.length : 0;

        setAvgReview(avgReviews);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchCurrentUser();
    fetchReviews();
  }, [healerState.uid]);

  const handleReviewSubmit = async (values, actions) => {
    try {
      if (!currentUserNumericId) {
        console.error("User not authenticated");
        return;
      }

      const payload = {
        ...values,
        reviewee: healerState.uid,
        reviewer: currentUserNumericId,
      };

      await axios.post("http://localhost:8080/review", payload);

      const response = await axios.get(
        `http://localhost:8080/review/${healerState.uid}`
      );
      const reviewsData = response.data;
      const reviewTotal = reviewsData.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const avgReviews =
        reviewsData.length > 0 ? reviewTotal / reviewsData.length : 0;

      setAvgReview(avgReviews);
      setReviews(reviewsData);
      actions.resetForm();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (bookingModal) {
    return (
      <div className="healerClicked">
        <div className="singleHealer">
          {healerState.name}
          <div className="bookerSelected">
            {/* Close X Button */}
            <button
              className="modal-close-button"
              onClick={() => {
                setExpandedTicket(false);
                setBookingModal(false);
              }}
              aria-label="Close booking modal"
            >
              &times;
            </button>

            <div className="healerSelectedTop">
              <p>
                {healerState.firstName} {healerState.lastName}
              </p>
            </div>
            <div className="healerSelectedMiddle">
              <p>{healerState.services}</p>
            </div>
            <hr />
            <Booking healer={healerState} uid={currentUserNumericId} />
          </div>
        </div>
      </div>
    );
  }

  if (reviewModal) {
    return (
      <div className="healerClicked">
        <div className="singleHealer">
          {healerState.name}
          <div className="reviewSelected">
            {/* Close X Button */}
            <button
              className="modal-close-button"
              onClick={() => {
                setExpandedTicket(false);
                setReviewModal(false);
              }}
              aria-label="Close review modal"
            >
              &times;
            </button>

            <div className="healerSelectedTop">
              <p>
                {healerState.firstName} {healerState.lastName}
              </p>
            </div>
            <div className="healerSelectedMiddle">
              <p>{healerState.services}</p>
            </div>
            <hr />
            <Formik
              initialValues={{
                rating: 0,
                comment: "",
              }}
              onSubmit={handleReviewSubmit}
            >
              {({ handleSubmit }) => (
                <div className="reviewFormContainer">
                  <Form
                    className="reviewForm"
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "12px" }}
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
                          rows={4}
                        />
                      </div>
                      <div
                        className="reviewSubmitButton"
                        style={{ display: "flex", gap: "10px", justifyContent: "flex-start" }}
                      >
                        <button
                          type="submit"
                          id="bookingSubmitButton"
                          className="btn"
                          style={{ padding: "8px 16px", cursor: "pointer" }}
                        >
                          Submit
                        </button>
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
  }

  // Default display (no modals open)
  return (
    <div className="healerClicked">
      <div className="singleHealer">
        {healerState.name}
        <div className="healerSelected">
          <div className="healerSelectedColumn2">
            <div className="healerSelectedTop">
              <p>
                {healerState.firstName} {healerState.lastName}
              </p>
            </div>
            <div className="healerSelectedMiddle">
              <p>{healerState.services.replace(/,/g, ", ")}</p>
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
            {availability ? (
              availability.map((slot, index) => (
                <div key={index}>
                  <p>
                    {toFormattedDateString(slot.start)} -{" "}
                    {toFormattedDateString(slot.end)}
                  </p>
                </div>
              ))
            ) : (
              <p>Loading availability...</p>
            )}
          </div>
        </div>
        <div className="reviewContainer">
          <div className="reviewHeaderContainer">
            <div className="reviewTop">
              <h1 className="reviewHeader">Reviews</h1>
            </div>
            <div className="reviewMiddle">
              <div className="reviewStars">
                {avgReview === 0 ? (
                  <p>No Reviews Yet</p>
                ) : (
                  <Stars value={avgReview} />
                )}
              </div>
            </div>
            <hr />
          </div>

          <div className="reviewsContainer">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div className="singleReview" key={review.rid}>
                  <div>
                    <p>{toFormattedDateString(review.createdAt)}</p>
                  </div>
                  <div className="reviewStars">
                    <Stars value={review.rating} color="grey" />
                  </div>
                  <div className="reviewText">
                    <pre>{review.comment}</pre>
                  </div>
                </div>
              ))
            ) : (
              <p id="noReviewText">No Reviews Yet!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealerModal;
