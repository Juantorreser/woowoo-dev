import React from 'react';
import './hero.css';
import './loading.css';
import { Button } from '../Button/button';

class Hero extends React.Component {
    render() {
        return (
            <div className="hero">
                
                <div className="hero-container">
                    <div className="row justify-content-center align-items-center text-center">
                        
                        <div className="col-12">
                            <h1>Woo Woo Network</h1>
                        </div>

                        
                        <div className="col-12">
                            <h2>Woo Woo Network aims to help people worldwide.</h2>
                            <div className="sign-up-buttons mt-4">
                                <a href="/about">
                                    <Button className="btn--learn">Learn More</Button>
                                </a>
                                <a href="/signup">
                                    <Button className="btn--learn">Get Started</Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Hero;
