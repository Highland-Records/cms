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
			const apiRender = apiData.map(artist => {

				if (artist.video_links){
					if (artist.video_links.includes('!@!')){
						let videos = artist.video_links.split('!@!');
						for (let video of videos){
							let srcURL = PortalFunctions.CoreURLVideos + video;
							return (
								<li>
								<span>{artist.name}</span>
								<video width="100%" height="240" controls>
									<source src={srcURL} type="video/mp4"/>
									Your browser does not support the video tag.
								</video>
								</li>
							)
						}
					} else {

					}
				}
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
