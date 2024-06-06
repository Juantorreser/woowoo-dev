
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Box } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Booking.css';
import './calendar.css';

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

const BookingForm = ({ healer, selectedDate }) => {
    const serviceOptions = healer.services.split(',');
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (selectedDate) {
            console.log(`Fetching availability for healer ID: ${healer.uid} on date: ${selectedDate.toISOString().split('T')[0]}`);
            axios.get(`http://localhost:8080/availability/:uid?healer=${healer.uid}`)
                .then(response => {
                    console.log('API Response:', response.data);
                    const availabilities = response.data;
                    if (availabilities.length > 0 && availabilities[0].timeslots) {
                        setTimeSlots(availabilities[0].timeslots); // Assuming `timeslots` is an array
                    } else {
                        setTimeSlots([]);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the time slots!", error);
                });
        }
    }, [selectedDate, healer.uid]);

    return (
        <Formik
            initialValues={{
                service: "",
                time: ""
            }}
            onSubmit={(values, actions) => {
                const appointmentData = {
                    ...values,
                    healer: healer.id,
                    date: selectedDate,
                };
                axios.post('http://localhost:8080/appointments', appointmentData)
                    .then(response => {
                        console.log('Appointment Response:', response.data);
                        actions.setSubmitting(false);
                    })
                    .catch(error => {
                        console.error("There was an error making the appointment!", error);
                        actions.setSubmitting(false);
                    });
            }}
        >
            {({ handleSubmit, values }) => (
                <div className="bookingFormContainer">
                    <Form className="bookingForm" onSubmit={handleSubmit}>
                        <div className="bookingPageContainer">
                            <div className="bookingServiceContainer">
                                <p>Service:</p>
                                <Field name="service" as="select" id="service">
                                    <option value="" label="Select service" />
                                    {serviceOptions.map((service, index) => (
                                        <option key={index} value={service}>{service}</option>
                                    ))}
                                </Field>
                            </div>
                            <div className="bookingTimeContainer">
                                <p>Time:</p>
                                <Field name="time" as="select" id="time">
                                    <option value="" label="Select time" />
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map((timeSlot, index) => (
                                            <option key={index} value={timeSlot}>{timeSlot}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No available time slots</option>
                                    )}
                                </Field>
                            </div>
                            <div className="bookingSubmitButton">
                                <button type="submit" className="btn">Submit</button>
                            </div>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

const BookingPage = (props) => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div className="bookingPage">
            <CssBaseline />
            <div className="bookingCalendar">
                <h2>Booking</h2>
                <DefaultDayPicker onDateSelected={setSelectedDate} />
            </div>
            <BookingForm healer={props.healer} selectedDate={selectedDate} />
        </div>
    );
}

export default BookingPage;

