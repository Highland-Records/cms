import React from "react";
import {Link} from "react-router-dom";
import './newArtistStyle.css';
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - New Artist Page
class NewArtist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artistsData: {
				FullName: "Full Name"
			}
		};
	}
	componentDidMount() {
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
		const {error, isLoaded, userData, artistsData} = this.state;
		const artistHeaderImage = {
			//backgroundImage: "url(" + {artistsData.HeaderImage} + ")"
		}
		const artistProfileImage = {
			//backgroundImage: "url(" + {artistsData.ProfileImage} + ")"
		}
		return (
			<div className="Portal">
				{PortalNavigation.DrawNavigation(userData)}
				<header>
					Add a new Artist
				</header>
				<div className="c">
					<ul className="artistOutline">
						<li style={artistHeaderImage}>
							<div>
								<i style={artistProfileImage}></i>
								<h1>{artistsData.FullName}</h1>
							</div>
						</li>
						<li>
							Description
						</li>
						<li>
							Albums
						</li>
						<li>
							Videos
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default NewArtist;
