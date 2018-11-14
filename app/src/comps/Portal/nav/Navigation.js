import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";

const PortalNavigation = {
	DrawNavigation(userData) {
		let navigation =
		<nav>
			<a>Highland Records CMS</a>
			<ul>
				<li>
					<Link to="#">Artists</Link>
				</li>
				<li>
					<Link to="#">Users</Link>
				</li>
			</ul>
			<img src="https://via.placeholder.com/50"/>
			<a onClick={PortalFunctions.SignOut}>
				<Link to="#">Sign Out</Link>
			</a>
		</nav>

		return navigation;
	}
}


export default PortalNavigation;
