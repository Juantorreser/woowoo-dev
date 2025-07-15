
// src/pages/ManageUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const ManageUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    account: '',
    services: '',
    description: '',
    enabled: '',
    region: '',
    city: '',
    format: '',
    stripeAccount: '',
    servicePrices: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`);
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          password: data.password || '',
          account: data.account || '',
          services: data.services || '',
          description: data.description || '',
          enabled: data.enabled || '',
          region: data.region || '',
          city: data.city || '',
          format: data.format || '',
          stripeAccount: data.stripeAccount || '',
          servicePrices: data.servicePrices || '',
        });
        setLoading(false);
      } catch (error) {
        setError('There was an error fetching the user!');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
        uid: userId, // Include uid as expected by the backend
        ...formData,
      });
      navigate('/admin-account-search');
    } catch (error) {
      setError('There was an error updating the user!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1>Manage User</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formAccount">
          <Form.Label>Account</Form.Label>
          <Form.Control
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formServices">
          <Form.Label>Services</Form.Label>
          <Form.Control
            type="text"
            name="services"
            value={formData.services}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formEnabled">
          <Form.Label>Enabled</Form.Label>
          <Form.Control
            as="select"
            name="enabled"
            value={formData.enabled}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formRegion">
          <Form.Label>Region</Form.Label>
          <Form.Control
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formFormat">
          <Form.Label>Format</Form.Label>
          <Form.Control
            type="text"
            name="format"
            value={formData.format}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formStripeAccount">
          <Form.Label>Stripe Account</Form.Label>
          <Form.Control
            type="text"
            name="stripeAccount"
            value={formData.stripeAccount}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formServicePrices">
          <Form.Label>Service Prices</Form.Label>
          <Form.Control
            type="text"
            name="servicePrices"
            value={formData.servicePrices}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default ManageUser;
