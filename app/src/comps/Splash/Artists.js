import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

class Artists extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		return (
			<section className="SplashStyle">
				{HomeNavigation.DrawNavigation()}
				<div class="banner other artist">
					<p>
						Our Artists
					</p>
				</div>
				<div className="list">
					<ul>
						<li>
							<div>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</div>
						</li>
						<li>
							<div>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</div>
						</li>
						<li>
							<div>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</div>
						</li>
						<li>
							<div>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</div>
						</li>
						<li>
							<div>
								<img src="https://via.placeholder.com/200" />
								<h2>Artist Name</h2>
							</div>
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
		);
	}
}

export default Artists;
