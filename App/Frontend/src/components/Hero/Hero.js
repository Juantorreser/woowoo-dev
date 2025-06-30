import React from 'react';
import './hero.css';
import './loading.css';
import { Button } from '../Button/button';

class Hero extends React.Component {
    render() {
        return (
            <div className="hero">
                <div className="hero-container d-flex flex-column justify-content-between m-0 p-0 h-100">
                    <div>
                        <h2>Meet</h2>
                        <h1>Woo Woo Network</h1>
                    </div>

                    <div className='d-flex flex-column-reverse gap-5 w-md-50 justify-content-center flex-md-row align-items-center w-100'>
                        <div className='d-flex flex-column justify-content-center align-items-center gap-2 me-md-5'>
                            <p className='mb-md-4'>We Connect healers to clients <br />
                                needing a healing service</p>
                            <div className='d-flex flex-column gap-2 w-100 flex-md-row align-items-center justify-content-center'>
                                <a href="/search">
                                    <Button>Find Healers </Button>
                                </a>
                                <a href="/login">
                                    <span>Don't have an account yet? <br /> <span className='text-decoration-underline'>Register Here</span></span>
                                </a>

                            </div>
                        </div>
                        <img src='/hero.png' width={300} className='ms-md-5' />
                    </div>
                    <div className="divider-container position-relative">
                        <img src="/divider.png" height={150} id="section-divider" className="w-100" />
                        <a href="#about" className="abt-link position-absolute top-50 start-50 translate-middle">
                            About Us
                        </a>
                    </div>




                    {/* <div className="row justify-content-center align-items-center text-center">

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
                    </div> */}
                </div>
            </div>
        );
    }
}

export default Hero;
