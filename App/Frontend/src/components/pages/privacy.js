import React from 'react';
import privacy_policy from './privacy policy.pdf';

// Privacy is a component that redirects the user to view the PDF directly.
class Privacy extends React.Component {
    render() {
        return (
            <div className='about'>
                <div className='hero'>
                    <div className="container text-center">
                        <div className="left">
                            <h1>Woo</h1>
                            <h1>Woo</h1>
                            <h1>Network</h1>
                        </div>
                        <div className="policyContainer mt-4">
                            <a
                                href={privacy_policy}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                View Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Privacy;
