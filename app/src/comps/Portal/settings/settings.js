import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			formData: {
				first_name: "",
				last_name: ""
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
				r => {
					this.setState({isLoaded: true, userData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}
	render() {
		const {error, isLoaded, userData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="Portal">
					{PortalNavigation.DrawNavigation(userData)}
					<header>Settings</header>
					<form
						className="signin-form"
						onSubmit={this.handleSubmit}
						encType="multipart/form-data"
					>
						<input
							className="username-input"
							name="username"
							type="text"
							placeholder="Username"
							value={this.state.username}
							autoFocus={true}
						/>
						<br />
						<input
							className="password-input"
							name="password"
							type="password"
							placeholder="Password"
							value={this.state.password}
						/>
						<br />
						<input
							className="password-input"
							name="password"
							type="password"
							placeholder="Password"
							value={this.state.password}
						/>
						<br />
						<input
							className="submit-btn"
							type="submit"
							value="Sign In"
						/>
					</form>
				</div>
			);
		}
	}
}

export default Settings;
