// //Commented out some stuff that wasn't getting used yet to get the cmd prompt to quiet down
// import React, {useState,useEffect } from 'react';
// //import { Calendar } from 'react-date-range';
// import axios from 'axios';
// import { app } from '../firebase/firebase-config';
// import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';

// const auth = getAuth(app);
// const Schedule = ()=> {
//     const [userDetails, setUserDetails]=  useState({});
// 	//Get all the appointments related to the healer.

//     useEffect(() => {
// 		//let userD = "";
// 		//this method checks if the user is authenticated with firebase and essentially logged in.
// 		auth.onAuthStateChanged( async (user) => {
// 			console.log(user);
// 			//setUserState(user);
// 			if(user){
// 				await axios.get('http://localhost:8080/users').then(  (response) => {
// 					////self added in from CodeGuru
// 					//setUserDetails(chosenUser);
// 					console.log(response.data);
// 					for(const i of response.data){
// 						if (i.email == user.email){
// 							console.log(i);
// 							setUserDetails(i);
// 							//userD = i;
// 						}
// 					}
// 				});
// 			}
// 		});	
// 	}, []); 
// 	return(
// 	<>
// 		<ConfirmBox userDetails = {userDetails}></ConfirmBox>
// 		<HistoryBox userDetails={userDetails}></HistoryBox>
// 	</>
// 	)
// }

// const HistoryBox = ({userDetails})=> {
// 	var appointmentsArray = [];
// 	console.log(userDetails);
// 	const [history, setHistory] = useState([{client: 1}]);
// 	const [render, setRender] = useState([]);
// 	var endpoint = "appointments";
// 	if(userDetails.account == 1){   //if the user who log in is the healer
// 		endpoint = "appointments?healer="+ userDetails.uid;   //get the information of all the appointments the healer has set up/
// 	}
// 	else{
// 		endpoint = "appointments/clients/"+userDetails.uid;   //get all the information of all the appointments the client has entered.
// 	}
// 	useEffect(()=>{
// 		axios.get("http://localhost:8080/"+ endpoint)
// 		.then(result=> {
// 			console.log(result.data);
// 			setHistory(result.data);
// 		})
// 		.catch(err=> {
// 			console.log("Error with viewing history appointments: "+ err);
// 		})
// 	}, [userDetails])


// 	return(
// 		<>
// 			<h3>Appointment history</h3>
// 			{
// 				history.map(appointment=> {
// 					console.log(appointment);
// 					return(
// 						<>
// 							<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
// 						</>
// 					)
// 				})
// 			}
// 		</>
		
// 	)
// }

// const ConfirmBox = ({userDetails})=> {
//     console.log(userDetails);
//     const [healerAppointment, setHealerAppointment] = useState([{client: 1}]);
// 	const [confirm, setConfirm] = useState([]);   //detects whether to reload or not.
// 	const [clientInfo, setClientInfo] = useState({});
//     var arrayConfirm = [];
//     useEffect(()=> {  //think of someway so that the useEffect run for the first time and then, run for every time the button is pressed.   
// 		axios.get("http://localhost:8080/appointments?healer="+userDetails.uid)
// 		.then((response)=> {
// 			console.log(response.data);
// 			const a = [];
// 			response.data.map(x => {
// 				if(x.healerAccepted == null){
// 					a.push(x);
// 				}
// 			})
// 			//setHealerAppointment(response.data);
// 			setHealerAppointment(a);
// 		})
// 		.catch(err=> {
// 			console.log("Error at schedule: "+ err);
// 		})
// 	}, [userDetails, confirm]);

// 	return (
// 		<div className = "reviewContainer">
// 			<br></br>
// 			<h3>Upcoming appointments</h3>
// 			{
// 				healerAppointment.map(appointment=> {
// 					return (
// 						<div key = {appointment.aid}>
// 							<ClientBox appointment = {appointment} user = {userDetails}></ClientBox>
// 							{userDetails.account == 1 ? 
// 							<>
// 									<ConfirmButton appointment = {appointment} confirm = {1} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton>
// 									<ConfirmButton appointment = {appointment} confirm = {0} healerID = {userDetails.uid} arrayConfirm = {arrayConfirm} setConfirm = {setConfirm}></ConfirmButton> 
// 							</>
// 									:
// 									<CancelButton appointment = {appointment}></CancelButton> 
// 							}
// 							<br></br>
// 						</div>
// 					)
// 				})
// 			}
// 		</div>
// 	)
// }

