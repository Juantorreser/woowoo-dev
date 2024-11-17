import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { app } from '../firebase/firebase-config';
import { getAuth } from 'firebase/auth';
import { Card, Row, Col, Button, Container, Form } from 'react-bootstrap'; 

const auth = getAuth(app);

const MessageBox = () => {
    const [createNewMessage, setCreateNewMessage] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [loggedIn, setLoggedIn] = useState(null); // Records whether a user is logged in or not

	// Check if user is logged in
	auth.onAuthStateChanged((user) => {
		setLoggedIn(user); // Update Logged in status
	});

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await axios.get('http://localhost:8080/users').then((response) => {
                    for (const i of response.data) {
                        if (i.email.toLowerCase() === user.email.toLowerCase()) {
                            console.log(i);
                            setUserDetails(i);
                            break;
                        }
                    }
                });
            }
        });
    }, []);

    // Returns the message box and messages if a user is authenticated. Otherwise return a message prompting the user to log in.
    return loggedIn ? (
        <Container className="mb-5 pt-3">
            <Row>
                <Col>
                    <h3>Upcoming messages</h3>
                    <UserBox userDetails={userDetails} />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Send new message</h3>
                    <NewMessage userDetails={userDetails} />
                </Col>
            </Row>
        </Container>
    ) : (
        <>
            <h1>
                Sign In to View Messages
            </h1>
        </>
    );
};

const UserBox = ({ userDetails }) => {
    const [userMessage, setUserMessage] = useState([{}]);

    useEffect(() => {
        if (userDetails.uid) {
            axios.get('http://localhost:8080/message/' + userDetails.uid).then((result) => {
                setUserMessage(result.data);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [userDetails]);

    return (
        <>
            <Row>
                {userMessage.length > 0 ? (
                    userMessage.map(message => (
                        <Col key={message.mid} xs={12} md={6} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <UserInfo message={message} />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>Currently no message yet</p>
                )}
            </Row>
        </>
    );
};

const UserInfo = ({ message }) => {
    const [userInformation, setUserInformation] = useState({});

    useEffect(() => {
        if (message.from_user != null) {
            axios.get('http://localhost:8080/users/' + message.from_user).then(result => {
                setUserInformation(result.data);
            });
        }
    }, [message]);

    return (
        <div>
            <p><strong>From:</strong> {userInformation.firstName} {userInformation.lastName}</p>
            <p><strong>Context:</strong> {message.context}</p>
            <p><strong>Reply:</strong> {message.reply ? message.reply : <ReplyBox message={message} />}</p>
        </div>
    );
};

const ReplyBox = ({ message }) => {
    return (
        <Formik
            initialValues={{
                from_user: message.from_user,
                to_user: message.to_user,
                context: message.context,
                reply: ''
            }}
            onSubmit={(values, actions) => {
                axios.put('http://localhost:8080/message/' + message.mid, { values })
                    .then(result => {
                        console.log("Successfully sent");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }}
        >
            {props => (
                <Form onSubmit={props.handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.reply}
                            name="reply"
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-2">Submit</Button>
                </Form>
            )}
        </Formik>
    );
};

const NewMessage = ({ userDetails }) => {
    return (
        <>
            {userDetails.uid == null ? (
                <p>Something is wrong</p>
            ) : (
                <Formik
                    initialValues={{
                        from_user: userDetails.uid,
                        to_user: '',
                        message: ''
                    }}
                    onSubmit={(values, actions) => {
                        axios.post('http://localhost:8080/message/', { values })
                            .then(result => {
                                console.log("Successfully sent");
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }}
                >
                    {props => (
                        <Form onSubmit={props.handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>To User:</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.to_user}
                                    name="to_user"
                                />
                                <p className='text-danger'>User Not Found</p>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Context:</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.message}
                                    name="message"
                                />
                            </Form.Group>

                            <Button type="submit">Submit</Button>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default MessageBox;
