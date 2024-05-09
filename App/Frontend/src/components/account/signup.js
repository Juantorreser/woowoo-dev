import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import $ from 'jquery';
import './signin.css';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import axios from 'axios';
import { app } from '../firebase/firebase-config';
import { MultiSelect } from 'react-multi-select-component'; 
import { userSchema as schema } from './schema.js';

const auth = getAuth(app);

const renderError = (message) => <p className="warning">{message}</p>;
const SignUp = () => {
    const [ loading, setLoading ] = useState(false);
	const [ loggedIn, setLoggedIn ] = useState(false);
	const [ selectedServices, setSelectedServices] = useState([]);
	const [ format, setFormat ] = useState(0);
	const [ options, setOptions ] = useState([]);
	
	//a reusable call to get the services listing from the API. 
	const getServices = () => {
		axios.get('http://localhost:8080/services')
		.then((response) => {
			const responseOptions = response.data.map((service) => {
				return {label: service.service, value: service.sid};
			});
			setOptions(responseOptions);
		});
	};

    const history = useNavigate(); // let's us get sent to another page or something
	
	auth.onAuthStateChanged((user) => {
		setLoggedIn(user);
	});

	if(loggedIn){
		return (
			<div className="loaderContainer">
				<div className="loader"></div>
			</div>
		)
	} else {
		return (
			<div className='hero'>
				<div className="triangle">  
					<div className="container">
						<Formik
							initialValues={{
								firstName: "",
								lastName: "",
								email: "",
								password: "",
								confirmPassword: "",
								address: "",
								city: "",
								province: "",
								country: "",
								postalCode: "",
								isHealer: false,
								services: [],
								format: 0,
								description: "",
								terms: false
							}}
							validationSchema={schema}
							
							onSubmit={(values, actions) => {
								//TODO: If registration fails due to it failing against the schema, alert the user
								//setSubmitting keeps track of whether you are in the midst of submitting data
								actions.setSubmitting(true);
								(async () => {
									selectedServices.forEach((service) => {
										values.services.push(service.value)
									})

									//the client-side method from firebase which handles user creation. 
									//there should be a fallback for this if the user db entry is created and the firebase
									//user is unable to be created, or vice-versa
									createUserWithEmailAndPassword(auth, values.email, values.password)
										.then((userCredential) => {
											// Signed in 
											values.fbid = userCredential.user.uid
											const user = userCredential.user.getIdToken()
												.then((token) => {
													document.cookie = '__session=' + token + ';max-age=3600';
												})
										})
										.then(() => {
										//the database entry should only happen after a successful firebase insert
										axios.post('http://localhost:8080/users', values)
											.then((response)=>{
												if(response.data){
													console.log(response.data);
												}
												setLoading(false);
												actions.setSubmitting(false);
											})
											.then(() => {
												window.location.assign('/');
											})
										})
										
									.catch((error) => {
										console.log("User API Creation Error: " + error);
										alert(error);
										alert("TODO: Replace this with user friendly error messages");
									})
								})();
							}}
						>
							{({handleSubmit, values}) => (
								<div className="signupFormContainer">
									<Form 
										className="signupForm"
										onSubmit={handleSubmit}
									>
										<div className="signupPageContainer">
											<p>First Name:</p>
											<Field
												type="text"
												id="firstName"
												name="firstName"
												label="First Name"
												autoComplete="fname"
												autoFocus
												required
												/>
											<ErrorMessage name="firstName" render={renderError} />
											
											<p>Last Name:</p>
											<Field
												type="text"
												id="lastName"
												name="lastName"
												label="Last Name"
												autoComplete="lname"
												required
											/>
											<ErrorMessage name="lastName" render={renderError} />
											
											<p>Email:</p>
											<Field
												id="email"
												label="Email"        
												type="email"
												name="email"
												autoComplete="email"
												required
											/>
											<ErrorMessage name="email" render={renderError} />
											
											<p>Password:</p>
											<Field
												label="Password"
												type="password"
												name="password"
												id="password"
												autoComplete="current-password"
												required
											/>
											<ErrorMessage name="password" render={renderError} />
											
											<p>Confirm Password:</p>
											<Field
												label="Confirm Password"
												type="password"
												name="confirmPassword"
												id="confirmPassword"
												autoComplete="current-password-confirm"
												required
											/>
											<ErrorMessage name="confirmPassword" render={renderError} />
										
											<p>Address:</p>
											<Field
												label="Address"
												type="text"
												name="address"
												id="address"
												autoComplete="address"
											/>
											<ErrorMessage name="address" render={renderError} />
											
											<p>City:</p>
											<Field
												label="City"
												type="text"
												name="city"
												id="city"
												autoComplete="city"
											/>
											<ErrorMessage name="city" render={renderError} />
											
											<p>Province:</p>
											<Field
												label="Province"
												type="text"
												name="province"
												id="province"
												autoComplete="province"
											/>
											<ErrorMessage name="province" render={renderError} />
											
											<p>Country:</p>
											<Field
												label="Country"
												type="text"
												name="country"
												id="country"
												autoComplete="country"
											/>
											<ErrorMessage name="country" render={renderError} />
											
											<p>Postal Code:</p>
											<Field
												label="Postal code"
												type="text"
												name="postalCode"
												id="postalCode"
												autoComplete="postalCode"
											/>
											<ErrorMessage name="postalCode" render={renderError} />
		
											<div className="nonTextSignupForm">
												<div className="selectBox">
													<p>Are you a healer?</p>
													<Field 
														name="isHealer" 
														type="checkbox"
														id="isHealer"
													/>
													<ErrorMessage name="isHealer" render={renderError} />
												</div>
													{
													values.isHealer ? (
														<HealerOptions 
															getServices={getServices}
															selectedServices={selectedServices} 
															setSelectedServices={setSelectedServices}
															options={options}
														/>
													) : null
												}
												<div className="selectBox">
													<p>I accept the terms and conditions</p>
													<Field
														className="termsCheckbox"
														type="checkbox"
														name="terms"
														required
													/>
													<ErrorMessage name="terms" render={renderError} />
												</div>
												<button type="submit" className="btn--login">Register</button>
											</div>
										</div>
									</Form>
									<div className="signin">
										<a href="/signin">Already have an account?<br/>Sign in</a>
									</div>
								</div>
							)}
						</Formik>
					</div>
				</div>
			</div>
		);
	}
}

//similarly to the Account edit page, Healer options defines the fields related only to 
//those users who wish to be healers and listed in the healer search. 
const HealerOptions = (props) => {
	//on render, fetches the services from the service API, limiting network calls until needed. 
	useEffect(() => {
		props.getServices()
	}, [])
	
	return (
	<>
		<p>Services Offered:</p>
		<Field
			name="services"
			as={MultiSelect}
			options={props.options}
			value={props.selectedServices}
			onChange={props.setSelectedServices}
		/>
		<ErrorMessage name="services" render={renderError} />
		
		<p>Delivery Format: </p>
		<Field 
			name="format" 
			as="select" 
			id="format"
		>
			<option value={0} label="Both Online and In-Person"></option>
			<option value={1} label="In-Person Only"></option>
			<option value={2} label="Online Only"></option>
		</Field>
		<ErrorMessage name="format" render={renderError} />
		
		<p>Personal Description:</p>
		<Field
			name="description" 
			as="textarea"
			id="signUpDescription"
		/>
		<ErrorMessage name="description" render={renderError} />
		
		<br/>
	</>
	)
}

export default SignUp;