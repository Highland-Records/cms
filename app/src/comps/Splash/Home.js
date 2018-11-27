import React from "react";
import {Link} from "react-router-dom";

// - Home Splash Page
class SplashHome extends React.Component {
	render() {
		return (
			<div className="App">
				<section className="SplashStyle">
					<div>
						<Link to="/sign-in">Sign In</Link>
					</div>
				</section>
			</div>
		);
	}
}

export default SplashHome;
