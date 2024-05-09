import React, { useState } from 'react';
import { MenuItems } from './MenuItems';
import './Navbar.css';
import logo from '../../Images/logo.png';
import { Button } from '../Button/button';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase-config';

//firebase authentication instance
const auth = getAuth(app);

const Navbar = () => {
	//const [menuOpen, setMenuOpen] = useState(false);
	const [loggedIn, setLoggedIn] = useState(null);

	//the firebase auth instance is checked to determine whether the user is signed in
	auth.onAuthStateChanged((user) => {
		setLoggedIn(user);
	});

	const Buttons = () => {
		if(loggedIn){
			return (
				<div className="sign-up-buttons">
					<a href="/account"><Button>Account</Button></a>
					<a href="/signout"><Button className="btn--outline">Sign Out</Button></a>
				</div>
			)
		} else { 
			return (
				<div className="sign-up-buttons">
					<a href="/signin" className="sign-in-button"><Button className="btn--outline">Sign In</Button></a>
					<a href="/signup" className="sign-up-button"><Button>Sign Up</Button></a>
				</div>
			)
		}
	}

	/*
	const toggleMenu = () => {
		setMenuOpen(!setMenuOpen);
		console.log(menuOpen);
	};
	*/

	return(
		<nav className='navbar-items'>
			<div className='logo-container'>
				<a href='/home'>
					<img className='logo' src={logo} alt='Logo'/>
				</a>
			</div>
			<div className='menu-icon'>
			</div>
			<ul className={'nav-menu'}>
				{MenuItems.map((item,index)=>{
					return(
						<li key={index}>
							<a className={item.cName} href={item.url}>
								{item.title}
							</a>
						</li>
					)
				})}
			</ul>
			{Buttons()}
		</nav>
	)
}

export default Navbar