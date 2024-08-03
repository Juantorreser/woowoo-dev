// src/components/pages/RegisterUser.js
import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        fbid: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isHealer: false,
        description: '',
        address: '',
        city: '',
        province: '',
        country: '',
        postal: '',
        services: '',
        region: '',
        format: 0,
        servicePrices: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/users', formData);
            setMessage('User registered successfully!');
            setError('');
        } catch (err) {
            setError('Error registering user: ' + err.response.data.message);
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Facebook ID:
                    <input type="text" name="fbid" value={formData.fbid} onChange={handleChange} />
                </label>
                <br />
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Healer:
                    <input type="checkbox" name="isHealer" checked={formData.isHealer} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </label>
                <br />
                <label>
                    City:
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Province:
                    <input type="text" name="province" value={formData.province} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Country:
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Postal Code:
                    <input type="text" name="postal" value={formData.postal} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Services:
                    <input type="text" name="services" value={formData.services} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Region:
                    <input type="text" name="region" value={formData.region} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Format:
                    <input type="number" name="format" value={formData.format} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Service Prices:
                    <input type="text" name="servicePrices" value={formData.servicePrices} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegisterUser;




