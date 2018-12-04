import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

class Videos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			apiData: []
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// Get all videos
		fetch(
			"http://highland.oliverrichman.uk/api/videos/",
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
								<img src={artistImage} alt="" />
								<h2>{artist.name}</h2>
							</Link>
						</div>
					</li>
				);
			});
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<div class="banner other video">
						<p>
							Highland Videos
						</p>
					</div>
					<div className="list">
						<ul>
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

export default Videos;
