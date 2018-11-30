import React from "react";
import {Link} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import './newArtistStyle.css';
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - New Artist Page
class NewArtist extends React.Component {
	constructor(props) {
		super(props);
		this.bannerInputElement = React.createRef();
		this.profileInputElement = React.createRef();
		this.handleBannerClick = this.handleBannerClick.bind(this);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artist: {
				name: "",
				description: "",
				"bannerFile": "",
				"bannerImagePreviewUrl": "",
				"profileFile": "",
				"profileImagePreviewUrl": "",
			}
		};
	}

	bannerImageFormData = {};
	profileImageFormData = {};

	handleChange = event => {
		this.setState({artist: {...this.state.artist, [event.target.name]: event.target.value}})
	}

	componentDidMount() {
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

	handleBannerClick() {
		this.bannerInputElement.current.click();
	}
	handleProfileClick() {
		this.profileInputElement.current.click();
	}

	// On change set the data states
	handleBannerChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				artist: {...this.state.artist, "bannerFile": file, "bannerImagePreviewUrl": reader.result}
			});
		};

		reader.readAsDataURL(file);
		const data = new FormData();
		data.append("banner_img", file, file.name);
		this.bannerImageFormData = data;
	};

	// On change set the data states
	handleProfileChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				artist: {...this.state.artist, "profileFile": file, "profileImagePreviewUrl": reader.result}
			});
		};

		reader.readAsDataURL(file);
		const data = new FormData();
		data.append("profile_img", file, file.name);
		this.profileImageFormData = data;
	};

	handleSubmit = event => {
		event.preventDefault();
		const formData = new FormData(event.target);
		// Post this to API
		fetch("http://highland.oliverrichman.uk/api/artists", {
			method: "POST",
			body: formData,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("AuthToken")
			})
		})
			.then(response => response.json())
			.then(response => {
				if (this.bannerImageFormData){
					this.bannerImageFormData.append("id",response.id);
					fetch("http://highland.oliverrichman.uk/api/upload/artist/banner", {
						method: "POST",
						body: this.bannerImageFormData,
						headers: new Headers({
							Authorization: "Bearer " + localStorage.getItem("AuthToken")
						})
					})
						.then(response => response.json())
						.then(response => {
							// console.log("handle uploading-", this.file);
							console.log("API Status: ", response.code);
							console.log("API Message: ", response.message);
						});
				}

				if (this.profileImageFormData){
					this.profileImageFormData.append("id",response.id);
					fetch("http://highland.oliverrichman.uk/api/upload/artist/profile", {
						method: "POST",
						body: this.profileImageFormData,
						headers: new Headers({
							Authorization: "Bearer " + localStorage.getItem("AuthToken")
						})
					})
						.then(response => response.json())
						.then(response => {
							// console.log("handle uploading-", this.file);
							console.log("API Status: ", response.code);
							console.log("API Message: ", response.message);
						});
				}
				window.location.href = "/";
			// }
			});
	};

	render() {
		const {error, isLoaded, userData, artist} = this.state;
		let bannerImagePreview = null;
		let bannerCurrentPreview = artist.banner_img? PortalFunctions.CoreURLImages() + '/banners/' + artist.banner_img : PortalFunctions.CoreURLImages() + '/banners/' + 'default_banner.jpeg';
		if (artist.bannerImagePreviewUrl) {
			bannerImagePreview = artist.bannerImagePreviewUrl
		} else {
			bannerImagePreview = bannerCurrentPreview
		}

		let profileImagePreview = null;
		let profileCurrentPreview = artist.profile_img? PortalFunctions.CoreURLImages() + '/artists/' + artist.profile_img : PortalFunctions.CoreURLImages() + '/artists/' + 'default_artist_profile.jpeg';
		if (artist.profileImagePreviewUrl) {
			profileImagePreview = artist.profileImagePreviewUrl
		} else {
			profileImagePreview = profileCurrentPreview
		}

		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "home")}
				<header>Add a new Artist</header>
				<div className="c">
					<ul className="newArtist">
						<li>
							<div className="banner">
								<form>
									<input
										name="banner_img"
										className="fileInput"
										type="file"
										ref={this.bannerInputElement}
										onChange={e => this.handleBannerChange(e)}
									/>
								</form>
								<div className="fileUploadOverlay" onClick={this.handleBannerClick} >
									Edit
								</div>
								<img src={bannerImagePreview} />
							</div>
						</li>
						<li>
							<div className="profileName">
								<form>
									<input
										name="profile_img"
										className="fileInput"
										type="file"
										ref={this.profileInputElement}
										onChange={e => this.handleProfileChange(e)}
									/>
								</form>
								<div className="fileUploadOverlay" onClick={this.handleProfileClick} >
									Edit
								</div>
								<img src={profileImagePreview} />
								<form
									onSubmit={this.handleSubmit}
									encType="multipart/form-data"
									className="visableForm"
								>
									<input
										className="artistFullName-input"
										name="name"
										type="text"
										placeholder="Full Name"
										value={this.state.artist.name}
										autoFocus={true}
										onChange={this.handleChange}
									/>
									<TextareaAutosize
										className="artistDescription-input"
									 	name="description"
									 	placeholder="Describe this Artist"
										value={this.state.artist.description}
									 	onChange={this.handleChange}
									 />
									<br />
									<input
										className="button"
										type="submit"
										value="Add this Artist"
									/>
								</form>
							</div>
						</li>
					</ul>
				</div>
			</section>
		);
	}
}

export default NewArtist;
