import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

class About extends React.Component {
	render() {
		return (
			<div className="App">
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<h1>about</h1>
				</section>
			</div>
		);
	}
}

export default About;
