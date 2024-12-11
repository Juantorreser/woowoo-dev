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
  // State to track if a user is logged in
	const [loggedIn, setLoggedIn] = useState(null);

	// State to store the user's role (e.g., admin, user, etc.)
	const [userRole, setUserRole] = useState("");

	/**
	 * Fetch the logged-in user's role from the backend database.
	 * @param {string} email - The email of the logged-in user.
	 */
	const fetchUserRole = async (email) => {
		try {
			const user = auth.currentUser; // Get the current user from Firebase auth
			if (user) {
				const email = user.email; // Retrieve user's email
				console.log(`Logged in user's email: ${email}`);

				// Fetch all users from the backend
				const response = await axios.get("http://localhost:8080/users");
				console.log("Fetched users:", response.data);

				// Find the logged-in user by matching the email
				const loggedInUser = response.data.find((user) => user.email === email);
				if (loggedInUser) {
				console.log(`Logged in user's role: ${loggedInUser.role}`);
				console.log(`Logged in user's name: ${loggedInUser.firstName}`);
				setUserRole(loggedInUser.role); // Update the user role state
				} else {
				console.log("No matching user found in the database.");
				}
			} else {
				console.log("No user is currently logged in.");
		}
	} catch (error) {
		console.error("Error fetching user role:", error);
	}
	};

	/**
	 * Checks if a user is logged in and fetches their role from the database.
	 */
	useEffect(() => {
	auth.onAuthStateChanged((user) => {
		if (user) {
		setLoggedIn(user); // Update loggedIn state
		fetchUserRole(user.email); // Fetch the user's role
		} else {
		setLoggedIn(null); // No user is logged in
		setUserRole(""); // Reset the role
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
		{/* Navbar Brand - Logo */}
		<Navbar.Brand href="/home">
			<img src={logo} alt="Logo" style={{ height: "40px" }} />
		</Navbar.Brand>

		{/* Toggle button for mobile view */}
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />

		{/* Collapsible Navbar Section */}
		<Navbar.Collapse id="responsive-navbar-nav">
			<Nav className="me-auto" style={{ width: "fit-content" }}>
			{/* Render menu items dynamically */}
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

			{/* Right Section: Sign In/Sign Out and User Role */}
			<Nav>
			{loggedIn ? (
				<>
				{/* Account button */}
				<Nav.Link href="/account" style={{ backgroundColor: "#f8f9fa" }}>
					<Button>Account</Button>
				</Nav.Link>

				{/* Sign Out button */}
				<Nav.Link
					href="/signout"
					style={{ backgroundColor: "#f8f9fa" }}
				>
					<Button variant="outline-secondary">Sign Out</Button>
				</Nav.Link>

				{/* Display the user's role */}
				<Nav.Item>
					<span
					className="badge bg-primary"
					style={{
						padding: "0.5rem 1rem",
						borderRadius: "20px",
						fontSize: "0.9rem",
					}}
					>
					{userRole.charAt(0).toUpperCase() + userRole.slice(1)}
					</span>
				</Nav.Item>
				</>
			) : (
				<>
				{/* Sign In button */}
				<Nav.Link
					href="/signin"
					style={{ backgroundColor: "#f8f9fa" }}
				>
					<Button variant="outline-secondary">Sign In</Button>
				</Nav.Link>

				{/* Sign Up button */}
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
