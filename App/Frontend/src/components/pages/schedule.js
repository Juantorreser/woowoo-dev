//Commented out some stuff that wasn't getting used yet to get the cmd prompt to quiet down
import React, {useState,useEffect } from 'react';
//import { Calendar } from 'react-date-range';
import axios from 'axios';
import { app } from '../firebase/firebase-config';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';

const auth = getAuth(app);
// const Schedule = () => {
//     //const [ schedule, setSchedule ] = useState({});

//     return (
//         <>
//             <div>
//                 <h2>Booked Appointments</h2>
//                 <p>A listing of booked appointments with healers go here.</p>
//             </div>
//             <div>
//                 <h2>Calendar</h2>
//                 <p>Optional calendar feature here maybe</p>
//             </div>
//         </>
//     )
// }
const Schedule = ()=> {
    const [healerDetails, setHealerDetails]=  useState({});
	//Get all the appointments related to the healer.

    useEffect(() => {
		//let userD = "";
		//this method checks if the user is authenticated with firebase and essentially logged in.
		auth.onAuthStateChanged( async (user) => {
			console.log(user);
			//setUserState(user);
			if(user){
				await axios.get('http://localhost:8080/users').then(  (response) => {
					////self added in from CodeGuru
					//setUserDetails(chosenUser);
					console.log(response.data);
					for(const i of response.data){
						if (i.email == user.email){
							console.log(i);
							setHealerDetails(i);
							//userD = i;
						}
					}
					// //setUserDetails(response.data[0]);
					// try{
					// 	axios.post('http://localhost:8080/locations', 
					// 		response.data.map((user) => user.uid)
					// 	).then((response) => {
					// 		setUserLocation(response.data[0]);
					// 	});
					// }
					// catch (err) {
					// 	console.log(err);
					// }
	
					// try{   //fetching appointments
					// 	const appointments = await axios.get('http://localhost:8080/appointments?uid='+ userDetails.uid);
					// 	console.log(appointments);
					// 	setHealerAppointment(appointments.data);
					// }
					// catch(err){
					// 	console.log(err);
					// }
					//console.log(userD.uid);
					
					// axios.get('http://localhost:8080/appointments?healer='+ userDetails.uid).then((response) => {
					// 	console.log(response.data[0]);
					// 	setHealerAppointment(response.data[0]);
					// })
				});
				return (
					<ConfirmBox healer = {healerDetails.uid}></ConfirmBox>
				)
			}
			
		});	
		
	}, []); 
	return <ConfirmBox healer = {healerDetails}></ConfirmBox>
   
}

const ConfirmBox = ({healer})=> {
    console.log(healer);
    const [healerAppointment, setHealerAppointment] = useState([{client: 1}]);
	const [confirm, setConfirm] = useState([]);   //detects whether to reload or not.
	const [clientInfo, setClientInfo] = useState({});
    var arrayConfirm = [];
    useEffect(()=> {  //think of someway so that the useEffect run for the first time and then, run for every time the button is pressed.   
		axios.get("http://localhost:8080/appointments?healer="+healer.uid)
		.then((response)=> {
			console.log(response.data);
			// response.data.map(resp=> {
			// 	// if(resp.healerAccepted == 0){    //show only if the healer has not accept yet.
					
			// 	// }
				
			// })
			const a = [];
			response.data.map(x => {
				if(x.healerAccepted == null){
					a.push(x);
				}
			})
			//setHealerAppointment(response.data);
			setHealerAppointment(a);
		})
		.catch(err=> {
			console.log("Error at schedule: "+ err);
		})
	}, [healer, confirm]);


	
	return (
		<div className = "reviewContainer">
			<br></br>
			<h3>Upcoming appointments</h3>
			{healerAppointment.map(appointment=> {
				return (
					<div key = {appointment.aid}>
						{/* <p>Client: {appointment.client}</p>
						<p>Time: {appointment.time}</p>
						<p>Date: {appointment.date}</p> */}
						<ClientBox appointment = {appointment}></ClientBox>
						{healer.account == 1? <>     {/* check to see if they are the healer. If not, then no confirm/deny button for them */}
							<ConfirmButton appointment = {appointment} confirm = {1} healerID = {healer.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton>
							<ConfirmButton appointment = {appointment} confirm = {0} healerID = {healer.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton> </>: <p></p> }
						<br></br>
					</div>
				)
			})}
		</div>
		
		
	)
}

const ClientBox = ({appointment})=> {
	const [clientInfo, setClientInfo] = useState({});
	useEffect(()=> {
		axios.get("http://localhost:8080/users/"+ appointment.client)
		.then(result=> {
			console.log(result.data);
			setClientInfo(result.data)
		})
		.catch(err=> {
			console.log("There is an issue with catching the client info: "+ err);
		})
	}, [])

	return(
		<div key = {appointment.aid}>
						<p>Client: {clientInfo.firstName + " "+ clientInfo.lastName}</p>
						<p>Time: {appointment.time}</p>
						<p>Date: {appointment.date}</p>
		</div>
	)
}
const Loading = ()=> {
	return(
		<p>Still loading</p>
	)
}

//the confirm/deny button
const ConfirmButton = ({appointment, confirm, healerID, arrayConfirm, setConfirm})=> {
	var confirmText = "";
	if(confirm == 1){
		confirmText = "Confirm";
	}
	else if(confirm == 0){
		confirmText = "Deny";
	}
	return(
		<button  onClick = {()=> {axios.put('http://localhost:8080/appointments/'+appointment.aid, {
			healerAccepted: confirm, 
			client: appointment.client, 
			aid: appointment.aid,
			healer: healerID, 
			timezone: appointment.timezone,
			date: appointment.date, 
			time: appointment.time, 
			createdAt: Date.now(), 
			updatedAt: Date.now()
		})
		.then((response)=> {
			console.log(response.data);
			arrayConfirm.push(true);
			setConfirm(arrayConfirm);
		})
		
		}
		}  >{confirmText}</button>
	)
	
}

export default Schedule;