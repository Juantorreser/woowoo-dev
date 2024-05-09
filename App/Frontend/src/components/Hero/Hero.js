import React from 'react';
import './hero.css';
import './loading.css';
import { Button } from '../Button/button';


//the hero is the main background with the image and Woo Woo Network text
class Hero extends React.Component {
	render() {
		return(
			<div className='hero'>
				<div className="container">
					<div className="left">
						<h1>Woo</h1>
						<h1>Woo</h1>
						<h1>Network</h1>
					</div>
					<div className="right">
						<h2>Woo Woo Network aims to help people worldwide.</h2>
						<div className="sign-up-buttons">
							<a href="/about"><Button className="btn--learn">Learn More</Button></a>
							<a href="/signup"><Button className="btn--learn">Get Started</Button></a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Hero