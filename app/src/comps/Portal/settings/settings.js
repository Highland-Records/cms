import React from "react";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";
import ImageUpload from "./uploadImage";
import ChangePassword from "./changePassword";

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			userData: {},
			formData: {
				password: "",
				passwordConfirm: ""
			}
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
				r => {
					this.setState({isLoaded: true, userData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}

	render() {
		const {error, userData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData, null)}
					<header>Settings</header>
					<div className="c">
						<div className="settingsLeft">
							<h2>Change your Profile Photo</h2>
							<ImageUpload />
						</div>
						<ChangePassword />
					</div>
				</section>
			);
		}
	}
}

export default Settings;
