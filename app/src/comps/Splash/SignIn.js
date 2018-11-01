import React from 'react';
import { Link } from 'react-router-dom';

class SignInPage extends React.Component {
	//Set form data state
	constructor(props) {
    	super(props);
    	this.state = {
			status: true,
      		username: "",
      		password: ""
    	};
  	}
	// On change set the data states
	handleChange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}
	// Handle the submit event
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
			console.log("API Status: ",response.code);
			console.log("API Message: ",response.message);
			if(!response.code) {
				localStorage.setItem('UserID', response.id);
				localStorage.setItem('AuthToken', response.token);
				this.setState({token: localStorage.getItem("AuthToken")});
			} else {
				this.setState({
					status: false
				});
			}
		});
	}
	// Render element
  	render() {
		if(this.state.token) {
			window.location.href = "/";
		} else {
			const SignInMessage = ({ status }) => (
		  		status ? '' : <p>Something went wrong, try again...</p>
			);
			const isEnabled = this.state.username.length > 3 && this.state.password.length > 7;
	    	return (
				<div className="SignIn">
				  	<section className="SplashStyle">
				  		<div>
							<form
								onSubmit={this.handleSubmit}
								encType="multipart/form-data"
							>
								<SignInMessage status={this.state.status} />
					        	<input
									name="username"
					          		type="username"
									placeholder="Username"
									value={this.state.username}
									onChange={this.handleChange}
									autoFocus={true}
					        	/>
					        	<input
									name="password"
									type="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
								<input
									type="submit"
									value="Sign In"
									disabled={!isEnabled}
								/>
							<Link to="/">&lt; Go Home</Link>
					      	</form>
				  		</div>
				  	</section>
			  	</div>
	    	);
		}
  	}
}

export default SignInPage;
