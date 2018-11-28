import React from "react";
import {Link} from "react-router-dom";

const HomeNavigation = {
	DrawNavigation(userData) {
		let navigation = (
			<nav>
				<Link className="title" to="/">Highland Records</Link>
				<Link className="adminLink" to="/sign-in">Admin</Link>
				<ul>
					<li>
						<Link to="/artists">Artists</Link>
					</li>
					<span> &bull; </span>
					<li>
						<Link to="/about">About</Link>
					</li>
					<span> &bull; </span>
					<li>
						<Link to="/contact">Contact</Link>
					</li>
				</ul>
			</nav>
		);
		return navigation;
	}
};

export default HomeNavigation;
