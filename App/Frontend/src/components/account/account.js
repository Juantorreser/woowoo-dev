import { app } from '../firebase/firebase-config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import options from '../dropdown/Services.js';
import { MultiSelect } from 'react-multi-select-component';
import './account.css';
import { userSchema as schema } from './schema.js';
import { Button } from '../Button/button.js';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap 

const auth = getAuth(app);

/**
 * Helper function to render error messages for Formik.
 * @param {string} message - Error message to display.
 */
const renderError = (message) => <p className="warning">{message}</p>;

/**
 * Main Account component to manage user account details and settings.
 */
const Account = () => {
    const [userState, setUserState] = useState(null); // Stores the current authenticated user state.
    const [userDetails, setUserDetails] = useState(null); // Stores details of the logged-in user.
    const [userLocation, setUserLocation] = useState(null); // Stores the location details of the user.
    const [options, setOptions] = useState(); // Stores service options for healers.

    /**
     * Effect to check user authentication and fetch user data.
     */
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUserState(user);
                axios.get('http://localhost:8080/users').then((response) => {
                    for (const i of response.data) {
                        if (i.email.toLowerCase() === user.email.toLowerCase()) {
                            setUserDetails(i);
                            break;
                        }
                    }
                    try {
                        axios.post('http://localhost:8080/locations',
                            response.data.map((user) => user.uid)
                        ).then((response) => {
                            setUserLocation(response.data[0]);
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });
            } else {
                alert("Sorry. Please try to sign in again");
                window.location.assign('/signin');
            }
        });
        getServices();
    }, []);

    /**
     * Fetches available services from the backend and sets them as options.
     */
    const getServices = () => {
        axios.get('http://localhost:8080/services')
            .then((response) => {
                const responseOptions = response.data.map((service) => {
                    return { label: service.service, value: service.sid };
                });
                setOptions(responseOptions);
            });
    };

    return (
        <Container fluid className="Main">
            {userLocation ? (
                <Row className="justify-content-center">
                    {/* Left Section: User Info */}
                    <Col xs={12} md={5} className="mb-4">
                        <div className="userContainer">
                            <div className="healerSelectedColumn2">
                                <div className="healerSelectedTop" id="user-name">
                                    <p>{userDetails.firstName} {userDetails.lastName}</p>
                                </div>
                                <div className="healerSelectedMiddle" id="services">
                                    <DisplayServices options={options} userDetails={userDetails} />
                                </div>
                                <hr />
                                <div className="description" id="accountDescription">
                                    <p>{userDetails.description}</p>
                                </div>
                            </div>
                            {userDetails.account === 2 && (
                                <div className="text-center">
                                    <button onClick={() => window.location.assign('/admin')}>Admin dashboard</button>
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Right Section: Edit Form */}
                    <Col xs={12} md={5} className="mb-4, mr-5">
                        <div className="reviewContainer">
                            <div className="accountEditorHeaderContainer">
                                <h1 className="reviewHeader">Edit Account Info</h1>
                            </div>
                            <AccountForm userDetails={userDetails} userLocation={userLocation} />
                        </div>
                    </Col>
                </Row>
            ) : (
                <div className="loaderContainer">
                    <div className="loader"></div>
                </div>
            )}
        </Container>
    );
}

/**
 * Displays the list of services the user has selected.
 * @param {Object} props - Contains user details and service options.
 */
const DisplayServices = (props) => {
    let services = [];
    for (let service of JSON.parse("[" + props.userDetails.services + "]")) {
        services.push(service);
    }
    let displayServices = "";
    for (let element of services) {
        if (displayServices !== "") {
            displayServices += ", ";
        }
        displayServices += (props.options[element - 1].label);
    }
    return (
        <p>{displayServices}</p>
    );
}

/**
 * Form for editing account details including name, location, and healer options.
 * @param {Object} props - Contains user details and location details.
 */
