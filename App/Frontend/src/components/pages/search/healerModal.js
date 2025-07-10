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
}) => {
  const [reviews, setReviews] = useState([]);
  const [avgReview, setAvgReview] = useState(0);
  const [currentUserNumericId, setCurrentUserNumericId] = useState(null);

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
    } finally {
      setReviewModal(false); // close modal always after submit
    }
  };

  if (bookingModal) {
    return (
      <div className="healerClicked">
        <div className="singleHealer">
          {healerState.name}
          <div className="bookerSelected">
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
              <Stars value={avgReview} />
              <p style={{ fontSize: "14px", color: "#666" }}>
                {avgReview.toFixed(1)} out of 5
              </p>

              {/* Reviews Container */}
              <div
                className="reviewsContainer"
                style={{
                  marginTop: 0,
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#ccc transparent",
                }}
              >
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      className="singleReview"
                      key={review.rid}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "12px",
                        border: "1px solid #eee",
                        borderRadius: "6px",
                        fontWeight: "300",
                        fontSize: "14px",
                        color: "#444",
                        lineHeight: "1.4",
                        backgroundColor: "#fff",
                        minHeight: "100px",
                        minWidth: "220px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <Stars value={review.rating} color="#f39c12" />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className="reviewText"
                        style={{ whiteSpace: "pre-wrap", flexGrow: 1, color: "#333" }}
                      >
                        {review.comment}
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      fontWeight: "300",
                      color: "#999",
                      fontSize: "14px",
                    }}
                  >
                    No Reviews Yet!
                  </p>
                )}
              </div>
            </div>

            <hr />

            {/* Review form */}
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
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div className="reviewPageContainer">
                      <div
                        className="reviewRatingContainer"
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <p style={{ margin: 0 }}>Rating:</p>
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
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-start",
                        }}
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

  return null;
};

export default HealerModal;
