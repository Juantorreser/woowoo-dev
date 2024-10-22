import React, { useState } from 'react';
import { MenuItems } from './MenuItems';
import './Navbar.css';
import logo from '../../Images/logo.png';
import { Button } from '../Button/button';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase-config';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'; // Bootstrap components

const auth = getAuth(app);

const NavbarComponent = () => {
	const [loggedIn, setLoggedIn] = useState(null);

	// Check if user is logged in
	auth.onAuthStateChanged((user) => {
		setLoggedIn(user);
	});

	return (
		// Navbar Container
		<Navbar collapseOnSelect expand="lg" bg="light" className="my-0" variant="light" style={{height: 'fit-content' }}>
			<Container>
				<Navbar.Brand href="/home">
					<img src={logo} alt="Logo" style={{ height: '40px' }} />
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="responsive-navbar-nav" />

				<Navbar.Collapse id="responsive-navbar-nav" >
					<Nav className="me-auto" style={{ width: 'fit-content' }}>
						{MenuItems.map((item, index) => (<Nav.Link key={index} href={item.url} className="px-4" style={{backgroundColor: '#f8f9fa' }} > {item.title}</Nav.Link> ))}
					</Nav>

					<Nav>
						{loggedIn ? ( 
							<>
								<Nav.Link href="/account" style={{backgroundColor: '#f8f9fa' }}>
									<Button >Account</Button>
								</Nav.Link>

								<Nav.Link href="/signout" style={{backgroundColor: '#f8f9fa' }}>
									<Button variant="outline-secondary">Sign Out</Button>
								</Nav.Link>
							</>
						) : (
							<>
								<Nav.Link href="/signin" style={{backgroundColor: '#f8f9fa' }}>
									<Button variant="outline-secondary">Sign In</Button>
								</Nav.Link>

								<Nav.Link href="/signup" style={{backgroundColor: '#f8f9fa' }}>
									<Button>Sign Up</Button>
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavbarComponent;
