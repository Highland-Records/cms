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

		// let videos = [];
		//
		// for (let artist of this.state.apiData){
		// 	if (artist.video_links){
		// 		if (artist.video_links.includes('!@!')){
		// 			let videoLinks = artist.video_links.split('!@!');
		// 			for (let link of videoLinks){
		// 				videos.push({artist: artist.name, video: link});
		// 			}
		// 		}
		// 	}
		// }
		//
		// console.log(videos);
	}
	render() {
		const {error, apiData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {

const apiRender = apiData.map(artist => {
	if (artist.video_links){
		if (artist.video_links.includes('!@!')){
			return (artist.video_links.split('!@!').map(videoLink =>{
				let srcURL = PortalFunctions.CoreURLVideos + videoLink;
				return (
					<li>
					{artist.name}
					</li>
				)
			}))
		} else {

			let srcURL = PortalFunctions.CoreURLVideos() + artist.video_links;
			return(
				<li>
				{artist.name}
				<video controls>
					<source src={srcURL} type="video/mp4"/>
					Your browser does not support the video tag.
				</video>
				</li>
			)
		}
	}
});
			return (
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation("videos")}
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
