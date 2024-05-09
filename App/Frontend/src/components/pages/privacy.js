import React from 'react'
import privacy_policy from './privacy policy.pdf';

//Privacy is an embedded pdf document that can be easily modified and updated by the project sponsor. 
class privacy extends React.Component{
    render(){
        return(
			<div className='about'>
				<div className='hero'>
					<div className="container">
						<div className="left">
							<h1>Woo</h1>
							<h1>Woo</h1>
							<h1>Network</h1>                
						</div>
						<div className="policyContainer">
							<embed className="privacyPolicy" src={privacy_policy} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default privacy