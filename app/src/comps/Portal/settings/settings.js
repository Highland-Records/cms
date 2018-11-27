import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";
import ImageUpload from "./uploadImage";
import ChangePassword from "./changePassword";

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			formData: {
				password: "",
				passwordConfirm: ""
			},
		};
	}
	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {
					this.setState({isLoaded: true, userData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}

	render() {
		const profileUploadPreview = {
			//backgroundImage: "url(" + {this.state.imageURL} + ")"
		}
		const {error, isLoaded, userData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData)}
					<header>Settings</header>
					<div className="c">
						<ImageUpload></ImageUpload>
						<ChangePassword></ChangePassword>
					</div>
				</section>
			);
		}
	}
}

export default Settings;
