import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";
import ImageUpload from "../settings/uploadImage";

// API NEEDS CHANGING //
// IF THE USER GOES TO UPLOAD A IMAGE BUT NO USER EXISTS ASSUME INSERT A NEW ROW THEN ONCE THE REST OF THE FORM IS COMPLETE UPDATE THAT ROW ELSE IF THE USER ALREADY EXISTS THEN UPADTE THE PROFILE PHOTO COLOUMN

// - New Artist Page
class NewUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artistFullName: "",
			artistDescription: ""
		};
	}
	// On change set the data states
	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	handleSubmit = event => {
		event.preventDefault();
		const data = new FormData(event.target);
		// Post this to API
		fetch("http://highland.oliverrichman.uk/api/login", {
			method: "POST",
			body: data
		})
			.then(response => response.json())
			.then(response => {
				console.log("API Status: ", response.code);
				console.log("API Message: ", response.message);
				if (!response.code) {
					localStorage.setItem("AuthToken", response.token);
					this.setState({token: localStorage.getItem("AuthToken")});
				} else {
					this.setState({
						status: false
					});
				}
			});
	};
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
		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "users")}
				<header>Add a new User</header>
				<div className="c">
					<div className="settingsLeft">
						<h2>Upload a Profile Photo</h2>
						<ImageUpload />
					</div>
					<form
						onSubmit={this.handleSubmit}
						encType="multipart/form-data"
						className="settingsRight"
					>
						<h2>More about this person</h2>
						<input
							className="textInput half"
							name="first_name"
							type="text"
							placeholder="First Name"
							value={this.state.firstName}
						/>
						<input
							className="textInput half"
							name="last_name"
							type="text"
							placeholder="Last Name"
							value={this.state.lastName}
						/>
						<br />
						<input
							className="textInput"
							name="password"
							type="password"
							placeholder="Password"
							value={this.state.password}
						/>
						<br />
						<input
							className="textInput"
							name="passwordConfirm"
							type="password"
							placeholder="Confirm Password"
							value={this.state.passwordConfirm}
						/>
						<br />
						<input
							className="button"
							type="submit"
							value="Add this User"
						/>
					</form>
				</div>
			</section>
		);
	}
}

export default NewUser;
