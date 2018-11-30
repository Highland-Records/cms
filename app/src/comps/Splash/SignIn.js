import React from "react";
import {Link} from "react-router-dom";

class SignInPage extends React.Component {
	//Set form data state
	constructor(props) {
		super(props);
		this.state = {
			status: true,
			message: "",
			token: "",
			username: "",
			password: ""
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
		if(this.state.username.length >= 3 && this.state.password.length > 7) {
			const data = new FormData(event.target);
			// Post this to API
			fetch("http://highland.oliverrichman.uk/api/login", {
				method: "POST",
				body: data
			})
				.then(response => response.json())
				.then(response => {
					if (response.token) {
						localStorage.setItem("AuthToken", response.token);
						this.setState({
							token: localStorage.getItem("AuthToken")
						});
					} else {
						console.log("API Status: ", response.code);
						console.log("API Message: ", response.message);
						this.setState({
							status: false,
							message: response.message
						});
					}
				});
		} else {
			this.setState({
				status: false
			});
		}
	};

	// Render element
	render() {
		if (this.state.token) {
			window.location.href = "/";
		} else {
			const SignInMessage = ({status,message}) =>
				status ? (
					<p className="welcome-back-text">
						Welcome back! Please login to your account
					</p>
				) : (
					<p className="wrong-back-text">
						{message}
					</p>
				);
			return (
				<div className="SignIn">
					<section className="SignInStyle">
						<div className="row">
							<div className="col left-panel-background-colour" />
							<div className="col signin-panel">
								<form
									className="signin-form"
									onSubmit={this.handleSubmit}
									encType="multipart/form-data"
								>
									<h1 className="d-flex signin-panel-title">
										HIGHLAND RECORDS
									</h1>
									<SignInMessage
										status={this.state.status}
										message={this.state.message}
									/>
									<input
										className="username-input"
										name="username"
										type="text"
										placeholder="Username"
										onChange={this.handleChange}
										autoFocus={true}
									/>
									<br />
									<input
										className="password-input"
										name="password"
										type="password"
										placeholder="Password"
										onChange={this.handleChange}
									/>
									<br />
									<input
										className="button"
										type="submit"
										value="Sign In"
									/>
									<br />
									<Link to="/">&lt; Go Home</Link>
								</form>
							</div>
						</div>
					</section>
				</div>
			);
		}
	}
}

export default SignInPage;
