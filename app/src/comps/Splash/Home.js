import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

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
			const apiRender = apiData.slice(0,4).map(artist => {
				let artistImage = artist.profile_img
					? "http://highland.oliverrichman.uk/api/images/artists/" + artist.profile_img
					: "http://highland.oliverrichman.uk/api/images/" +
					  "default_profile.jpeg";
				return (
					<li>
						<div>
							<Link to={"/artist/"+artist.id}>
								<img src={artistImage} />
								<h2>{artist.name}</h2>
							</Link>
						</div>
					</li>
				);
			});
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<div class="banner home">
						feel <b>something</b>
					</div>
					<ul className="home">
						<li>
							Today's featured Artist
						</li>
						<li>
							<div>
								<h1>
									Artist name
								</h1>
								<ul>
									<h1>Recent releases</h1>
									<li>SONG TITLE</li>
									<li>SONG TITLE</li>
									<li>SONG TITLE</li>
									<li>SONG TITLE</li>
									<li>SONG TITLE</li>
								</ul>
							</div>
						</li>
					</ul>
					<ul className="home-flip">
						<li>
							<div>
								VIDEO HERE
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
