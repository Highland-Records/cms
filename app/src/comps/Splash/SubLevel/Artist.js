import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "../Navigation";
import PortalFunctions from "../../Portal/PortalFunctions";

class ArtistPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			apiData: {},
			artistId: this.props.id,
			albumData: []
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// Get the album
		fetch(
			"http://highland.oliverrichman.uk/api/artists/" +
			this.state.artistId,
			{
				method: "GET",
			}
		)
		.then(response => response.json())
		.then(response => {
			this.setState({apiData: response});
			let albumArray = [];
			let AlbumListArray = [];
			if (String(this.state.apiData.albums).includes(',')){
				albumArray = this.state.apiData.albums.split(',');
			} else {
				albumArray.push(this.state.apiData.albums);
			}
			AlbumListArray = albumArray.map(album => {
				PortalFunctions.GetAlbum(album)
					.then(response => response.json())
					.then(response => {
						this.setState({albumData: response})
					});
			});
		});
	}
	render() {
		const {error, apiData, albumData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			let artistBanner = 'http://highland.oliverrichman.uk/api/images/banners/' + apiData.banner_img;
			let artistProfile = 'http://highland.oliverrichman.uk/api/images/artists/' + apiData.profile_img;

			{this.state.albumData.map(function(name, index){
				return <li key={ index }>{name}</li>;
			})}

			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation("artists")}
					<div class="artist">
						<img src={artistBanner} alt={apiData.name} />
						<p>
							<img src={artistProfile} alt={apiData.name} />
							{apiData.name}
						</p>
					</div>
					<ul className="home">
						<li>
							About {apiData.name}
						</li>
						<li>
							{apiData.description}
						</li>
					</ul>
					<div className="list extra">
						<h2>Lastest Releases</h2>
						<ul>

						</ul>
					</div>
					<div className="list extra">
						<h2>Videos</h2>
						<ul>

						</ul>
					</div>
					<footer>
						<div className="c">
							<i>Highland</i>
							<p>&copy; 2018 Highland Records</p>
						</div>
					</footer>
				</section>
			);
		}
	}
}
export default ArtistPage;
