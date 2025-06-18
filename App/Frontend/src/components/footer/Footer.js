import React from "react";
import { Link } from "react-router-dom";
import './footer.css';


const Footer = () => {
    return(
		<footer>
			<div className="footer">
				<h1>Woo Woo Network 2025</h1>
				<Link className="footerLink" to="/privacy">Privacy Statement</Link>
			</div>
		</footer>
    );
};

export default Footer;