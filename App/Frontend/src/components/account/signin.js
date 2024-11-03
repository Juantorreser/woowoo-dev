import React, { useState } from "react";
import * as yup from 'yup';
import { Formik } from 'formik';
import './signin.css';
import { app } from '../firebase/firebase-config';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components

const auth = getAuth(app);

// Schema for form validation
const schema = yup.object().shape({
	email: yup
		.string()
		.email('Invalid email')
		.required('An email address is required.'),
	password: yup
		.string()
		.trim()
		.min(8, 'Your password must be at least 8 characters.')
		.max(64, 'Your password must be no more than 64 characters.')
		.required('A password is required.')
});

const SignInForm = (props) => {
	const { email, handleChange, handleSubmit, setFieldTouched } = props;

	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	return (
		<form onChange={handleChange} onSubmit={handleSubmit} className="w-100">

			<Row className="justify-content-center">
				<Col >
					<div className="loginForm">
						<fieldset>
							<label>
								<p className="formTag">Email</p>
								
								<input
									id="email" label="Email" type="email" className="formField form-control" name="email" autoComplete="email" autoFocus
									required
									value={email}
									onChange={change.bind(null, 'email')}
								/>
							</label>
						</fieldset>
						<div classname="my-5">
							<p></p>
						</div>
						<fieldset >
							<label>
								<p className="formTag">Password</p>
								<input
								id="password"
								type="password"
								className="formField form-control"
								name="password"
								required
								/>
							</label>
						</fieldset>

						<div className="loginButton text-center mt-3">
							<Button type="submit" className="btn-primary w-100" style={{ marginLeft: "0px" }}>Sign In</Button>
						</div>

						<div className="register text-center mt-3">
							<a href="/signup">Don't have an account?<br />Sign up</a>
						</div>
					</div>
				</Col>
			</Row>
		</form>
	);
};

const SignIn = () => {
	const [loading, setLoading] = useState(false);

	if (loading) {
		return <h4>Logging in...</h4>;
	}

	return (
		<Container fluid className="hero vh-100 d-flex justify-content-center align-items-center">
			<Row className="w-100">
				<Col>
					<div className="triangle"></div>
					<div className="container">
						<Formik
							render={(props) => <SignInForm {...props} />}
							validationSchema={schema}
							initialValues={{ email: '', password: '' }}
							onSubmit={(data, { setSubmitting }) => {
								setSubmitting(true);
								signInWithEmailAndPassword(auth, data.email, data.password)
								.then((user) => {
									return auth.currentUser.getIdToken(true).then((token) => {
									document.cookie = '__session=' + token + ';max-age=3600';
									window.location.assign('/');
									});
								})
								.catch((error) => {
									alert("Error: Username or password is incorrect");
								})
								.finally(() => setSubmitting(false));
							}}
						>
						</Formik>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default SignIn;
