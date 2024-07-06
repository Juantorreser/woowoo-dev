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
    const [userDetails, setUserDetails]=  useState({});
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
							setUserDetails(i);
							break;
							//userD = i;
						}
					}
				});
				// return (
				// 	<ConfirmBox healer = {userDetails.uid}></ConfirmBox>
				// )
			}
		});	
	}, []); 
	return(
	<>
		<ConfirmBox userDetails = {userDetails}></ConfirmBox>
		<HistoryBox userDetails={userDetails}></HistoryBox>
	</>
	)
}

const HistoryBox = ({userDetails})=> {
	var appointmentsArray = [];
	console.log(userDetails);
	const [history, setHistory] = useState([{client: 1}]);
	const [render, setRender] = useState([]);
	var endpoint = "appointments";
	if(userDetails.account == 1){   //if the user who log in is the healer
		endpoint = "appointments?healer="+ userDetails.uid;   //get the information of all the appointments the healer has set up/
	}
	else{
		endpoint = "appointments/clients/"+userDetails.uid;   //get all the information of all the appointments the client has entered.
	}
	useEffect(()=>{
		axios.get("http://localhost:8080/"+ endpoint)
		.then(result=> {
			console.log(result.data);
			setHistory(result.data);
		})
		.catch(err=> {
			console.log("Error with viewing history appointments: "+ err);
		})
	}, [userDetails])

	// useEffect(()=>{
	// 	console.log(history)
	// }, [history])

	return(
		<>
			<h3>Appointment history</h3>
			{
				// useEffect(()=> {
				// 	history.map(appointment=> {
				// 		console.log(appointment);
				// 		return(
				// 			<>
				// 				<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
				// 			</>
				// 		)
				// 	})
				// })
				history.map(appointment=> {
					console.log(appointment);
					return(
						<>
							<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
						</>
					)
				})
			}
		</>
		
	)
}

const ConfirmBox = ({userDetails})=> {
    console.log(userDetails);
    const [healerAppointment, setHealerAppointment] = useState([{client: 1}]);
	const [confirm, setConfirm] = useState([]);   //detects whether to reload or not.
	const [clientInfo, setClientInfo] = useState({});
    var arrayConfirm = [];
    useEffect(()=> {  //think of someway so that the useEffect run for the first time and then, run for every time the button is pressed.   
		axios.get("http://localhost:8080/appointments?healer="+userDetails.uid)
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
	}, [userDetails, confirm]);

	return (
		<div className = "reviewContainer">
			<br></br>
			<h3>Upcoming appointments</h3>
			{
				// useEffect(()=> {
				// 	console.log(healerAppointment);
				// 	healerAppointment.map(appointment=> {
				// 		return (
				// 			<div key = {appointment.aid}>
				// 				<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
				// 				{userDetails.account == 1 ? 
				// 				<>
				// 						<ConfirmButton appointment = {appointment} confirm = {1} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton>
				// 						<ConfirmButton appointment = {appointment} confirm = {0} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton> 
				// 				</>
				// 						:
				// 						<CancelButton appointment = {appointment}></CancelButton> 
				// 				}
				// 				<br></br>
				// 			</div>
				// 		)
				// 	})
				// })
				healerAppointment.map(appointment=> {
					console.log(appointment);
					return (
						<div key = {appointment.aid}>
							<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
							{userDetails.account == 1 ? 
							<>
									<ConfirmButton appointment = {appointment} confirm = {1} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton>
									<ConfirmButton appointment = {appointment} confirm = {0} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton> 
							</>
									:
									<CancelButton appointment = {appointment}></CancelButton> 
							}
							<br></br>
						</div>
					)
				})
			}
		</div>
	)
}

const ClientBox = ({appointment, user})=> {  //appointment can contain both the healer and the client's information.
	console.log(user);
	console.log(appointment);
	const [clientInfo, setClientInfo] = useState({});
	var receiver = "Client:"
	var endpoint = "1";
	if(appointment != null){
		console.log(appointment);
		if(user.account == 1){
			endpoint = appointment.healer;
		}
		else{
			endpoint = appointment.client;
			receiver = "Healer: "
		}
	}
	
	useEffect(()=> {
		axios.get("http://localhost:8080/users/"+ endpoint)
		.then(result=> {
			console.log(result.data);
			setClientInfo(result.data)
		})
		.catch(err=> {
			console.log("There is an issue with catching the client info: "+ err);
		})
	}, [])  //re-render whenever there is a new appointment
	return(
		<div>
			<p> {receiver} {clientInfo.firstName + " "+ clientInfo.lastName}</p>
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

const CancelButton = ({appointment})=> {
	return(
		<>
			<button  onClick = {()=> {axios.delete("http://localhost:8080/appointments/"+ appointment.aid)
		.then(result=> {
			console.log(result.data);

		})
		.catch(err=> {
			console.log("Something wrong when deleting appoitnments"+ err);
		})
		
		}
		}>Deny</button>
		</>
	)
}

export default Schedule;