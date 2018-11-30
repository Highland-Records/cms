import React from "react";
import PortalFunctions from "../PortalFunctions";

class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: null,
			message: "",
			password: "",
			new_password: "",
			confirm_password: ""
		};
	}

	// On change set the data states
	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	// Handle the submit event
	handleSubmit = event => {
		event.preventDefault();
		let formData = new FormData();
		formData.append("password", this.state.password);
		formData.append("new_password", this.state.new_password);
		PortalFunctions.GetUserData()
			.then(response => response.json())
			.then( response => {
				// console.log(response);
				this.changePassword(response.id, formData);
			});
	};

	changePassword(userId,formData){
		if (
			userId &&
			this.state.password.length > 7 &&
			this.state.new_password.length > 7 &&
			this.state.new_password == this.state.confirm_password
		) {
			fetch("http://highland.oliverrichman.uk/api/users/"+userId+"/changepassword", {
				method: "POST",
				body: formData,
				headers: new Headers({
					Authorization: "Bearer " + localStorage.getItem("AuthToken")
				})
			})
				.then(response => response.json())
				.then(response => {
					console.log("API Status: ", response.code);
					console.log("API Message: ", response.message);
					if(response.code === 200) {
						this.setState({
							status: true,
							message: response.message
						});
						console.log(this.state.status);
					} else {
						this.setState({
							status: false,
							message: response.message
						});
					}
				});
		} else {
			this.setState({
				status: false,
				message: "Check your Password(s)"
			});
		}
	}

	render() {
		const Message = ({status,message}) =>
			status ? (
				<p className="wrong-back-text green">
					{message}
				</p>
			) : (
				<p className="wrong-back-text">
					{message}
				</p>
			);
		return (
			<form
				className="settingsRight"
				onSubmit={e => this.handleSubmit(e)}
			>
				<h2>Change Password</h2>
				<input
					name="password"
					className="textInput"
					type="password"
					placeholder="Current Password"
					onChange={this.handleChange}
				/>
				<input
					name="new_password"
					className="textInput"
					type="password"
					placeholder="New Password"
					onChange={this.handleChange}
				/>
				<input
					name="confirm_password"
					className="textInput"
					type="password"
					placeholder="Confirm Password"
					onChange={this.handleChange}
				/>
				<button className="button" type="submit">
					Change Password
				</button>
				<Message status={this.state.status} message={this.state.message}></Message>
			</form>
		);
	}
}
export default ChangePassword;