const AccountForm = ({ userDetails, userLocation }) => {
    const [services, setServices] = useState([userDetails.services]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [options, setOptions] = useState([]);
    const [servicePrices, setServicePrices] = useState([]);

    /**
     * Fetches available services and sets them as options.
     */
    const getServices = () => {
        axios.get('http://localhost:8080/services')
            .then((response) => {
                const responseOptions = response.data.map((service) => {
                    return { label: service.service, value: service.sid };
                });
                setOptions(responseOptions);
            });
    };

    return (
        <div className="accountInfoEditorContainer">
            {submitting ? (
                <div>
                    <p>Making Changes</p>
                </div>
            ) : (
                <Formik
                    initialValues={{ 
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        email: userDetails.email,
                        password: "",
                        confirmPassword: "",
                        address: userLocation.address,
                        city: userDetails.city,
                        province: userDetails.province || "",
                        country: userDetails.country || "",
                        postalCode: userDetails.postalCode || "",
                        isHealer: userDetails.isHealer,
                        nameChanges: userDetails.nameChanges,
                        locationChanges: userDetails.locationChanges,
                        passwordChanges: userDetails.passwordChanges,
                        description: userDetails.description,
                        services: [],
                        servicePrices: [],
                        format: userDetails.format,
                        terms: true
                    }}
                    validationSchema={schema}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(true);
                        (async () => {
                            values.services.length = 0;
                            if (values.isHealer) {
                                services.forEach((service) => {
                                    values.services.push(service.value)
                                });
                                servicePrices.map((servicePrice) => {
                                    values.servicePrices.push(servicePrice);
                                });
                            }
                            values.uid = userDetails.uid;
                            if (values.servicePrices.length > 0) {
                                await axios.put('http://localhost:8080/users/' + values.uid, values)
                                    .then(response => {
                                        alert("Successfully changed the user's information");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            } else {
                                alert("The Service Prices are empty");
                            }
                            actions.setSubmitting(false);
                        })();
                    }}
                >
                {({ handleSubmit, values }) => (
                    <Form className="accountInfoEditorForm" onSubmit={handleSubmit}>
                        <div className="accountInfoEditorContainerContainer">
                            {/* Fields for user details */}
                            <p>First Name:</p>
                            <Field type="text" id="firstName" name="firstName" autoComplete="fname" required />
                            <ErrorMessage name="firstName" render={renderError} />

                            <p>Last Name:</p>
                            <Field type="text" id="lastName" name="lastName" autoComplete="lname" required />
                            <ErrorMessage name="lastName" render={renderError} />

                            <p>Email:</p>
                            <Field id="email" type="email" name="email" autoComplete="email" required />
                            <ErrorMessage name="email" render={renderError} />

                            <p>Password:</p>
                            <Field type="password" name="password" id="password" autoComplete="current-password" required />
                            <ErrorMessage name="password" render={renderError} />

                            <p>Confirm Password:</p>
                            <Field type="password" name="confirmPassword" id="confirmPassword" required />
                            <ErrorMessage name="confirmPassword" render={renderError} />

                            {/* Other settings */}
                            <div className="selectBox">
                                <p>Change location?</p>
                                <Field name="locationChanges" type="checkbox" id="locationChanges" />
                            </div>
                            {values.locationChanges && (
                                <>
                                    <p>Address:</p>
                                    <Field type="text" name="address" id="address" autoComplete="address" />
                                    <ErrorMessage name="address" render={renderError} />

                                    <p>City:</p>
                                    <Field type="text" name="city" id="city" autoComplete="city" />
                                    <ErrorMessage name="city" render={renderError} />

                                    <p>Province:</p>
                                    <Field type="text" name="province" id="province" autoComplete="province" />
                                    <ErrorMessage name="province" render={renderError} />

                                    <p>Country:</p>
                                    <Field type="text" name="country" id="country" autoComplete="country" />
                                    <ErrorMessage name="country" render={renderError} />

                                    <p>Postal Code:</p>
                                    <Field type="text" name="postalCode" id="postalCode" autoComplete="postalCode" />
                                    <ErrorMessage name="postalCode" render={renderError} />
                                </>
                            )}

                            <div className="nonTextSignupForm">
                                <div className="selectBox">
                                    <p>Are you a healer?</p>
                                    <Field name="isHealer" type="checkbox" id="isHealer" />
                                    <ErrorMessage name="isHealer" render={renderError} />
                                </div>
                                {values.isHealer && (
                                    <HealerOptions
                                        getServices={getServices}
                                        selectedServices={selectedServices}
                                        setSelectedServices={setSelectedServices}
                                        options={options}
                                        value={services}
                                        setServices={setServices}
                                        servicePrices={servicePrices}
                                        setServicePrices={setServicePrices}
                                    />
                                )}
                                <button type='submit' className="btn--login">Save</button>
                            </div>
                        </div>
                    </Form>
                )}
                </Formik>
            )}
        </div>
    );
}

/**
 * Options specific to healer accounts, such as services offered and pricing.
 * @param {Object} props - Contains services, selected services, and options.
 */
const HealerOptions = (props) => {
    useEffect(() => {
        props.getServices();
    }, []);

    return (
        <>
            <p>Services Offered:</p>
            <Field
                name="services"
                options={props.options}
                value={props.selectedServices}
                as={MultiSelect}
                onChange={(e) => { props.setSelectedServices(e); props.setServices(e); }}
            />
            <ErrorMessage name="services" render={renderError} />

            <ServicePrices
                selectedServices={props.selectedServices}
                servicePrices={props.servicePrices}
                setServicePrices={props.setServicePrices}
            />

            <p>Delivery Format: </p>
            <Field name="format" as="select" id="format">
                <option value={0}>Both Online and In-Person</option>
                <option value={1}>In-Person Only</option>
                <option value={2}>Online Only</option>
            </Field>
            <ErrorMessage name="format" render={renderError} />

            <p>Personal Description:</p>
            <Field name="description" as="textarea" id="signUpDescription" />
            <ErrorMessage name="description" render={renderError} />
        </>
    );
}

/**
 * Component to input service prices for healers.
 * @param {Object} props - Contains selected services and their prices.
 */
const ServicePrices = ({ selectedServices, setServicePrices, servicePrices }) => {
    return (
        <>
            <p>Service Prices</p>
            {selectedServices.map((service, index) => (
                <>
                    <Field
                        key={service.value}
                        type="text"
                        id={`servicePrice-${index}`}
                        name={`servicePrices[${index}]`}
                        label="Service Price"
                        autoComplete="sprices"
                        autoFocus
                        required
                        onChange={(e) => {
                            const updatedPrices = [...servicePrices];
                            updatedPrices[index] = e.target.value;
                            setServicePrices(updatedPrices);
                        }}
                    />
                    <ErrorMessage name="servicePrices" render={renderError} />
                </>
            ))}
        </>
    );
}

export default Account;
