import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";
// import ProfileImageUpload from "./profileUploadImage";

// API NEEDS CHANGING //
// IF THE USER GOES TO UPLOAD A IMAGE BUT NO USER EXISTS ASSUME INSERT A NEW ROW THEN ONCE THE REST OF THE FORM IS COMPLETE UPDATE THAT ROW ELSE IF THE USER ALREADY EXISTS THEN UPADTE THE PROFILE PHOTO COLOUMN

// - New Artist Page
class NewUser extends React.Component {
	constructor(props) {
		super(props);
		this.inputElement = React.createRef();
		this._handleClick = this._handleClick.bind(this);
		this.state = {
			error: null,
			isLoaded: false,
			status: null,
			message: "",
			userData: {},
			file: "",
			imagePreviewUrl: "",
			first_name: "",
			last_name: "",
			username: "",
			password: "",
			passwordConfirm: ""
		};
	}

	imageFormData = null;

	// On change set the data states
	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	handleSubmit = event => {
		event.preventDefault();
		if(!this.state.first_name || !this.state.last_name) {
			this.setState({
				status: false,
				message: "A name is blank"
			});
		} else if (this.state.username.length < 3) {
			this.setState({
				status: false,
				message: "Username must be longer"
			});
		} else if (this.state.password.length < 8) {
			this.setState({
				status: false,
				message: "Password must be longer"
			});
		} else if (this.state.password !== this.state.passwordConfirm) {
			this.setState({
				status: false,
				message: "Passwords must match"
			});
		} else {
			const formData = new FormData(event.target);
			// Post this to API
			fetch("http://highland.oliverrichman.uk/api/users", {
				method: "POST",
				body: formData,
				headers: new Headers({
					Authorization: "Bearer " + localStorage.getItem("AuthToken")
				})
			})
				.then(response => response.json())
				.then(response => {
					if (response.id){
					if (this.imageFormData != null) {
						this.imageFormData.append("id",response.id);
						fetch("http://highland.oliverrichman.uk/api/upload/profile", {
							method: "POST",
							body: this.imageFormData,
							headers: new Headers({
								Authorization: "Bearer " + localStorage.getItem("AuthToken")
							})
						})
							.then(response => response.json())
							.then(response => {
								console.log("handle uploading-", this.file);
								console.log("API Status: ", response.code);
								console.log("API Message: ", response.message);
							});
					}
					this.setState({
						status: true,
						message: "User created!"
					});
}
				});
			}
	};


	_handleImageChange(e) {
		e.preventDefault();

		let reader = new FileReader();
		this.file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				file: this.file,
				imagePreviewUrl: reader.result
			});
		};

		reader.readAsDataURL(this.file);

		const data = new FormData();
		data.append("fileToUpload", this.file, this.file.name);
		this.imageFormData = data;
	}

	_handleClick() {
		this.inputElement.current.click();
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

		let {imagePreviewUrl} = this.state;
		let imagePreview = null;
		let currentPreview = PortalFunctions.CoreURLImages() + "default_profile.jpeg";
		if (imagePreviewUrl) {
			imagePreview = imagePreviewUrl
		} else {
			imagePreview = currentPreview
		}

		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "users")}
				<header>Add a new User</header>
				<div className="c">
					<div className="settingsLeft">
						<h2>Upload a Profile Photo</h2>
						<div>
							<form>
								<input
									name="fileToUpload"
									className="fileInput"
									type="file"
									ref={this.inputElement}
									onChange={e => this._handleImageChange(e)}
								/>
							</form>
							<div className="fileUploadOverlay" onClick={this._handleClick} >
								Edit
							</div>
							<img src={imagePreview} />
						</div>
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
							value={this.state.first_name}
							autoFocus={true}
							onChange={this.handleChange}
						/>
						<input
							className="textInput half"
							name="last_name"
							type="text"
							placeholder="Last Name"
							value={this.state.last_name}
							onChange={this.handleChange}
						/>
						<input
							className="textInput"
							name="username"
							type="text"
							placeholder="Username"
							value={this.state.username}
							onChange={this.handleChange}
						/>
						<br />
						<input
							className="textInput half"
							name="password"
							type="password"
							placeholder="Password"
							value={this.state.password}
							onChange={this.handleChange}
						/>
						<input
							className="textInput half"
							name="passwordConfirm"
							type="password"
							placeholder="Confirm Password"
							value={this.state.passwordConfirm}
							onChange={this.handleChange}
						/>
						<br />
						<input
							className="button"
							type="submit"
							value="Add this User"
						/>
						<Message status={this.state.status} message={this.state.message}></Message>
					</form>
				</div>
			</section>
		);
	}
}

export default NewUser;
