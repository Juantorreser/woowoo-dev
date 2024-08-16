import { app } from '../firebase/firebase-config.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import options from '../dropdown/Services.js';
import { MultiSelect } from 'react-multi-select-component';
import './adminDashboard.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './adminDashboard.css';
// import { userSchema as schema } from './s4chema.js';
import '../../bootstrap/dist/css/bootstrap.min.css';

const UserModals = ({show, showList, users, handleClose})=> {
  const [selectedUser, setSelectedUser] = useState({});
  const [appointmentHistory, setAppointmentHistory] = useState([{}]);
  const [paymentHistory, setPaymentHistory] = useState({});
  const [stripeError, setStripeError] = useState({});
  var tempUser = {};
  useEffect(()=> {
    for(let i of users){
      if((parseInt(i.uid)-1) == showList.indexOf(true)){
        // setSelectedUser(i);
        tempUser = i;
        setSelectedUser(tempUser);
        break;
      }
    }
  }, [showList]);
  
  useEffect(async ()=> {
    if(selectedUser.account == 1){
      await axios.get("http://localhost:8080/appointments?healer="+selectedUser.uid)
        .then(response=> {
            setAppointmentHistory(response.data);
        })
        .catch(err=> {
          alert(err);
        })
    }
    else{
        axios.get("http://localhost:8080/appointments/clients/"+ selectedUser.uid)
        .then(response=> {
          setAppointmentHistory(response.data);
        })
        .catch(err=> {
          alert(err);
        })

    }
  }, [selectedUser]);

  useEffect(async ()=> {
    if(selectedUser.stripeAccount != null){
      await axios.get("http://localhost:8080/financeReport/"+ selectedUser.stripeAccount)
      .then(response=> {
        setPaymentHistory(response.data);
      })
      .catch(err=> {
        alert("Error while getting payment history: "+ err);
      })
    }
    else{  //if the next user does not have a stripe account, make it empty again.
      setPaymentHistory({});
    }
  }, [selectedUser])

  useEffect(async ()=> {
    if(selectedUser.stripeAccount != null){
      await axios.get("http://localhost:8080/stripeAccount/"+ selectedUser.stripeAccount)
      .then(response=> {
        setStripeError(response.data.errors);
      })
      .catch(err=> {
        alert("Error while getting payment history: "+ err);
      })
    }
    else{  //if the next user does not have a stripe account, make it empty again.
      setStripeError({});
    }
  }, [selectedUser])
    return(
      <>
      
         <Modal className = "user-modal" show={show} onHide={()=>{handleClose()}}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedUser.firstName + " "+ selectedUser.lastName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Appointment History: </h5>
                <table>
                    <tr>
                        <th>Healer</th>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                    {appointmentHistory.length > 0 ? appointmentHistory.map(history=> {
                      return(
                        <AppointmentHistoryRow history = {history}></AppointmentHistoryRow>
                      )
                    
                }
                )
                :
                  <p>There seems to be no appointment set for this user yet.</p>
                }
                  </table>
                <h5>Payment history: </h5>
                <table>
                  <tr>
                    <th>Price</th>
                    <th>Receipt</th>
                  </tr>
                  {paymentHistory.data!= undefined ? paymentHistory.data.map(history=> {
                    return(
                      <PaymentHistoryRow history = {history}></PaymentHistoryRow>
                    )
                  }
                )
              :
              <p>There seems to be no payment history</p>}

                </table>

            </Modal.Body>
           
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{handleClose()}}>
                  Close
                </Button>
            </Modal.Footer>
      </Modal>
      </>
    )
}

const AppointmentHistoryRow = ({history})=> {
  return(
      <tr>
        <td>{history.healer}</td>
        <td>{history.client}</td>
        <td>{history.appointmentService}</td>
        <td>{history.date}</td>
        <td>{history.time}</td>
      </tr>
  )
}

const PaymentHistoryRow = ({history})=> {
  return(
    <tr>
      <td>{parseInt(history.amount)/100}</td>
      <td><a href = {history.receipt_url}>Click here to see</a></td>
    </tr>
)
}

export default UserModals;