// const ClientBox = ({appointment, user})=> {  //appointment can contain both the healer and the client's information.
// 	console.log(user);
// 	console.log(appointment);
// 	const [clientInfo, setClientInfo] = useState({});
// 	var receiver = "Client:"
// 	var endpoint = "1";
// 	if(appointment != null){
// 		console.log(appointment);
// 		if(user.account == 1){
// 			endpoint = appointment.healer;
// 		}
// 		else{
// 			endpoint = appointment.client;
// 			receiver = "Healer: "
// 		}
// 	}
	
// 	useEffect(()=> {
// 		axios.get("http://localhost:8080/users/"+ endpoint)
// 		.then(result=> {
// 			console.log(result.data);
// 			setClientInfo(result.data)
// 		})
// 		.catch(err=> {
// 			console.log("There is an issue with catching the client info: "+ err);
// 		})
// 	}, [])  //re-render whenever there is a new appointment
// 	return(
// 		<div>
// 			<p> {receiver} {clientInfo.firstName + " "+ clientInfo.lastName}</p>
// 			<p>Time: {appointment.time}</p>
// 			<p>Date: {appointment.date}</p>
// 		</div>
// 	)
// }
// const Loading = ()=> {
// 	return(
// 		<p>Still loading</p>
// 	)
// }

// //the confirm/deny button
// const ConfirmButton = ({appointment, confirm, healerID, arrayConfirm, setConfirm})=> {
// 	var confirmText = "";
// 	if(confirm == 1){
// 		confirmText = "Confirm";
// 	}
// 	else if(confirm == 0){
// 		confirmText = "Deny";
// 	}
// 	return(
// 		<button  onClick = {()=> {axios.put('http://localhost:8080/appointments/'+appointment.aid, {
// 			healerAccepted: confirm, 
// 			client: appointment.client, 
// 			aid: appointment.aid,
// 			healer: healerID, 
// 			timezone: appointment.timezone,
// 			date: appointment.date, 
// 			time: appointment.time, 
// 			createdAt: Date.now(), 
// 			updatedAt: Date.now()
// 		})
// 		.then((response)=> {
// 			console.log(response.data);
// 			arrayConfirm.push(true);
// 			setConfirm(arrayConfirm);
// 		})
		
// 		}
// 		}  >{confirmText}</button>
// 	)
	
// }

// const CancelButton = ({appointment})=> {
// 	return(
// 		<>
// 			<button  onClick = {()=> {axios.delete("http://localhost:8080/appointments/"+ appointment.aid)
// 		.then(result=> {
// 			console.log(result.data);

// 		})
// 		.catch(err=> {
// 			console.log("Something wrong when deleting appoitnments"+ err);
// 		})
		
// 		}
// 		}>Deny</button>
// 		</>
// 	)
// }

// export default Schedule;

//------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { app } from '../firebase/firebase-config';
// import { getAuth } from 'firebase/auth';
// import { Container, Box, Typography, Button, CircularProgress, Paper, Grid } from '@material-ui/core';

// const auth = getAuth(app);

// const Schedule = () => {
//     const [userDetails, setUserDetails] = useState({});

//     useEffect(() => {
//         auth.onAuthStateChanged(async (user) => {
//             if (user) {
//                 await axios.get('http://localhost:8080/users').then((response) => {
//                     for (const i of response.data) {
//                         if (i.email === user.email) {
//                             setUserDetails(i);
//                         }
//                     }
//                 });
//             }
//         });
//     }, []);

//     return (
//         <Container>
//             <ConfirmBox userDetails={userDetails} />
//             <HistoryBox userDetails={userDetails} />
//         </Container>
//     );
// };

// const HistoryBox = ({ userDetails }) => {
//     const [history, setHistory] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const endpoint = userDetails.account === 1 ? `appointments?healer=${userDetails.uid}` : `appointments/clients/${userDetails.uid}`;

//     useEffect(() => {
//         axios.get(`http://localhost:8080/${endpoint}`)
//             .then(result => {
//                 setHistory(result.data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error("Error with viewing history appointments: ", err);
//                 setLoading(false);
//             });
//     }, [userDetails, endpoint]);

//     if (loading) {
//         return <CircularProgress />;
//     }

//     return (
//         <Box my={4}>
//             <Typography variant="h5">Appointment History</Typography>
//             {history.map((appointment, index) => (
//                 <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
//                     <ClientBox appointment={appointment} user={userDetails} />
//                 </Paper>
//             ))}
//         </Box>
//     );
// };

