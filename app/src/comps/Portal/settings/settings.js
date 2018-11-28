import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";
import ImageUpload from "./uploadImage";

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
						<form
							onSubmit={this.handleSubmit}
							encType="multipart/form-data"
							className="settingsRight"
						>
							<h2>Change your Password</h2>
							<input
								className="textInput"
								name="password"
								type="password"
								placeholder="Your current Password"
								value={this.state.passwordCurrent}
							/>
							<br />
							<input
								className="textInput"
								name="password"
								type="password"
								placeholder="Your new Password"
								value={this.state.password}
							/>
							<br />
							<input
								className="textInput"
								name="passwordConfirm"
								type="password"
								placeholder="Confirm your new Password"
								value={this.state.passwordConfirm}
							/>
							<br />
							<input
								className="button"
								type="submit"
								value="Change Password"
							/>
						</form>
					</div>
				</section>
			);
		}
	}
}

export default Settings;
