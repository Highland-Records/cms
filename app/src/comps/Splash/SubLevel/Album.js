import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "../Navigation";

class ArtistPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			apiData: [],
			albumId: this.props.id
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// Get all artists
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
	render() {
		const {error, apiData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			let artistBanner = 'http://highland.oliverrichman.uk/api/images/banners/' + apiData.banner_img;
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<div class="artist">
						<img src={artistBanner} alt={apiData.name} />
						<p>
							{apiData.name}
						</p>
					</div>
					<ul className="home">
						<li>
							<img src={apiData.album_art} alt={apiData.title} />
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
