import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import $ from 'jquery';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import axios from 'axios';
import { app } from '../firebase/firebase-config';
import { MultiSelect } from 'react-multi-select-component'; 
const auth = getAuth(app);

const MessageBox = ()=>{
	const [createNewMessage, setCreateNewMessage] = useState(false);
    //TODO: contain the container for all the messages. 
    //Also, have a space for the sending messages depending on the user (healer or not).
    const [userDetails, setUserDetails] = useState({});
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
							//userD = i;
						}
					}
				});
			}
		});	
	}, []); 
    return(
        <>
            {/* need to design the layout, and add in. Preferably a message board. Also, need to hash message when created*/}
			{/* fetch all the message back from the specified url */}

			<UserBox userDetails = {userDetails}></UserBox>
			<NewMessage userDetails = {userDetails}></NewMessage>
        </>
    )
}



const UserBox = ({userDetails})=> {
	const [userMessage, setUserMessage] = useState([{}])
	const [newMes, setNewMes] = useState({});
	console.log(userDetails);
	useEffect(()=> {
		axios.get('http://localhost:8080/message/'+ userDetails.uid)
		.then(result=> {
			console.log(result.data);
			setUserMessage(result.data);
		})
		.catch(err=> {
			console.log(err);
		})
	}, [userDetails]);

	return (
		<>
			<h3>Upcomming messages</h3>
			{
				// useEffect(()=> {
				// 	console.log(userMessage);
				// 	userMessage.map(message=> {
				// 		console.log(message);
				// 		return(
				// 			// <div key= {message.mid}>
				// 			//<p>From: {getUserName(message.from_user)}</p>
				// 			<p>Context: {message.context}</p>
				// 			// </div>
				// 			//<UserInfo message = {message}></UserInfo>
				// 		)
				// 	})
				// }, [userMessage])
				userMessage.length > 0?
				userMessage.map(message=> {
					console.log(message);
					
					return(
						// <div key= {message.mid}>
						//<p>From: {getUserName(message.from_user)}</p>
						//<p>Context: {message.context}</p>
						// </div>
						<UserInfo message = {message} newMes = {newMes} setNewMes = {setNewMes}></UserInfo>
					)
				})
				: 
				<p>Currently no message yet</p>
			}
		</>
		
	)
}


const UserInfo = ({message, newMes, setNewMes})=> {
	const [userInformation, setUserInformation] = useState({});
	console.log(message);
	setNewMes(message);
	
	useEffect(()=> {
		if(message.from_user != null){
			axios.get('http://localhost:8080/users/'+ message.from_user)
			.then(result=> {
				console.log(result.data);
				setUserInformation(result.data);
			})
		}
	
	}, [newMes]);
	console.log(message.reply);
	return(
		<div key= {message.mid}>
			<p>From: {userInformation.firstName } {userInformation.lastName}</p>
			<p>Context: {message.context}</p>
			<p>Reply: {
				message.reply == "" || message.reply == null?
				<>
					<p>Enter here</p>
					<ReplyBox message = {message}></ReplyBox>
				</>
				
				:
				<p>{message.reply}</p>
			}
			</p>
		</div>
	)
	
}

const ReplyBox = ({message})=> {
	return(
		<Formik
       initialValues={
		{
			from_user: message.from_user,
			to_user: message.to_user,
			reply: ''
			}
		}
       onSubmit={(values, actions) => {
        //  setTimeout(() => {
        //    alert(JSON.stringify(values, null, 2));
        //    actions.setSubmitting(false);
        //  }, 1000);
		console.log(values);
			axios.put('http://localhost:8080/message/'+ message.mid, {values})
			.then(result=> {
				console.log("Successfully sent")
			})
			.catch(err=> {
				console.log(err);
			})
       }}
     >
       {props => (
         <form onSubmit={props.handleSubmit}>
           <input
             type="text"
             onChange={props.handleChange}
             onBlur={props.handleBlur}
             value={props.values.reply}
             name="reply"
           />
           {props.errors.name && <div id="feedback">{props.errors.name}</div>}
           <button type="submit">Submit</button>
         </form>
       )}
     </Formik>
 );
	
}

//send according to names.
const NewMessage = ({userDetails})=> {
	return(
		<>
		<h3>Send new message</h3>
			<Formik
       initialValues={
		{
			from_user: userDetails.uid,
			to_user: '',
			message: ''
			}
		}
       onSubmit={(values, actions) => {
        //  setTimeout(() => {
        //    alert(JSON.stringify(values, null, 2));
        //    actions.setSubmitting(false);
        //  }, 1000);
		console.log(values);
			axios.post('http://localhost:8080/message/',{values})
			.then(result=> {
				console.log("Successfully sent")
			})
			.catch(err=> {
				console.log(err);
			})
       }}
     >
       {props => (
         <form onSubmit={props.handleSubmit}>
			
			<b>To User:</b>
		<input
             type="text"
             onChange={props.handleChange}
             onBlur={props.handleBlur}
             value={props.values.to_user}
             name="to_user"
           />
		<b>Context</b>
		<input
             type="text"
             onChange={props.handleChange}
             onBlur={props.handleBlur}
             value={props.values.message}
             name="message"
           />
           {props.errors.name && <div id="feedback">{props.errors.name}</div>}
           <button type="submit">Submit</button>
         </form>
       )}
     </Formik>
		</>
		
	)
}
export default MessageBox;