// const ConfirmBox = ({ userDetails }) => {
//     const [healerAppointment, setHealerAppointment] = useState([]);
//     const [confirm, setConfirm] = useState([]);

//     useEffect(() => {
//         axios.get(`http://localhost:8080/appointments?healer=${userDetails.uid}`)
//             .then((response) => {
//                 const pendingAppointments = response.data.filter(x => x.healerAccepted === null);
//                 setHealerAppointment(pendingAppointments);
//             })
//             .catch(err => {
//                 console.error("Error at schedule: ", err);
//             });
//     }, [userDetails, confirm]);

//     return (
//         <Box my={4}>
//             <Typography variant="h5">Upcoming Appointments</Typography>
//             {healerAppointment.map((appointment, index) => (
//                 <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
//                     <ClientBox appointment={appointment} user={userDetails} />
//                     {userDetails.account === 1 ?
//                         <Grid container spacing={2}>
//                             <Grid item>
//                                 <ConfirmButton appointment={appointment} confirm={1} healerID={userDetails.uid} setConfirm={setConfirm} />
//                             </Grid>
//                             <Grid item>
//                                 <ConfirmButton appointment={appointment} confirm={0} healerID={userDetails.uid} setConfirm={setConfirm} />
//                             </Grid>
//                         </Grid>
//                         :
//                         <CancelButton appointment={appointment} />
//                     }
//                 </Paper>
//             ))}
//         </Box>
//     );
// };

// const ClientBox = ({ appointment, user }) => {
//     const [clientInfo, setClientInfo] = useState({});
//     const endpoint = user.account === 1 ? appointment.client : appointment.healer;
//     const receiver = user.account === 1 ? "Client:" : "Healer:";

//     useEffect(() => {
//         axios.get(`http://localhost:8080/users/${endpoint}`)
//             .then(result => {
//                 setClientInfo(result.data);
//             })
//             .catch(err => {
//                 console.error("There is an issue with catching the client info: ", err);
//             });
//     }, [endpoint]);

//     return (
//         <Box>
//             <Typography variant="body1">{receiver} {clientInfo.firstName} {clientInfo.lastName}</Typography>
//             <Typography variant="body1">Time: {appointment.time}</Typography>
//             <Typography variant="body1">Date: {appointment.date}</Typography>
//         </Box>
//     );
// };

// const ConfirmButton = ({ appointment, confirm, healerID, setConfirm }) => {
//     const handleConfirm = () => {
//         axios.put(`http://localhost:8080/appointments/${appointment.aid}`, {
//             healerAccepted: confirm,
//             client: appointment.client,
//             aid: appointment.aid,
//             healer: healerID,
//             timezone: appointment.timezone,
//             date: appointment.date,
//             time: appointment.time,
//             createdAt: Date.now(),
//             updatedAt: Date.now()
//         })
//             .then(() => {
//                 setConfirm(prev => !prev);
//             })
//             .catch(err => {
//                 console.error("Error confirming appointment: ", err);
//             });
//     };

//     return (
//         <Button variant="contained" color={confirm === 1 ? "primary" : "secondary"} onClick={handleConfirm}>
//             {confirm === 1 ? "Confirm" : "Deny"}
//         </Button>
//     );
// };

// const CancelButton = ({ appointment }) => {
//     const handleCancel = () => {
//         axios.delete(`http://localhost:8080/appointments/${appointment.aid}`)
//             .then(() => {
//                 console.log("Appointment cancelled");
//             })
//             .catch(err => {
//                 console.error("Error cancelling appointment: ", err);
//             });
//     };

//     return (
//         <Button variant="contained" color="secondary" onClick={handleCancel}>
//             Cancel
//         </Button>
//     );
// };

// export default Schedule;

//-----------------------------------------------------------------------------------------------------------



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { app } from '../firebase/firebase-config';
import { getAuth } from 'firebase/auth';
import { Container, Box, Typography, Button, CircularProgress, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';

const auth = getAuth(app);

const Schedule = () => {
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await axios.get('http://localhost:8080/users').then((response) => {
                    for (const i of response.data) {
                        if (i.email === user.email) {
                            setUserDetails(i);
                        }
                    }
                });
            }
        });
    }, []);

    return (
        <Container>
            <ConfirmBox userDetails={userDetails} />
            <HistoryBox userDetails={userDetails} />
        </Container>
    );
};

