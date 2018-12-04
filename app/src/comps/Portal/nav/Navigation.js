import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";

const PortalNavigation = {
	DrawNavigation(userData, location) {
		if (location === 'users') {
			this.location = 'users';
		} else if (location === 'home') {
			this.location = 'home';
		} else if (location === 'albums') {
			this.location = 'albums';
		} else if(location === null) {
			// IGNORE THIS
		}
		let profileUrl = userData.profile_img ? PortalFunctions.CoreURLImages() + userData.profile_img : PortalFunctions.CoreURLImages() + "default_profile.jpeg";
		let navigation = (
			<nav>
				<ul>
					<li>
						<Link to="/">Highland</Link>
					</li>
					<li>
						<Link to="/" className={this.location === 'home' ? 's' : ''}>Artists</Link>
					</li>
					<li>
						<Link to="/albums" className={this.location === 'albums' ? 's' : ''}>Albums</Link>
					</li>
					<li>
						<Link to="/users" className={this.location === 'users' ? 's' : ''}>Users</Link>
					</li>
					<li>
						<img
							src={profileUrl}
							alt="This is you"
						/>
					</li>
					<li>
						{userData.first_name} {userData.last_name}
						<br />
						<Link to="/settings">Settings</Link>
						<p>&bull;</p>
						<p onClick={PortalFunctions.SignOut}>Sign Out</p>
					</li>
				</ul>
			</nav>
		);
		return navigation;
	}
};

export default PortalNavigation;
