import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";

const PortalNavigation = {
	DrawNavigation(userData) {
		let navigation =
		<nav>
			<ul>
				<li>
					Highland
				</li>
				<li>
					<Link to="#">Artists</Link>
				</li>
				<li>
					<Link to="#">Users</Link>
				</li>
				<li>
					<img src="https://via.placeholder.com/62" />
				</li>
				<li onClick={PortalFunctions.SignOut}>
					Sign Out
				</li>
			</ul>
		</nav>

		return navigation;
	}
}


export default PortalNavigation;
