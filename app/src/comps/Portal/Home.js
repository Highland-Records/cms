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
				if (!res.ok) throw new Error(res.status);
				else return res.json();
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
			return <div>Loading...</div>;
		} else {
			console.log(artistsData);
			// const list = [1,2,3,4,5,7,3,2,];
			// const listItems = list.map((item) =>
  			// 	<li>{item}</li>
			// );
			const artistsHtml = artistsData.map((artist) =>
			<div>
				<p>{artist.id}</p>
				<p>{artist.name}</p>
			</div>

			);
			return (
				<div className="Portal">
					{PortalNavigation.DrawNavigation(userData)}
					<br/>
					<br/>
					<br/>
					<br/>
					<br/>
					<br/>
					{artistsHtml}
				</div>
			);
		}
	}
}

export default PortalHome;
