import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "./PortalFunctions";
import PortalNavigation from "./nav/Navigation";

// - Home Portal Page
class PortalHome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artistsData: []
		};
	}

	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) {
					console.log("API Status: ",res.status);
					PortalFunctions.SignOut();
					throw new Error(res.status);
				} else {
					return res.json();
				}
			})
			.then(
				r => {this.setState({isLoaded: true,userData: r})},
				e => {this.setState({isLoaded: true,e})}
			);
		PortalFunctions.GetAllArtists()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
					else return res.json();
				})
			.then(
				r => {this.setState({isLoaded: true,artistsData: r})},
				e => {this.setState({isLoaded: true,e})}
			);
	}
	render() {

		const {error, isLoaded, userData, artistsData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div></div>;
		} else {
			const artistsHtml = artistsData.map((artist) =>
			<li>{artist.name}</li>
			);
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData, "home")}
					<header>
						Artists
						<Link to="/artists/new">Add a new Artist</Link>
					</header>
					<ul className="artistList">
						{artistsHtml}
					</ul>
				</section>
			);
		}
	}
}

export default PortalHome;
