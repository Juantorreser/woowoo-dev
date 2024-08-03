import { app } from '../firebase/firebase-config';
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
import Button from 'react-bootstrap/Button';
import UserModals from '../pages/userModals';
// import { userSchema as schema } from './s4chema.js';
import '../../bootstrap/dist/css/bootstrap.min.css';
const auth = getAuth(app);

const AdminDashboard = ()=> {  
	const [ userDetails, setUserDetails ] = useState(null);

    useEffect(() => {
		//let userD = "";
		//this method checks if the user is authenticated with firebase and essentially logged in.
		auth.onAuthStateChanged( (user) => {   //check if the user is signed in or not.
			console.log(user);
            if(user != null){
                axios.get('http://localhost:8080/users').then(  (response) => {
                    // setUserDetails(chosenUser);
                    // console.log(response.data)
                    for(const i of response.data){
                        if (i.email === user.email){
                            setUserDetails(i);
                            break;
                        }
                    }
                });
            }
			else{
                alert("You appear to not logged in yet. PLease log in to use admin privilege.")
                window.location.assign("/signin");
            }
        })
    }, [])

    return(
        <Dashboard userDetails = {userDetails}></Dashboard>
    )
}

const Dashboard = ({userDetails})=> {
    return(
        <>
            <h1>Admin Dashboard</h1>
            <Header></Header>
        </>
    )
}

const Header= ()=> {
    return(
        <Container>
            <Row >
                <Col>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="./admin-users.jpg" />
                        <Card.Body>
                            <Card.Title>Users</Card.Title>
                            <Card.Text>
                                Examine the users who sign up
                            </Card.Text>
                            
                            <button className = "tile-button"onClick = {()=> {
                                        window.location.assign("/adminUsers");
                                    }}><h4>Click here to view users</h4></button>
                                
                                <button className = "tile-button"onClick = {()=> {
                                window.location.assign("/admin-account-search");
                            }}><h4>Click here to manage users</h4></button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col >
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Services</Card.Title>
                            <Card.Text>
                            Examine the services offered.
                            </Card.Text>
                            <button className = "tile-button"onClick = {()=> {
                                        window.location.assign('/editServices');
                                    }}><h4>Click here</h4></button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const EditServices = ()=> {
    const [services, setServices] = useState([{}]);

    useEffect(async ()=> {
        await axios.get("http://localhost:8080/services")
        .then(response => {
            console.log(response);
            setServices(response.data);
        })
        .catch(err=> {
            alert("Issue with fetching services in admin");
        })
    }, [])
    return(
        <ServicesTable services = {services}></ServicesTable>
    )
}

const ServicesTable = ({services})=> {
    return(
        <>
            <button style = {{"background-color":"#9D96B8"}}onClick = {()=> {
                window.location.assign('/admin')
            }}>Go back to dashboard</button>
            <table>
                <tr>
                    <th>Service Name</th>
                    <th className = "px-5">Service Description</th>
                    <th>Status</th>
                </tr>
                {services.map(service=> {
                    var tempService = service;
                    return(
                        <tr>
                            <td>{service.service}</td>
                            <td className = "px-5">{service.description}</td>
                            {
                            service.blocked == null  ?   //the service has not been blocked.
                                <>
                                    <td>
                                        <p style = {{"background-color": "green"}}>Enabled</p>
                                    </td>
                                    <td>
                                    <button className = "tile-button "  style = {{"background-color": "red"}} onClick = {()=> 
                                    {
                                    alert("You are about to disable this service.");
                                    tempService.blocked = 1;
                                    axios.put("http://localhost:8080/services/"+tempService.sid, tempService)
                                    .then(response=> {
                                        window.location.reload();
                                    })
                                    .catch(err=> {
                                        alert("Something wrong: "+ err);
                                    })}
                                    }>Disable
                                </button>
                                    </td>
                                    
                                </>
                            :
                            <>
                                <td>
                                    <p style = {{"background-color": "orange"}}>Disabled</p>
                                </td>
                                <td>
                                <button className = "tile-button " style = {{"background-color": "green"}} onClick = {()=> 
                                {
                                alert("You are about to enable this service.");
                                tempService.blocked = null;
                                axios.put("http://localhost:8080/services/"+tempService.sid, tempService)
                                .then(response=> {
                                    window.location.reload();
                                })
                                .catch(err=> {
                                    alert("Something wrong with enabling this service: "+ err);
                                })}
                                }>Enable
                            </button>
                                </td>
                            
                            </>
                            }
                            <button onClick = {()=> {
                                axios.delete("http://localhost:8080/services/"+service.sid)
                                .then(response=> {
                                    alert("You are about to delete this service");
                                    window.location.reload();
                                })
                                .catch(err=> {
                                    alert("Something wrong with deleting service: "+err);
                                })
                            }}>Delete service</button>
                        </tr>
                    )
                })}
</table>
        </>
    )
    
}

const AdminUsers = ()=> {
    const [users, setUsers] = useState([{}]);
    const [stripeUsers, setStripeUsers] = useState([{}]);
    useEffect(async ()=> {
        await axios.get("http://localhost:8080/users")
        .then(response=> {
            setUsers(response.data);
        })
        .catch(err=> {
            alert("Something wrong with grabbing the users");
        })
    }, [])
    return(   //a list of users which you can examine and edit
        <UsersList users = {users} ></UsersList>
    )
}

//"show" variable is an array that contain true/false for each users. 
const UsersList = ({users})=> {
    const [show, setShow] = useState(false);
    const [showList, setShowList] = useState([]);
  const handleOpen = ()=> {
    setShow(true);
  }

    const handleClose = ()=> {
    setShow(false);
    }

    var tempArray = [];
    //initializing the showList variable
    const initializer = ()=>{
        users.map(user=> {
            tempArray.push(false);
        })
    }
    
    
    return(
        <>
             <button style = {{"background-color":"#9D96B8"}}onClick = {()=> {
                window.location.assign('/admin')
            }}>Go back to dashboard</button>
            <h3>User Lists</h3>
            <Row className = "m-6">
            {
                users.map(user=> {
                    return(
                        <>
                            <Col xs lg = {4}>
                                <Card className = "col" style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src="holder.js/100px180" />
                                    <Card.Body>
                                        <Card.Title>{user.firstName + " "+user.lastName}</Card.Title>
                                        <Card.Text>
                                            {user.account == 1? <p>Role: Healer</p>: <>{user.account == 2? <p>Role: Admin</p>: <p>Role: Client</p>}</>}
                                        </Card.Text>
                                        <Card.Text>
                                            
                                        </Card.Text>
                                        <button className = "tile-button" onClick = {()=> {
                                            initializer();   //when click, will initialize it back to all false and then open the needed one.
                                            tempArray[parseInt(user.uid)-1] = true;
                                            setShowList(tempArray);
                                            handleOpen();
                                        }}><h4>View more</h4>
                                        </button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </> 
                    )
                })
            }
            </Row>
            <UserModals  show = {show} users = {users} showList = {showList} handleClose = {handleClose} ></UserModals>
        </>
    )
}




export {AdminDashboard, EditServices, AdminUsers};