import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";
import PortalFunctions from "../Portal/PortalFunctions";

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
		fetch("http://highland.oliverrichman.uk/api/artists/", {
			method: "GET"
		})
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {
					this.setState({isLoaded: true, apiData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}
	render() {
		const {error, apiData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			const apiRender = apiData.map(artist => {
				if (artist.video_links) {
					let artistProfile = 'http://highland.oliverrichman.uk/api/images/artists/' + artist.profile_img;
					let embedURL = "https://www.youtube.com/embed/";
					if (artist.video_links.includes("!@!")) {
						return artist.video_links
							.split("!@!")
							.map(videoLink => {
								return (
									<li>
										<iframe
											width="80%"
											height="80%"
											src={embedURL + videoLink}
											frameborder="0"
											allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
										/>

										<br/>
										<img src={artistProfile} alt={apiData.name} />
										<span>{artist.name}</span>

									</li>
								);
							});
					} else {
						return (
							<li>
								<iframe
									width="100%"
									height="100%"
									src={embedURL + artist.video_links}
									frameborder="0"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
								/>
								<br/>
								<img src={artistProfile} alt={apiData.name} />
								<span>{artist.name}</span>
							</li>
						);
					}
				}
			});
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation("videos")}
					<div class="banner other video">
						<p>Highland Videos</p>
					</div>
					<div className="video-list">
						<ul>{apiRender}</ul>
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
