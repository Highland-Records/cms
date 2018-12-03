import React from "react";
import {Link} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import './newAlbumStyle.css';
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - New Album Page
class NewAlbum extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			status: null,
			message: "",
			userData: {},
		}
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
		const {error, isLoaded, userData, album} = this.state;

		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "albums")}
				<header>Add a new Album</header>
			</section>
		);
	}
}

export default NewAlbum;
