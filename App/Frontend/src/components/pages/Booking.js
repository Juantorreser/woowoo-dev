import React, { useState, useEffect } from 'react';
//import { useHistory } from 'react-router-dom';

/* DEV NOTES: 
* Need to add payment method using stripe, not enough time
* Booking page needs the most work on this website, a lot of the test data is inconsistent and 
* the code does not output the right data sometimes
* 
* Booking was changed from a page into a component that could be rendered onto the search page in a modal.
* Most of the functionality is working, but a call needs to be made to the booking and availability APIs that
* set dates with the user's id and a timeslot. 
*/

import {
	CssBaseline,
	Box,
	List
} from '@material-ui/core';

import { Formik, Form, Field } from 'formik';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './Booking.css';
import './calendar.css';

// Moment Library used for date formatting and timezone
//import moment from 'moment-timezone';

//This is used in BookingForm() but BookingForm() is never used
//import axios from 'axios';
const DefaultDayPicker = (props) => {
	//const { id: healerID } = useParams();
	//TODO: setServices is never used but services is
	const [services, setServices] = useState([]);

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(
		new Date(new Date().setTime(startDate.getTime() + 6 * 86400000))
	);

	const [date, setDate] = useState(new Date());

	function handleDateSelected(dateSelected) {
		setDate(dateSelected);
		setStartDate(dateSelected);
		setEndDate(
		new Date(endDate.setTime(dateSelected.getTime() + 6 * 86400000))
		);
	}

	useEffect(() => {
	}, []);

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

const BookingForm = ({props}) => {
	const serviceOptions = props.healer.services.split(',');

	useEffect(() => {
		console.log(props);
	}, [])

	return (
		<Formik
			initialValues={{
				service: "",
				time: ""
			}}
			onSubmit={(values, actions) => {
				console.log(values);
			}}
		>
			{({handleSubmit, values}) => (
				<div className="bookingFormContainer">
					<Form 
						className="bookingForm"
						onSubmit={handleSubmit}
					>
						<div className="bookingPageContainer">
							<div className="bookingServiceContainer">
								<p>Service:</p>
								<Field
									name="service"
									as="select"
									id="service"
								>
									{
										serviceOptions.map((service) => {
											return(
												<option value={service}>{service}</option>
											)
										})
									}
								</Field>
							</div>
							<div className="bookingTimeContainer">
								<p>Time:</p>
								<Field
									name="time"
									as="select"
									id="time"
								>

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
	)
}

//Misleading name -- booking page is the booking component which contains the calendar date picker and 
//the request form for booking with a specific healer. 
const BookingPage = (props) => {
	return (
		<div className="bookingPage">
			<CssBaseline />
			<div className="bookingCalendar">
				<h2>Booking</h2>
				<DefaultDayPicker />
			</div>
			<BookingForm props={props}/>
		</div>
	);
}

export default BookingPage;
