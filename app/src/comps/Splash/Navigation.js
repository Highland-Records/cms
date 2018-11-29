import React from "react";
import {Link} from "react-router-dom";

const HomeNavigation = {
	DrawNavigation() {
		let navigation = (
			<nav>
				<div>
					<Link className="title" to="/">
						<h1>Highland</h1>
					</Link>
					<ul>
						<li>
							<Link to="/artists">Artists</Link>
						</li>
						<li>
							<Link to="/about">About</Link>
						</li>
						<li>
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
					<Link className="adminLink" to="/sign-in">Sign In</Link>
				</div>
			</nav>
		);
		return navigation;
	}
};

export default HomeNavigation;
