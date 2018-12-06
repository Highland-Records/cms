import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "../Navigation";

class ArtistPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			apiData: [],
			artistData: [],
			albumId: this.props.id
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// Get the album
		fetch(
			"http://highland.oliverrichman.uk/api/albums/" +
			this.state.albumId,
			{
				method: "GET",
			}
		)
		.then(res => {
			if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
		.then(
			r => {this.setState({isLoaded: true,apiData: r})},
			e => {this.setState({isLoaded: true,e})}
		);
	}
	// Get the artist
	GetArtist(id){
		fetch(
			"http://highland.oliverrichman.uk/api/artists/" +
			id,
			{
				method: "GET",
			}
		)
		.then(res => {
			if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
		.then(
			r => {this.setState({isLoaded: true,artistData: r})},
			e => {this.setState({isLoaded: true,e})}
		);
		console.log(this.state.artistData);
	}
	render() {
		const {error, apiData, artistData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			let artistBanner = 'http://highland.oliverrichman.uk/api/images/banners/' + artistData.banner_img;
			let artistProfile = 'http://highland.oliverrichman.uk/api/images/artists/' + artistData.profile_img;
			let albumArt = 'http://highland.oliverrichman.uk/api/images/albums/' + apiData.album_art;
//{GetArtist(this.state.apiData.artist)}
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}

					<div class="artist">
						<img src={artistBanner} alt={artistData.name} />
						<p>
							<img src={artistProfile} alt={apiData.name} />
							{artistData.name}
						</p>
					</div>
					<ul className="home">
						<li>
							<img src={albumArt} alt={apiData.title} />
							{apiData.title}
						</li>
						<li>
							Song Listing
						</li>
					</ul>
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
