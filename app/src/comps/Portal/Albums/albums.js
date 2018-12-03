import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

class Albums extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			albumsData: []
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
		PortalFunctions.GetAllAlbums()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
					else return res.json();
				})
			.then(
				r => {this.setState({isLoaded: true,albumsData: r})},
				e => {this.setState({isLoaded: true,error: e})}
			);
	}

	deleteAlbum(albumId) {
		// fetch(
		// 	"http://highland.oliverrichman.uk/api/artists/" +
		// 		artistId +
		// 		"/delete",
		// 	{
		// 		method: "POST",
		// 		headers: new Headers({
		// 			Authorization:
		// 				"Bearer " + localStorage.getItem("AuthToken")
		// 		})
		// 	}
		// )
		// .then(response => response.json())
		// .then(response => {
		// 	if (response.code == 200) {
		// 		let artistToRemove = this.state.artistsData.find(
		// 			a => a.id == artistId
		// 		);
		// 		var array = [...this.state.artistsData]; // make a separate copy of the array
		// 		var index = array.indexOf(artistToRemove);
		// 		if (index !== -1) {
		// 			array.splice(index, 1);
		// 			this.setState({artistsData: array});
		// 		}
		// 	}
		// });
	}

	render() {

		const {error, isLoaded, userData, albumsData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {

			const albumsHtml = albumsData.map(album => {
				let albumImage = album.profile_img
					? PortalFunctions.CoreURLImages() + "albums/" + album.album_art
					: PortalFunctions.CoreURLImages() +
					  "album_art.jpeg";
				return (
					<li>
						<div>
							<Link to={"/album/"+album.id}>
								<img src={albumImage} />
								<h2>{album.title}</h2>
							</Link>
							<p>
								<a className="delete" onClick={() => this.deleteAlbum(album.id)}>remove</a>
							</p>
						</div>
					</li>
				);
			});
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData, "albums")}
					<header>
						Albums
						<Link to="/albums/new">Add a new Album</Link>
					</header>
					<ul className="albumsList">
						{albumsHtml}
					</ul>
				</section>
			);
		}
	}
}

// <ul className="artistList">
// 	{artistsHtml}
// </ul>

export default Albums;
