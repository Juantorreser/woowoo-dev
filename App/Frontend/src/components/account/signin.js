import React, { useState } from "react";
//import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import './signin.css';
import { app } from '../firebase/firebase-config';
import {signInWithEmailAndPassword, getAuth } from 'firebase/auth';

//firebase authentication instance
const auth = getAuth(app);

//signin form schema for validation
const schema = yup.object().shape({
	email: yup
	.string()
	.email('invalid email')
	.required('An email address is required.'),
	password: yup
		.string()
		.trim()
		.min(8, 'Your password must be at least 8 characters.')
		.max(64, 'Your password must be no more than 64 characters')
		.required('A password is required.')
});

const SignInForm = (props) => {
	const email = props.email;
	//const password = props.password;
	//const values = { email, password };
	const handleChange = props.handleChange;

	//object destructuring
	const {
		//errors,
		//touched,
		//handleSubmit,
		//isValid,
		setFieldTouched,
	} = props;
	
	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	return(
		<form onChange={props.handleChange} onSubmit={props.handleSubmit} >
			<div className="loginForm">
				<div className='middleBlurb'>
					<div className="email">
					<fieldset>
						<label>
							<p className="formTag">Email</p>
							<input 
								id="email"
								label="Email"
								type="email"
								className="formField"
								name="email"
								autoComplete="email"
								autoFocus
								required
								value={email}
								onChange={() => change.bind(null, 'email')}
							/>
						</label>
					</fieldset>
					</div>
					<fieldset>
						<p className="formTag">Password</p>
						<input 
							id="password"
							className="formField"
							type="password"
						/>
					</fieldset>
				</div>
				<div className="bottomBlurb">
					<div className="loginButton">
						<button type="submit" className="btn--login">Sign In</button>
					</div>
					<div className="register">
						<a href="/signup">Don&apos;t have an account?<br/>Sign up</a>
					</div>
				</div>
			</div>
		</form>
	);
};

const SignIn = () => {
	// TODO: "setLoading" is apparently never used but "loading" is, figure out if this is deleteable
	const [loading, setLoading] = useState(false);
	//const [isLoggedIn, setIsLoggedIn] = useState(false); // only here just in case
	//const navigate = useNavigate(); // lets us get sent to another page or somethin

	if (loading) {
		return <h4>Logging in...</h4>;
	}

	return (
		<div className='hero'>
			<div className="triangle">  
				<div className="container">
					<Formik
						render={(props) => <SignInForm {...props} />}
						validationSchema={schema}
						initialValues={
							{ 
								email: '', 
								password: '' 
							}
						}
						onSubmit={(data, { setSubmitting }) => {
							//setSubmitting keeps track of whether you are in the midst of submitting data
							setSubmitting(true);
							(async () => {
								try {
									await signInWithEmailAndPassword(auth, data.email, data.password)
										.then(user => {
											//this 'user' response needs to be added to the session so we can check the token when making requests. 
											//unauthorized behaviour also needs to be caught in many places. 
											return auth.currentUser.getIdToken(true)
											.then((token) => {
												// sets the session cookie
												// setting the cookie using document is not the safest solution, 
												// this should be looked at - Steven Sonvisen 
												document.cookie = '__session=' + token + ';max-age=3600';
											})
										})
										.then(() => {
											//redirects to the 'home' page
											window.location.assign('/');
										})
									console.log(data);
								} catch (error) {
									console.log("Fetch API error - post" + error);
									alert("Error: Username or password is incorrect");
								}
							})();
							setSubmitting(false);
						}}
					>
					</Formik>
				</div>
			</div>
		</div>
	);
}

export default SignIn;