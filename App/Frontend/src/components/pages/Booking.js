import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Box } from '@material-ui/core';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Booking.css';
import './calendar.css';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase-config';
const auth = getAuth(app);

const DefaultDayPicker = ({ onDateSelected }) => {
    const [date, setDate] = useState(new Date());

    function handleDateSelected(dateSelected) {
        setDate(dateSelected);
        onDateSelected(dateSelected);
    }

    return (
        <Box style={{ width: '100%' }}>
            <Calendar
                className="calendar"
                date={date}
                onChange={(date) => handleDateSelected(date)}
                minDate={new Date()}
                maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
            />
        </Box>
    );
};

const ServiceField = ({ serviceOptions, setSelectedService }) => {
    const { setFieldValue } = useFormikContext();

    const handleServiceChange = (event) => {
        const service = event.target.value;
        setFieldValue('service', service);
        setSelectedService(service);
    };

    return (
        <Field name="service" as="select" id="service" onChange={handleServiceChange}>
            <option value="" label="Select service" />
            {serviceOptions.map((service, index) => (
                <option key={index} value={service}>{service}</option>
            ))}
        </Field>
    );
};

const BookingForm = ({ healer, selectedDate, uid }) => {
    const serviceOptions = healer.services.split(',');
    var priceOptions = [];

    if (healer.servicePrices == null) {
        alert("This user does not have price. Please check again");
        window.location.assign("/home");
    } else {
        if (healer.servicePrices.indexOf(",") > -1) {   //multiple prices
            const priceOptionsArray = healer.servicePrices.split(',');
            priceOptionsArray.map(price => {
                priceOptions.push((Number(price) * 100).toString());
            })
        } else {  //single price
            priceOptions.push((Number(healer.servicePrices) * 100).toString());
        }
    }

    const [timeSlots, setTimeSlots] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedService, setSelectedService] = useState('');

    // Fixed fake time slots between 10am and 3:30pm every 30 min
    const fixedTimeSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
    ];

    useEffect(() => {
        if (selectedDate && selectedService) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            console.log(`Fetching availability for healer ID: ${healer.uid} on date: ${formattedDate} service: ${selectedService}`);
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/availability/:uid?healer=${healer.uid}&date=${formattedDate}&service=${selectedService}`)
                .then(response => {
                    console.log('API Response:', response.data);
                    const availabilities = response.data;

                    // Extract all time slots from API response
                    const allTimeSlots = availabilities.reduce((acc, availability) => {
                        if (availability.timeslots) {
                            return acc.concat(availability.timeslots);
                        }
                        return acc;
                    }, []);
                    setTimeSlots(allTimeSlots.length > 0 ? allTimeSlots : []);
                })
                .catch(error => {
                    console.error("There was an error fetching the time slots!", error);
                });
        }
    }, [selectedDate, selectedService, healer.uid]);

    return (
        <Formik
            initialValues={{
                service: "",
                time: ""
            }}
            validate={(values) => {
                const errors = {};
                if (!values.service) {
                    errors.service = "Service is required";
                }
                if (!values.time) {
                    errors.time = "Time is required";
                }
                return errors;
            }}
            onSubmit={async (values, actions) => {
                var counter = -1;
                for (const serviceItem of serviceOptions) {
                    counter++;
                    if (serviceItem === values.service) {
                        break;
                    }
                }
                const paymentData = {
                    healer_name: healer.firstName + healer.lastName,
                    healer_email: healer.email,
                    amount: priceOptions[counter],
                    currency: "cad",
                    items: [
                        {
                            service_name: values.service,
                            quantity: 1,
                            price: priceOptions[counter],
                        }
                    ]
                }
                const appointmentData = {
                    ...values,
                    uid,
                    healer: healer.uid,
                    date: selectedDate.toISOString(),
                };

                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/appointments`, appointmentData)
                    .then(response => {
                        console.log('Appointment Response:', response.data);
                        actions.setSubmitting(false);
                        setErrorMessage('');
                    })
                    .catch(error => {
                        console.error("There was an error making the appointment!", error);
                        alert("The error is: " + error);
                        actions.setSubmitting(false);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage('There was an error making the appointment.');
                        }
                    });
                console.log(paymentData);
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/payment`, paymentData)
                    .then(response => {
                        actions.setSubmitting(false);
                        setErrorMessage('');
                        window.location.assign(response.data.url);
                    })
                    .catch(error => {
                        alert("price is: " + paymentData.items.price);
                        console.error("There was an error making the appointment payment!", error);
                        actions.setSubmitting(false);
                        setErrorMessage('There was an error making the appointment payment.');
                        window.location.assign('/search');
                    });
            }}
        >
            {({ handleSubmit, values, errors, touched }) => (
                <div className="bookingFormContainer">
                    <Form className="bookingForm" onSubmit={handleSubmit}>
                        <div className="bookingPageContainer">
                            <div className="bookingServiceContainer">
                                <p>Service:</p>
                                <ServiceField serviceOptions={serviceOptions} setSelectedService={setSelectedService} />
                                {errors.service && touched.service && (
                                    <div className="error">{errors.service}</div>
                                )}
                            </div>
                            <div className="bookingTimeContainer">
                                <p>Time:</p>
                                <Field name="time" as="select" id="time">
                                    <option value="" label="Select time" />
                                    {timeSlots.length > 0 && timeSlots.map((timeSlot, index) => (
                                        <option key={`api-${index}`} value={timeSlot}>{timeSlot}</option>
                                    ))}
                                    {fixedTimeSlots.map((timeSlot, index) => (
                                        <option key={`fixed-${index}`} value={timeSlot}>{timeSlot}</option>
                                    ))}
                                </Field>
                                {errors.time && touched.time && (
                                    <div className="error">{errors.time}</div>
                                )}
                            </div>
                            <div className="bookingSubmitButton">
                                <button type="submit" className="btn">Submit</button>
                            </div>
                            {errorMessage && (
                                <div className="error">{errorMessage}</div>
                            )}
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

const BookingPage = (props) => {
    const [userState, setUserState] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUserState(user);
                axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`).then((response) => {
                    for (const i of response.data) {
                        if (i.email.toLowerCase() === user.email.toLowerCase()) {
                            setUserDetails(i);
                            break;
                        }
                    }
                })
            }
            else {
                alert("Sorry. You need to sign in before booking");
                window.location.assign('signin');
            }
        })
    }, [])
    const [selectedDate, setSelectedDate] = useState(null);
    const { healer, uid } = props;

    return (
        <div className="bookingPage">
            <CssBaseline />
            <div className="bookingCalendar">
                <h2>Booking</h2>
                <DefaultDayPicker onDateSelected={setSelectedDate} />
            </div>
            <BookingForm healer={healer} selectedDate={selectedDate} uid={uid} />
        </div>
    );
}

export default BookingPage;
