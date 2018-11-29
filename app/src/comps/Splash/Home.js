import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

// - Home Splash Page
class SplashHome extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="App">
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
					<div className="list">
						<h1>
							Our Artists
						</h1>
						<ul className="list">
							<li>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</li>
							<li>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</li>
							<li>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</li>
							<li>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</li>
						</ul>
					</div>
					<footer>
						<div className="c">
							<i>Highland</i>
							<p>&copy; 2018 Highland Records</p>
						</div>
					</footer>
				</section>
			</div>
		);
	}
}

export default SplashHome;
