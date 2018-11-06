import React from "react";
import {Link} from "react-router-dom";
import PortalElements from "./PortalElements";

// - Home Portal Page
class PortalHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			RCount: true
		};
	}
	render() {
		return (
			<div className="Portal">
				{PortalElements.PortalNavigation()}
				<section className="PortalStyle">Welcome back!</section>
			</div>
		);
	}
}

export default PortalHome;
