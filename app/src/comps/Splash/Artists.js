import React from "react";
import {Link} from "react-router-dom";
import HomeNavigation from "./Navigation";

class Artists extends React.Component {
	render() {
		return (
			<div className="App">
				<section className="SplashStyle">
					{HomeNavigation.DrawNavigation()}
					<h1>artists</h1>
				</section>
			</div>
		);
	}
}

export default Artists;
