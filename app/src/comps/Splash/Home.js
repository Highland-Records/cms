import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";
import PortalFunctions from "../Portal/PortalFunctions";

// - Home Splash Page
class SplashHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			apiData: []
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// Get all artists
		fetch(
			"http://highland.oliverrichman.uk/api/artists/",
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
			let featuredArtist = {};
			const apiRender = PortalFunctions.Randomise(apiData).slice(0,4).map(artist => {
				featuredArtist = artist;
				let artistImage = artist.profile_img
					? "http://highland.oliverrichman.uk/api/images/artists/" + artist.profile_img
					: "http://highland.oliverrichman.uk/api/images/" +
					  "default_profile.jpeg";
				return (
					<li>
						<div>
							<Link to={"/artist/"+artist.id}>
								<img src={artistImage} alt={artist.name} />
								<h2>{artist.name}</h2>
							</Link>
						</div>
					</li>
				);
			});
			let featuredArtistImage = "http://highland.oliverrichman.uk/api/images/banners/" + featuredArtist.banner_img;
			let featuredArtistURL = "/artist/" + featuredArtist.id;
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation("home")}
					<div class="banner home">
						feel <b>something</b>
					</div>
					<ul className="home">
						<li>
							Featured Artist
						</li>
						<li className="featured">
							<div>
								<img src={featuredArtistImage} alt={featuredArtist.name} />
								<Link to={featuredArtistURL}>
									<h1>
										{featuredArtist.name}
									</h1>
								</Link>
							</div>
						</li>
					</ul>
					<ul className="home-flip">
						<li>
							<div>
								<iframe
									height="100%"
									width="100%"
									frameBorder="none"
									src="https://www.youtube.com/embed/gl1aHhXnN1k?rel=0&amp;autoplay=1&mute=1&modestbranding=1&showinfo=0"
								/>
							</div>
						</li>
						<li>
							Today's featured Video
						</li>
					</ul>
					<div className="list">
						<h1>
							Our Artists
						</h1>
						<ul className="list">
							{apiRender}
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

export default SplashHome;
