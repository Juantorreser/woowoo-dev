import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './account.css';

const Account = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        bio: '',
        services: '',
    });

    return (
        <div className="account-page">

            <div className="form-container">
                <Formik
                    initialValues={userDetails}
                    onSubmit={(values) => {
                        console.log(values);
                        alert('Changes saved!');
                    }}
                >
                    {() => (
                        <Form className="form-box">
                            <div className="form-row">
                                <div>
                                    <label>First Name</label>
                                    <Field name="firstName" placeholder="Placeholder" />
                                </div>
                                <div>
                                    <label>Address Line</label>
                                    <Field name="address" placeholder="Placeholder" />
                                </div>
                                <div className="textarea-container" rowSpan={2}>
                                    <label>Bio*</label>
                                    <Field as="textarea" name="bio" placeholder="Placeholder" maxLength="200" />
                                    <div className="char-count">0/200</div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Last Name</label>
                                    <Field name="lastName" placeholder="Placeholder" />
                                </div>
                                <div>
                                    <label>City</label>
                                    <Field name="city" placeholder="Placeholder" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Email</label>
                                    <Field name="email" placeholder="Placeholder" />
                                </div>
                                <div>
                                    <label>Province</label>
                                    <Field name="province" placeholder="Placeholder" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Phone Number</label>
                                    <Field name="phone" placeholder="Placeholder" />
                                </div>
                                <div>
                                    <label>Country</label>
                                    <Field name="country" placeholder="Placeholder" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Postal Code</label>
                                    <Field name="postalCode" placeholder="Placeholder" />
                                </div>
                                <div className="textarea-container">
                                    <label>Services*</label>
                                    <Field as="textarea" name="services" placeholder="Placeholder" maxLength="200" />
                                    <div className="char-count">0/200</div>
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
