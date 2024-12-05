import React, { useState, useEffect } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import logo from "../../Images/logo.png";
import { Button } from "../Button/button";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase-config";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import axios from "axios"; // Import axios to fetch user details

const auth = getAuth(app);

const NavbarComponent = () => {
	const [loggedIn, setLoggedIn] = useState(null);
	const [userRole, setUserRole] = useState(""); // State to store the user's role

	// Fetch logged-in user's role from the database
	const fetchUserRole = async (email) => {
		try {
			// Get the logged-in user's email from Firebase authentication
			const user = auth.currentUser;
			if (user) {
				const email = user.email;
	
				console.log(`Logged in user's email: ${email}`);
	
				// Fetch the list of users from your backend
				const response = await axios.get('http://localhost:8080/users');
				console.log('Fetched users:', response.data);
	
				// Find the user by email and get their role
				const loggedInUser = response.data.find((user) => user.email === email);
				if (loggedInUser) {
					console.log(`Logged in user's role: ${loggedInUser.role}`);
					console.log(`Logged in user's name: ${loggedInUser.firstName}`);
					setUserRole(loggedInUser.role); // Set the userRole state
				} else {
					console.log('No matching user found in the database.');
				}
			} else {
				console.log('No user is currently logged in.');
			}
		} catch (error) {
			console.error('Error fetching user role:', error);
		}
	
};

  	// Check if user is logged in
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setLoggedIn(user);
				fetchUserRole(user.email); // Fetch the user's role based on email
			} else {
				setLoggedIn(null);
				setUserRole("");
			}
		});
	}, []);

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			bg="light"
			className="my-0"
			variant="light"
			style={{
				height: "fit-content",
				backgroundColor: "#ffffff",
				boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
				position: "fixed",
				top: 0,
				width: "100%",
				zIndex: 1000,
			}}
		>
		<Container>
			<Navbar.Brand href="/home">
				<img src={logo} alt="Logo" style={{ height: "40px" }} />
			</Navbar.Brand>

			<Navbar.Toggle aria-controls="responsive-navbar-nav" />

			<Navbar.Collapse id="responsive-navbar-nav">
			<Nav className="me-auto" style={{ width: "fit-content" }}>
				{MenuItems.map((item, index) => (
				<Nav.Link
					key={index}
					href={item.url}
					className="px-4"
					style={{ backgroundColor: "#f8f9fa" }}
				>
					{item.title}
				</Nav.Link>
				))}
			</Nav>

			<Nav>
				{loggedIn ? (
				<>
					<Nav.Link href="/account" style={{ backgroundColor: "#f8f9fa" }}>
						<Button>Account</Button>
					</Nav.Link>

					<Nav.Link href="/signout" style={{ backgroundColor: "#f8f9fa" }}>
						<Button variant="outline-secondary">Sign Out</Button>
					</Nav.Link>

					{/* Display the user's role */}
					<Nav.Item className="">
					<span
						className="badge bg-primary"
						style={{
						padding: "0.5rem 1rem",
						borderRadius: "20px",
						fontSize: "0.9rem",
						}}
					>
						{userRole.charAt(0).toUpperCase() + userRole.slice(1)} {/* Capitalize */}
					</span>
					</Nav.Item>
				</>
				) : (
				<>
					<Nav.Link href="/signin" style={{ backgroundColor: "#f8f9fa" }}>
						<Button variant="outline-secondary">Sign In</Button>
					</Nav.Link>

					<Nav.Link href="/signup" style={{ backgroundColor: "#f8f9fa" }}>
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
