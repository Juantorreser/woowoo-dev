import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase-config';
import axios from 'axios';
import './account.css';

const auth = getAuth(app);

const Account = () => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                axios.get('http://localhost:8080/users')
                    .then((response) => {
                        const foundUser = response.data.find(
                            (u) => u.email.toLowerCase() === user.email.toLowerCase()
                        );

                        if (foundUser) {
                            setUserDetails({
                                uid: foundUser.uid,
                                firstName: foundUser.firstName || '',
                                lastName: foundUser.lastName || '',
                                email: foundUser.email || '',
                                address: foundUser.address || '',
                                city: foundUser.city || '',
                                province: foundUser.province || '',
                                country: foundUser.country || '',
                                postal: foundUser.postal || '',
                                phone: foundUser.phone || '',
                                bio: foundUser.description || '',
                                services: foundUser.services || '',
                            });
                        }
                    });
            } else {
                alert("You must be logged in to access this page.");
                window.location.assign('/signin');
            }
        });
    }, []);

    if (!userDetails) {
        return (
            <div className="loaderContainer">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <div className="form-container">
                <Formik
                    enableReinitialize
                    initialValues={userDetails}
                    onSubmit={(values) => {
                        const payload = {
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            address: values.address,
                            city: values.city,
                            province: values.province,
                            country: values.country,
                            postal: values.postal,
                            phone: values.phone,
                            description: values.bio,
                            services: values.services
                        };

                        axios.put(`http://localhost:8080/users/${values.uid}`, payload)
                            .then((res) => {
                                alert("Changes saved!");
                            })
                            .catch((err) => {
                                console.error(err);
                                alert("There was an error saving changes.");
                            });
                    }}
                >
                    {({ values }) => (
                        <Form className="form-box">
                            <div className="form-row">
                                <div>
                                    <label>First Name</label>
                                    <Field name="firstName" placeholder="First Name" />
                                </div>
                                <div>
                                    <label>Last Name</label>
                                    <Field name="lastName" placeholder="Last Name" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="textarea-container">
                                    <label>Bio*</label>
                                    <Field as="textarea" name="bio" placeholder="Bio" maxLength="200" />
                                    <div className="char-count">{values.bio.length}/200</div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Address</label>
                                    <Field name="address" placeholder="Address" />
                                </div>
                                <div>
                                    <label>City</label>
                                    <Field name="city" placeholder="City" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Province</label>
                                    <Field name="province" placeholder="Province" />
                                </div>
                                <div>
                                    <label>Country</label>
                                    <Field name="country" placeholder="Country" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Postal Code</label>
                                    <Field name="postal" placeholder="Postal Code" />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <Field name="phone" placeholder="Phone" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="textarea-container">
                                    <label>Services*</label>
                                    <Field as="textarea" name="services" placeholder="Services" maxLength="200" />
                                    <div className="char-count">{values.services.length}/200</div>
                                </div>
                            </div>

                            <div className="button-row">
                                <button type="button" className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save changes</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Account;
