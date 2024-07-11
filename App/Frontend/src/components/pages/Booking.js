
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { CssBaseline, Box } from '@material-ui/core';
// import { Formik, Form, Field } from 'formik';
// import { Calendar } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import './Booking.css';
// import './calendar.css';

// const DefaultDayPicker = ({ onDateSelected }) => {
//     const [date, setDate] = useState(new Date());

//     function handleDateSelected(dateSelected) {
//         setDate(dateSelected);
//         onDateSelected(dateSelected);
//     }

//     return (
//         <Box style={{ width: '100%' }}>
//             <Calendar
//                 className="calendar"
//                 date={date}
//                 onChange={(date) => handleDateSelected(date)}
//                 minDate={new Date()}
//                 maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
//             />
//         </Box>
//     );
// };

// const BookingForm = ({ healer, selectedDate, uid }) => {
//     const serviceOptions = healer.services.split(',');
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
    

//     useEffect(() => {
//         if (selectedDate) {
//             const formattedDate = selectedDate.toISOString().split('T')[0];
//             console.log(`Fetching availability for healer ID: ${healer.uid} on date: ${formattedDate} service: ${healer.services}`);
//             axios.get(`http://localhost:8080/availability/:uid?healer=${healer.uid}&date=${formattedDate}`)
//                 .then(response => {
//                     console.log('API Response:', response.data);
//                     const availabilities = response.data;
    
//                     // Assuming the API returns an array of availability objects, each containing a `timeslots` array
//                     const allTimeSlots = availabilities.reduce((acc, availability) => {
//                         if (availability.timeslots) {
//                             return acc.concat(availability.timeslots);
//                         }
//                         return acc;
//                     }, []);
    
//                     setTimeSlots(allTimeSlots.length > 0 ? allTimeSlots : []);
//                 })
//                 .catch(error => {
//                     console.error("There was an error fetching the time slots!", error);
//                 });
//         }
//     }, [selectedDate, healer.uid]);
    
//     return (
//         <Formik
//             initialValues={{
//                 service: "",
//                 time: ""
//             }}
//             validate={(values) => {
//                 const errors = {};
//                 if (!values.service) {
//                     errors.service = "Service is required";
//                 }
//                 if (!values.time) {
//                     errors.time = "Time is required";
//                 }
//                 return errors;
//             }}
//             onSubmit={(values, actions) => {
//                 const appointmentData = {
//                     ...values,
//                     uid,
//                     healer: healer.uid,
//                     date: selectedDate.toISOString(),
//                 };
//                 axios.post('http://localhost:8080/appointments', appointmentData)
//                     .then(response => {
//                         console.log('Appointment Response:', response.data);
//                         actions.setSubmitting(false);
//                         setErrorMessage(''); // Clear any previous error messages
//                     })
//                     .catch(error => {
//                         console.error("There was an error making the appointment!", error);
//                         actions.setSubmitting(false);
//                         setErrorMessage('There was an error making the appointment.');
//                     });
//             }}
//         >
//             {({ handleSubmit, values, errors, touched }) => (
//                 <div className="bookingFormContainer">
//                     <Form className="bookingForm" onSubmit={handleSubmit}>
//                         <div className="bookingPageContainer">
//                             <div className="bookingServiceContainer">
//                                 <p>Service:</p>
//                                 <Field name="service" as="select" id="service">
//                                     <option value="" label="Select service" />
//                                     {serviceOptions.map((service, index) => (
//                                         <option key={index} value={service}>{service}</option>
//                                     ))}
//                                 </Field>
//                                 {errors.service && touched.service && (
//                                     <div className="error">{errors.service}</div>
//                                 )}
//                             </div>
//                             <div className="bookingTimeContainer">
//                                 <p>Time:</p>
//                                 <Field name="time" as="select" id="time">
//                                     <option value="" label="Select time" />
//                                     {timeSlots.length > 0 ? (
//                                         timeSlots.map((timeSlot, index) => (
//                                             <option key={index} value={timeSlot}>{timeSlot}</option>
//                                         ))
//                                     ) : (
//                                         <option value="" disabled>No available time slots</option>
//                                     )}
//                                 </Field>
//                                 {errors.time && touched.time && (
//                                     <div className="error">{errors.time}</div>
//                                 )}
//                             </div>
//                             <div className="bookingSubmitButton">
//                                 <button type="submit" className="btn">Submit</button>
//                             </div>
//                             {errorMessage && (
//                                 <div className="error">{errorMessage}</div>
//                             )}
//                         </div>
//                     </Form>
//                 </div>
//             )}
//         </Formik>
//     );
// };

// const BookingPage = (props) => {
//     console.log(props);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const { healer, uid } = props; 

//     return (
//         <div className="bookingPage">
//             <CssBaseline />
//             <div className="bookingCalendar">
//                 <h2>Booking</h2>
//                 <DefaultDayPicker onDateSelected={setSelectedDate} />
//             </div>
//             <BookingForm healer={healer} selectedDate={selectedDate} uid={uid} />
//         </div>
//     );
// }

// export default BookingPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Box } from '@material-ui/core';
import { Formik, Form, Field, useFormikContext } from 'formik';
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
    const [timeSlots, setTimeSlots] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedService, setSelectedService] = useState('');

    useEffect(() => {
        if (selectedDate && selectedService) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            console.log(`Fetching availability for healer ID: ${healer.uid} on date: ${formattedDate} service: ${selectedService}`);
            axios.get(`http://localhost:8080/availability/:uid?healer=${healer.uid}&date=${formattedDate}&service=${selectedService}`)
                .then(response => {
                    console.log('API Response:', response.data);
                    const availabilities = response.data;

                    // Assuming the API returns an array of availability objects, each containing a `timeslots` array
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
            onSubmit={(values, actions) => {
                const appointmentData = {
                    ...values,
                    uid,
                    healer: healer.uid,
                    date: selectedDate.toISOString(),
                };
                console.log('Submitting appointment data:', appointmentData); // Debug log
                axios.post('http://localhost:8080/appointments', appointmentData)
                    .then(response => {
                        console.log('Appointment Response:', response.data);
                        actions.setSubmitting(false);
                        setErrorMessage(''); // Clear any previous error messages
                    })
                    .catch(error => {
                        console.error("There was an error making the appointment!", error);
                        actions.setSubmitting(false);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage('There was an error making the appointment.');
                        }
                        
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
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map((timeSlot, index) => (
                                            <option key={index} value={timeSlot}>{timeSlot}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No available time slots</option>
                                    )}
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
    console.log(props);
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
