import "./Login.css";
import { useState } from 'react';
import { Button } from '../Button/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebase-config';
import axios from 'axios';

// Yup schema for login validation
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Min 8 characters').max(64).required('Password is required')
});

// Yup schema for registration validation
const registerSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
});

const Login = () => {
    const [isRegistered, setIsRegistered] = useState(true); // Toggle between login/register views

    // Render either login or register form
    const showForm = () => {
        const auth = getAuth(app);

        // REGISTER FORM
        if (!isRegistered) {
            return (
                <Formik
                    initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
                    validationSchema={registerSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                            const token = await auth.currentUser.getIdToken(true);
                            document.cookie = `__session=${token};max-age=3600`;

                            const newUser = {
                                fbid: userCredential.user.uid,
                                firstName: values.firstName,
                                lastName: values.lastName,
                                email: values.email,
                            };

                            const response = await axios.post('http://localhost:8888/users', newUser);

                            // Redirect to provided URL or home
                            window.location.assign(response.data?.url || '/');
                        } catch (err) {
                            alert("Error during registration: " + err.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="login-fName">First Name</label>
                            <input
                                type="text"
                                id="login-fName"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                            {touched.firstName && errors.firstName && <div className="error">{errors.firstName}</div>}

                            <label htmlFor="login-lName">Last Name</label>
                            <input
                                type="text"
                                id="login-lName"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            {touched.lastName && errors.lastName && <div className="error">{errors.lastName}</div>}

                            <label htmlFor="login-email">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                            />
                            {touched.email && errors.email && <div className="error">{errors.email}</div>}

                            <label htmlFor="login-pwd">Password</label>
                            <input
                                type="password"
                                id="login-pwd"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                placeholder="password"
                            />
                            {touched.password && errors.password && <div className="error">{errors.password}</div>}

                            <Button type="submit" className="btn btn-primary">Register</Button>
                        </form>
                    )}
                </Formik>
            );
        }

        // LOGIN FORM
        return (
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        await signInWithEmailAndPassword(auth, values.email, values.password);
                        const token = await auth.currentUser.getIdToken(true);
                        document.cookie = `__session=${token};max-age=3600`;
                        window.location.assign('/');
                    } catch (err) {
                        alert("Incorrect email or password");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="login-email">Email</label>
                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />
                        {touched.email && errors.email && <div className="error">{errors.email}</div>}

                        <label htmlFor="login-pwd">Password</label>
                        <input
                            type="password"
                            id="login-pwd"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="password"
                        />
                        {touched.password && errors.password && <div className="error">{errors.password}</div>}

                        <Button type="submit" className="btn btn-primary">Login</Button>
                    </form>
                )}
            </Formik>
        );
    };

    return (
        <section id='login'>
            <div className='login-card'>
                {/* Tabs to toggle between Login/Register */}
                <div className='header'>
                    <div
                        className={isRegistered ? "active-tab" : ""}
                        onClick={() => setIsRegistered(true)}
                    >
                        <p>LOGIN</p>
                    </div>
                    <div
                        className={!isRegistered ? "active-tab" : ""}
                        onClick={() => setIsRegistered(false)}
                    >
                        <p>REGISTER</p>
                    </div>
                </div>

                {/* Rendered form section */}
                <div className='body'>
                    {showForm()}
                </div>
            </div>
        </section>
    );
};

export default Login;
