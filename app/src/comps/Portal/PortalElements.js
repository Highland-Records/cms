import React from 'react';
import { Link } from 'react-router-dom';

const PortalElements = {
	SignOut () {
		if(localStorage.getItem("AuthToken")) {
			localStorage.removeItem('UserID');
			localStorage.removeItem('AuthToken');
			window.location.href = "/";
		}
	},
	PortalNavigation(location) {
		return (
			<nav>
				Highland Records CMS
				<ul>
					<li onClick={this.SignOut}>
						<Link to="#">Sign Out</Link>
					</li>
				</ul>
			</nav>
		);
	}
}

export default PortalElements;
