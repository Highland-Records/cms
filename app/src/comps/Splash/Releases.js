import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

class Releases extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		return (
			<div className="App">
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<div class="banner other releases">
						<p>
							Latest Releases
						</p>
					</div>
					<div className="list">
						<ul className="album">
							<li>
								<div>
									<img src="https://via.placeholder.com/200" />
									<h2>Album Name</h2>
								</div>
							</li>
							<li>
								<div>
									<img src="https://via.placeholder.com/200" />
									<h2>Album Name</h2>
								</div>
							</li>
							<li>
								<div>
									<img src="https://via.placeholder.com/200" />
									<h2>Album Name</h2>
								</div>
							</li>
							<li>
								<div>
									<img src="https://via.placeholder.com/200" />
									<h2>Album Name</h2>
								</div>
							</li>
							<li>
								<div>
									<img src="https://via.placeholder.com/200" />
									<h2>Album Name</h2>
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
			</div>
		);
	}
}

export default Releases;
