import React from "react";
import {Link} from "react-router-dom";
import PortalElements from "./PortalElements";

// - Home Portal Page
class PortalHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {}
		};
	}

	componentDidMount() {
		fetch(
			"http://highland.oliverrichman.uk/api/users/" +
				localStorage.getItem("UserID"),
			{
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken"),
					id: localStorage.getItem("UserID")
				})
			}
		)
			.then(res => {
				console.log(res);
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				result => {
					this.setState({
						isLoaded: true,
						items: result
					});
				},
				error => {
					this.setState({
						isLoaded: true,
						error
					});
				}
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
					{PortalElements.PortalNavigation()}
					<section className="PortalStyle">
						Welcome back, {items.first_name} {items.last_name}
						!
					</section>
				</div>
			);
		}
	}
}

export default PortalHome;
