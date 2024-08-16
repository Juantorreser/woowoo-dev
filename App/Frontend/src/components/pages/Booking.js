
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
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';
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
    console.log(healer);
    
    const serviceOptions = healer.services.split(',');
    var priceOptions = [];
    console.log(healer);

    if(healer.servicePrices == null){
        alert("This user does not have price. Please check again");
        window.location.assign("/home");
    }
    else{
        if(healer.servicePrices.indexOf(",") > -1){   //servicePrices is in string form. find if the service prices has more than one price
            const priceOptionsArray = healer.servicePrices.split(',');     //turn this string (format: '45,50') into array ([45,50])
            priceOptionsArray.map(price=> {
                priceOptions.push((Number(price)* 100).toString());
            })
        }
        else{  //just add in that sigular price.
            priceOptions.push((Number(healer.servicePrices)*100).toString());
        }
    }
    

    
    
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
            onSubmit={async (values, actions) => {
                var counter = -1;
                //find the price of the service:
                for(const serviceItem of serviceOptions){
                    counter ++;
                    if(serviceItem == values.service){
                        break;
                    }
                }
                const paymentData = {
                    
                   healer_name: healer.firstName + healer.lastName,
                   healer_email: healer.email,
                   amount:  priceOptions[counter],   //not sure yet.
                   currency: "cad",
                   items: [
                    {
                        service_name: values.service,
                        quantity: 1, 
                        price: priceOptions[counter],   //not sure yet.
                    }
                   ]
                }
                const appointmentData = {
                    ...values,
                    uid,
                    healer: healer.uid,
                    date: selectedDate.toISOString(),
                };

                await axios.post('http://localhost:8080/appointments', appointmentData)
                    .then(response => {
                        console.log('Appointment Response:', response.data);
                        actions.setSubmitting(false);
                        setErrorMessage(''); // Clear any previous error messages
                    })
                    .catch(error => {
                        console.error("There was an error making the appointment!", error);
                        alert("The error is: "+ error);
                        actions.setSubmitting(false);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage('There was an error making the appointment.');
                        }
                        
                    });
                console.log(paymentData);
                //payment through Stripe. Not sure yet.
                await axios.post('http://localhost:8080/payment', paymentData)
                    .then(response => {
                        //alert('Appointment Response:', response.data);
                        actions.setSubmitting(false);
                        setErrorMessage(''); // Clear any previous error messages
                        //console.log(response.data);

                        //re-directing the url returned.
                        window.location.assign(response.data.url);
                    })
                    .catch(error => {
                        alert("price is: "+ paymentData.items.price);
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
    const [ userState, setUserState ] = useState(null);
	const [ userDetails, setUserDetails ] = useState(null);
    useEffect(() => {
		//let userD = "";
		//this method checks if the user is authenticated with firebase and essentially logged in.
		auth.onAuthStateChanged( (user) => {
			if(user){
				console.log(user);
                setUserState(user);
                axios.get('http://localhost:8080/users').then(  (response) => {
                    // setUserDetails(chosenUser);
                    // console.log(response.data)
                    for(const i of response.data){
                        if (i.email === user.email){
                            setUserDetails(i);
                            break;
                            //userD = i;
                        }
                        
                    }
                })
            }
            else{
                alert("Sorry. You need to sign in before booking");
                window.location.assign('signin');
            }
        })
    }, [])
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
