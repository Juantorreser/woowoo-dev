import React from 'react';
import './about.css';
import aboutFile from './about.txt';

function readFile(input) {
	//Not entirely sure how this all works because I stole this from a stackoverflow post
	//https://stackoverflow.com/questions/36921947/read-a-server-side-file-using-javascript
	//There's also something about Chrome not allowing it because of a same origin request but it seems to work anyway
	//This is also apparently deprecated and should be used asynchronously instead but I don't want to figure that out right now
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.open("GET", input, false);
	xmlhttp.send();
	
	if (xmlhttp.status === 200) {
		result = xmlhttp.responseText;
	}
	
	return result;
}

class about extends React.Component{
    render(){
		let aboutText = readFile(aboutFile);
        return(
			<div className='about'>
				<div className='hero'>
					<div className="container">
							<div className="left">
								<h1>Woo</h1>
								<h1>Woo</h1>
								<h1>Network</h1>                
							</div>
							<div className="aboutContainer">
								<pre className="aboutText">{aboutText}</pre>
							</div>
					</div>
				</div>
			</div>
		);
	}
}

export default about