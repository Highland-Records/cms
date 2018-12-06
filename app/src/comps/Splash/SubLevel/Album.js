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
			artistData: {},
			albumId: this.props.id
		};
		// Get the album
		fetch(
			"http://highland.oliverrichman.uk/api/albums/" +
			this.state.albumId,
			{
				method: "GET",
			}
		)
		.then(response => response.json())
		.then(response => {
			this.setState({apiData: response});
			// Get artist
			PortalFunctions.GetArtist(this.state.apiData.artist)
				.then(response => response.json())
				.then(response => {
					this.setState({artistData: response})
				});
		});

	}
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const {error, apiData, artistData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {

			let artistBanner = 'http://highland.oliverrichman.uk/api/images/banners/' + artistData.banner_img;
			let artistProfile = 'http://highland.oliverrichman.uk/api/images/artists/' + artistData.profile_img;
			let albumArt = 'http://highland.oliverrichman.uk/api/images/albums/' + apiData.album_art;
			let artistLink = '/artists/' + apiData.artist;

			let songInputs;
			let tracklistArray = [];
			// console.log(apiData);
			if (String(apiData.tracklist).includes('!@!')){
				tracklistArray = apiData.tracklist.split('!@!');
			} else {
				tracklistArray.push(apiData.tracklist);
			}
			let songList = tracklistArray.map((val, i) => {
				let className = `song-input-${i}`;
				return (
					<li>{val}</li>
				);
			});

			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}

					<div class="artist">
						<img src={artistBanner} alt={artistData.name} />
						<p>
							<img src={artistProfile} alt={apiData.name} />
							{this.state.artistData.name}
						</p>
					</div>
					<Link to={artistLink}>Back to Artist Page</Link>
					<ul className="home">
						<li>
							<img src={albumArt} alt={apiData.title} />
						</li>
						<li>
							<h1>{apiData.title}</h1>
							<ul className="songList">
								{songList}
								<li>Released in {apiData.year} &nbsp;&nbsp;&bull;&nbsp;&nbsp; Total tracks: {songList.length}</li>
							</ul>
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
