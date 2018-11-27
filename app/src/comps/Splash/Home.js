import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

// - Home Splash Page
class SplashHome extends React.Component {
	render() {
		return (
			<div className="App">
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<div class="banner"></div>
				</section>
			</div>
		);
	}
}

export default SplashHome;
