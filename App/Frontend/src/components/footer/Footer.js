import React from "react";
import { Link } from "react-router-dom";
import './footer.css';


const Footer = () => {
    return(
		<footer>
			<div className="footer">
				<Link className="footerLink" to="/privacy">Privacy Statement</Link>
			</div>
		</footer>
    );
};

export default Footer;