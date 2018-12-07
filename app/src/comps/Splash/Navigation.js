import React from "react";
import {Link} from "react-router-dom";

const HomeNavigation = {
	DrawNavigation(location) {
		if (location === 'artists') {
			this.location = 'artists';
		} else if (location === 'videos') {
			this.location = 'videos';
		} else if (location === 'releases') {
			this.location = 'releases';
		} else if (location === 'about') {
			this.location = 'about';
		} else if(location === 'home') {
			this.location = 'home'
		}
		let navigation = (
			<nav>
				<div>
					<Link className="title" to="/" className={this.location === 'home' ? 's' : ''}>
						<h1>Highland</h1>
					</Link>
					<ul>
						<li>
							<Link to="/artists" className={this.location === 'artists' ? 's' : ''}>Artists</Link>
						</li>
						<li>
							<Link to="/videos" className={this.location === 'videos' ? 's' : ''}>Videos</Link>
						</li>
						<li>
							<Link to="/releases" className={this.location === 'releases' ? 's' : ''}>Releases</Link>
						</li>
						<li>
							<Link to="/about" className={this.location === 'about' ? 's' : ''}>About</Link>
						</li>
					</ul>
					<Link className="adminLink" to="/sign-in">Sign In</Link>
				</div>
			</nav>
		);
		return navigation;
	}
};

export default HomeNavigation;
