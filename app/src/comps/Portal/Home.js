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
			userData: {},
			artistsData: []
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
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
				e => {this.setState({isLoaded: true,error: e})}
			);
	}

	deleteArtist(artistId) {
		fetch(
			"http://highland.oliverrichman.uk/api/artists/" +
				artistId +
				"/delete",
			{
				method: "POST",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
		.then(response => response.json())
		.then(response => {
			if (response.code === 200) {
				let artistToRemove = this.state.artistsData.find(
					a => a.id === artistId
				);
				var array = [...this.state.artistsData]; // make a separate copy of the array
				var index = array.indexOf(artistToRemove);
				if (index !== -1) {
					array.splice(index, 1);
					this.setState({artistsData: array});
				}
			}
		});
	}

	render() {

		const {error, userData, artistsData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			let artistsHtml;
			if(artistsData.length === 0) {
				artistsHtml = <div className="nothingFound">Nothing found<span>Anything you add will appear here</span></div>
			} else {
				artistsHtml = artistsData.map(artist => {
					let artistImage = artist.profile_img
						? PortalFunctions.CoreURLImages() + "artists/" + artist.profile_img
						: PortalFunctions.CoreURLImages() +
						  "default_profile.jpeg";
					return (
						<li>
							<div>
								<Link to={"/artist/"+artist.id}>
									<img src={artistImage} alt={artist.name} />
									<h2>{artist.name}</h2>
								</Link>
								<p>
									<span className="delete" onClick={() => this.deleteArtist(artist.id)}>remove</span>
								</p>
							</div>
						</li>
					);
				});
			}
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
