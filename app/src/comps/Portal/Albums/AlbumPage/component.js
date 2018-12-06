import React from "react";
import './style.css';
import PortalFunctions from "../../PortalFunctions";
import PortalNavigation from "../../nav/Navigation";

// - New Album Page
class Album extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			albumsData: []
		};
	}


	componentDidMount() {
		window.scrollTo(0, 0);
		PortalFunctions.GetUserData()
		.then(res => {
			if (!res.ok) throw new Error(res.status);
			else return res.json();
		})
		.then(
			r => {this.setState({isLoaded: true,userData: r})},
			e => {this.setState({isLoaded: true,e})}
		);

	}
	render() {
		const {userData, albumsData, album} = this.state;

		return(
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "albums")}
				<header>Album Overview</header>
					<div className="c">
						<ul className="newAlbum">
							
						</ul>
					</div>
			</section>
		);
	}
}

export default Album;
