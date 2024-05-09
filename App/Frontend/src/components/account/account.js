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

const auth = getAuth(app);

const renderError = (message) => <p className="warning">{message}</p>;

const Account = () => {
	// TODO: Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
	//Above points at userState/setUserState having a useState of null
	const [ userState, setUserState ] = useState(null);
	const [ userDetails, setUserDetails ] = useState(null);
	const [ userLocation, setUserLocation ] = useState(null);

	//with the empty array parameter, useEffect should run this code block once on render (possibly when state variables are changed)
	useEffect(() => {
		//this method checks if the user is authenticated with firebase and essentially logged in.
		auth.onAuthStateChanged((user) => {
			setUserState(user);
			axios.post('http://localhost:8080/users/healers', {
				fbid: user.uid
			}).then((response) => {	
				setUserDetails(response.data[0]);
				try{
					axios.post('http://localhost:8080/locations', 
						response.data.map((user) => user.uid)
					).then((response) => {
						setUserLocation(response.data[0]);
					});
				}
				catch (err) {
					console.log(err);
				}
			});
		});
	}, []);
	
	return (
		<>
		{
			userLocation ? 
			<>
				<div className="userProfile">
					<div className="userContainer">
						<div className = "healerSelectedColumn2">
							<div className="healerSelectedTop" id="user-name">
								<p>{userDetails.firstName} {userDetails.lastName}</p>
							</div>
							<div className="healerSelectedMiddle" id="services">
								<p>{userDetails.services}</p>
							</div>
							<hr/>
							<div className="healerSelectedBottom">
								<div className='icons'>
									<div className="icons">
									</div>
								</div>
							</div>
						</div>
						<div className="description" id="accountDescription">
							<p>{userDetails.description}</p>
						</div>
					</div>
					<div className="reviewContainer">
						<div className="accountEditorHeaderContainer">
							<div className="reviewTop">
								<h1 className="reviewHeader">Edit Account Info</h1>
							</div>
							<div className="reviewMiddle">
								<div className="accountEditUnderText">
									<p>Save when finished making changes.</p>
								</div>
							</div>
						</div>
						<AccountForm userDetails={userDetails} userLocation={userLocation}/>
					</div>
				</div> 
			</>
			: 
			<>
				<div className="loaderContainer">
					<div className="loader"></div>
				</div>
			</>
		}
		</>
	)
}

//AccountForm component holds only the form-related components for user to make edits
//NOTE: ideally, we could have multiple components as children of AccountForm that make 
//update API calls only for those details that the user wants to be edited: 
//i.e.: Name/Email or password only, address only, healer-only options (currently implemented)
const AccountForm = ({userDetails, userLocation}) => {
	//services is for storing the selected service options -- options is for the service listing response
	//from the API/database
	const [ services, setServices] = useState([]);
	const [ submitting, setSubmitting ] = useState(false);
	const [ selectedServices, setSelectedServices] = useState([]);
	const [ options, setOptions ] = useState([]);

	//get listing of services and set the options state to the response. 
	const getServices = () => {
		axios.get('http://localhost:8080/services')
		.then((response) => {
			const responseOptions = response.data.map((service) => {
				return {label: service.service, value: service.sid};
			});
			setOptions(responseOptions);
		});
	};
	
	//TODO: Null values in Formik's initial values displays an error, see about finding a way to have null values replaced with an empty string
	return (
		<div className="accountInfoEditorContainer">
		{
			submitting ? 
			<div>
				<p>Making Changes</p>
			</div>
			: 
			<Formik 
				initialValues={{ 
					firstName: userDetails.firstName,
					lastName: userDetails.lastName,
					email: userDetails.email,
					password: "",
					confirmPassword: "",
					address: userLocation.address,
					city: userDetails.city,
					province: userDetails.province,
					country: userDetails.country,
					postalCode: userDetails.postalCode,
					isHealer: userDetails.isHealer,
					nameChanges: userDetails.nameChanges,
					locationChanges: userDetails.locationChanges,
					passwordChanges: userDetails.passwordChanges,
					description: userDetails.description,
					services: userDetails.services,
					format: userDetails.format
				}}
				validationSchema={schema}
				
				onSubmit={(values, actions) => {
					//TODO: Double check if this needs to be updated 
					console.log(values);
					//setSubmitting keeps track of whether you are in the midst of submitting data
					actions.setSubmitting(true);
					(async () => {
						services.forEach((service) => {
							values.services.push(service.value)
						})
						
					})();
				}}
			>
			{({handleSubmit, values}) => (
				<Form 
					className="accountInfoEditorForm"
					onSubmit={handleSubmit}
				>
					<div className="accountInfoEditorContainerContainer">
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

						<div className="selectBox">
							<p>Change location?</p>
							<Field 
								name="locationChanges" 
								type="checkbox"
								id="locationChanges"
							/>
						</div>
						{
							values.locationChanges ? (
								<>
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
								</>
							)
							: null
						}

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
											value={services}
											onChange={setServices}
											labelledBy="Services"
										/>
									) : null
								}
							<button type="submit" className="btn--login">Save</button>
						</div>
					</div>
				</Form>
				)}
			</Formik>
		}
		</div>
	);
}

//Healer-specific account settings. Should only be visible if the user selects the checkbox to indicate
//they want their account to be set as a healer. 
const HealerOptions = (props) => {
	//on render, makes the call to the services API. Prevents too many calls on page load.
	useEffect(() => {
		props.getServices()
	}, [])
	
	return (
	<>
		<p>Services Offered:</p>
		<Field
			name="services"
			options={props.options}
			value={props.selectedServices}
			as={MultiSelect}
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

export default Account;