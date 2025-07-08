import "./Login.css";
import { useEffect, useState } from 'react';
import { Button } from '../Button/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebase-config';
import axios from 'axios';
import { MultiSelect } from 'react-multi-select-component';

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Min 8 characters').max(64).required('Password is required')
});

const registerSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    address: yup.string(),
    city: yup.string(),
    province: yup.string(),
    country: yup.string(),
    postalCode: yup.string(),
    phone: yup.string(),
    isHealer: yup.boolean(),
    services: yup.array(),
    format: yup.number(),
    description: yup.string(),
    terms: yup.boolean().oneOf([true], 'You must accept the terms'),
});


const Login = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const [isRegistered, setIsRegistered] = useState(true);
    const [options, setOptions] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const auth = getAuth(app);

    useEffect(() => {
        if (!isRegistered) {
            axios.get(`${baseUrl}/enabledServices`)
                .then((res) => {
                    const formatted = res.data.map((s) => ({ label: s.service, value: s.sid }));
                    setOptions(formatted);
                });
        }
    }, [isRegistered]);

    const showForm = () => {
        if (!isRegistered) {
            return (
                <Formik
                    initialValues={{
                        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
                        address: '', city: '', province: '', country: '', postalCode: '', phone: '',
                        isHealer: false, services: [], format: 0, description: '', terms: false
                    }}
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
                                password: values.password,
                                address: values.address,
                                city: values.city,
                                province: values.province,
                                country: values.country,
                                postal: values.postalCode,
                                phone: values.phone,
                                isHealer: values.isHealer,
                                format: values.format,
                                description: values.description,
                                terms: values.terms,
                                services: selectedServices.map(s => s.value)
                            };


                            const response = await axios.post(`${baseUrl}/users`, newUser);
                            window.location.assign(response.data?.url || '/');
                        } catch (err) {
                            alert("Error during registration: " + err.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="firstName" value={values.firstName} onChange={handleChange} placeholder="First Name" />
                            {touched.firstName && errors.firstName && <div className="error">{errors.firstName}</div>}

                            <input type="text" name="lastName" value={values.lastName} onChange={handleChange} placeholder="Last Name" />
                            {touched.lastName && errors.lastName && <div className="error">{errors.lastName}</div>}

                            <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="Email" />
                            {touched.email && errors.email && <div className="error">{errors.email}</div>}

                            <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="Password" />
                            {touched.password && errors.password && <div className="error">{errors.password}</div>}

                            <input type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
                            {touched.confirmPassword && errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

                            <input type="text" name="address" value={values.address} onChange={handleChange} placeholder="Address" />
                            <input type="text" name="city" value={values.city} onChange={handleChange} placeholder="City" />
                            <input type="text" name="province" value={values.province} onChange={handleChange} placeholder="Province" />
                            <input type="text" name="country" value={values.country} onChange={handleChange} placeholder="Country" />
                            <input type="text" name="postalCode" value={values.postalCode} onChange={handleChange} placeholder="Postal Code" />
                            <input type="text" name="phone" value={values.phone} onChange={handleChange} placeholder="Phone Number" />


                            <label>
                                <input
                                    type="checkbox"
                                    name="isHealer"
                                    checked={values.isHealer}
                                    onChange={(e) => setFieldValue("isHealer", e.target.checked)}
                                /> I am a healer
                            </label>

                            {values.isHealer && (
                                <>
                                    <label>Services Offered</label>
                                    <MultiSelect
                                        className="custom-multiselect"
                                        options={options}
                                        value={selectedServices}
                                        onChange={(selected) => {
                                            setSelectedServices(selected);
                                            setFieldValue("services", selected.map(s => s.value));
                                        }}
                                        overrideStrings={{
                                            allItemsAreSelected: "All selected",
                                            noOptions: "No options",
                                            search: "Search services...",
                                            selectAll: "Select all",
                                            selectSomeItems: "Select..."
                                        }}
                                    />

                                    <label>Delivery Format</label>
                                    <select name="format" value={values.format} onChange={handleChange}>
                                        <option value={0}>Both Online and In-Person</option>
                                        <option value={1}>In-Person Only</option>
                                        <option value={2}>Online Only</option>
                                    </select>

                                    <label>Personal Description</label>
                                    <textarea name="description" value={values.description} onChange={handleChange} />
                                </>
                            )}

                            <label>
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={values.terms}
                                    onChange={(e) => setFieldValue("terms", e.target.checked)}
                                />
                                I accept the terms
                            </label>
                            {touched.terms && errors.terms && <div className="error">{errors.terms}</div>}

                            <Button type="submit" className="btn btn-primary">Register</Button>
                        </form>
                    )}
                </Formik>
            );
        }

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
                        <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="Email" />
                        {touched.email && errors.email && <div className="error">{errors.email}</div>}

                        <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="Password" />
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
                <div className='header'>
                    <div className={isRegistered ? "active-tab" : ""} onClick={() => setIsRegistered(true)}>
                        <p>LOGIN</p>
                    </div>
                    <div className={!isRegistered ? "active-tab" : ""} onClick={() => setIsRegistered(false)}>
                        <p>REGISTER</p>
                    </div>
                </div>
                <div className='body'>
                    {showForm()}
                </div>
            </div>
        </section>
    );
};

export default Login;
