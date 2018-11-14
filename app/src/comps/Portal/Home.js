import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "./PortalFunctions";
import PortalNavigation from "./nav/Navigation";

// - Home Portal Page
class PortalHome extends React.Component {

	userData = {};

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {}
		};
	}

	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {this.setState({isLoaded: true,items: r})},
				e => {this.setState({isLoaded: true,e})}
			);
	}
	render() {
		const {error, isLoaded, items} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="Portal">
					{PortalNavigation.DrawNavigation(items)}
				</div>
			);
		}
	}
}

export default PortalHome;