const HistoryBox = ({ userDetails }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const endpoint = userDetails.account === 1 ? `appointments?healer=${userDetails.uid}` : `appointments/clients/${userDetails.uid}`;

    useEffect(() => {
        axios.get(`http://localhost:8080/${endpoint}`)
            .then(result => {
                setHistory(result.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error with viewing history appointments: ", err);
                setLoading(false);
            });
    }, [userDetails, endpoint]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box my={4}>
            <Typography variant="h5">Appointment History</Typography>
            {history.map((appointment, index) => (
                <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
                    <ClientBox appointment={appointment} user={userDetails} />
                </Paper>
            ))}
        </Box>
    );
};

const ConfirmBox = ({ userDetails }) => {
    const [healerAppointment, setHealerAppointment] = useState([]);
    const [confirm, setConfirm] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/appointments?healer=${userDetails.uid}`)
            .then((response) => {
                const pendingAppointments = response.data.filter(x => x.healerAccepted === null);
                setHealerAppointment(pendingAppointments);
            })
            .catch(err => {
                console.error("Error at schedule: ", err);
            });
    }, [userDetails, confirm]);

    return (
        <Box my={4}>
            <Typography variant="h5">Upcoming Appointments</Typography>
            {healerAppointment.map((appointment, index) => (
                <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
                    <ClientBox appointment={appointment} user={userDetails} />
                    {userDetails.account === 1 ?
                        <Grid container spacing={2}>
                            <Grid item>
                                <ConfirmButton appointment={appointment} confirm={1} healerID={userDetails.uid} setConfirm={setConfirm} />
                            </Grid>
                            <Grid item>
                                <ConfirmButton appointment={appointment} confirm={0} healerID={userDetails.uid} setConfirm={setConfirm} />
                            </Grid>
                            <Grid item>
                                <RescheduleButton appointment={appointment} setConfirm={setConfirm} />
                            </Grid>
                        </Grid>
                        :
                        <CancelButton appointment={appointment} />
                    }
                </Paper>
            ))}
        </Box>
    );
};

const ClientBox = ({ appointment, user }) => {
    const [clientInfo, setClientInfo] = useState({});
    const endpoint = user.account === 1 ? appointment.client : appointment.healer;
    const receiver = user.account === 1 ? "Client:" : "Healer:";

    useEffect(() => {
        axios.get(`http://localhost:8080/users/${endpoint}`)
            .then(result => {
                setClientInfo(result.data);
            })
            .catch(err => {
                console.error("There is an issue with catching the client info: ", err);
            });
    }, [endpoint]);

    return (
        <Box>
            <Typography variant="body1">{receiver} {clientInfo.firstName} {clientInfo.lastName}</Typography>
            <Typography variant="body1">Time: {appointment.time}</Typography>
            <Typography variant="body1">Date: {appointment.date}</Typography>
        </Box>
    );
};

const ConfirmButton = ({ appointment, confirm, healerID, setConfirm }) => {
    const handleConfirm = () => {
        axios.put(`http://localhost:8080/appointments/${appointment.aid}`, {
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
            .then(() => {
                setConfirm(prev => !prev);
            })
            .catch(err => {
                console.error("Error confirming appointment: ", err);
            });
    };

    return (
        <Button variant="contained" color={confirm === 1 ? "primary" : "secondary"} onClick={handleConfirm}>
            {confirm === 1 ? "Confirm" : "Deny"}
        </Button>
    );
};

const CancelButton = ({ appointment }) => {
    const handleCancel = () => {
        axios.delete(`http://localhost:8080/appointments/${appointment.aid}`)
            .then(() => {
                console.log("Appointment cancelled");
            })
            .catch(err => {
                console.error("Error cancelling appointment: ", err);
            });
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
        </Button>
    );
};

const RescheduleButton = ({ appointment, setConfirm }) => {
    const [open, setOpen] = useState(false);
    const [newDate, setNewDate] = useState(appointment.date);
    const [newTime, setNewTime] = useState(appointment.time);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReschedule = () => {
        axios.put(`http://localhost:8080/appointments/${appointment.aid}`, {
            ...appointment,
            date: newDate,
            time: newTime,
            updatedAt: Date.now()
        })
            .then(() => {
                setConfirm(prev => !prev);
                handleClose();
            })
            .catch(err => {
                console.error("Error rescheduling appointment: ", err);
            });
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Reschedule
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Date"
                        type="date"
                        defaultValue={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New Time"
                        type="time"
                        defaultValue={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleReschedule} color="primary">
                        Reschedule
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Schedule;
