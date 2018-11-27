import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";

const PortalNavigation = {
	DrawNavigation(userData) {
		console.log(userData);
		let navigation = (
			<nav>
				<ul>
					<li>
						<Link to="/">Highland</Link>
					</li>
					<li>
						<Link to="/">Artists</Link>
					</li>
					<li>
						<Link to="/users">Users</Link>
					</li>
					<li>
						<img
							src={
								PortalFunctions.CoreURLImages() +
								userData.profile_img
							}
						/>
					</li>
					<li>
						{userData.first_name} {userData.last_name}
						<br />
						<Link to="/settings">Settings</Link>
						<p onClick={PortalFunctions.SignOut}>Sign Out</p>
					</li>
				</ul>
			</nav>
		);
		return navigation;
	}
};

export default PortalNavigation;
