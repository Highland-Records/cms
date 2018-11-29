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
			// }
			});
	};

	render() {
		const {error, isLoaded, userData, artist} = this.state;
		// let bannerURL = artistsData.banner_img? PortalFunctions.CoreURLImages() + artistsData.banner_img : PortalFunctions.CoreURLImages() + 'default_banner.jpeg';
		// const artistHeaderImage = {
		// 	backgroundImage: "url(" + {bannerURL} + ")"
		// }
		// const artistProfileImage = {
		// 	//backgroundImage: "url(" + {artistsData.ProfileImage} + ")"
		// }

		// let {bannerImagePreviewUrl} = this.state.artist.bannerImagePreviewUrl;
		// let bannerImagePreview = null;
		// let bannerCurrentPreview = PortalFunctions.CoreURLImages() + "banners/default_banner.jpeg";
		// if (bannerImagePreviewUrl) {
		// 	bannerImagePreview = bannerImagePreviewUrl
		// } else {
		// 	bannerImagePreview = bannerCurrentPreview
		// }
		//
		// let {profileImagePreviewUrl} = this.state.artist.profileImagePreviewUrl;
		// let profileImagePreview = null;
		// let profileCurrentPreview = PortalFunctions.CoreURLImages() + "artists/default_artist_profile.jpeg";
		// if (profileImagePreviewUrl) {
		// 	profileImagePreview = profileImagePreviewUrl
		// } else {
		// 	profileImagePreview = profileCurrentPreview
		// }

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
					<div className="settingsLeft">
						<h2>Upload a Banner Photo</h2>
						<div>
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
						<br/>
						<h2>Upload a Artist Photo</h2>
						<div>
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
						</div>
					</div>
					<form
						onSubmit={this.handleSubmit}
						encType="multipart/form-data"
						className="settingsRight"
					>
						<h2>Artist Details</h2>
						<input
							className="textInput"
							name="name"
							type="text"
							placeholder="Full Name"
							value={this.state.artist.name}
							autoFocus={true}
							onChange={this.handleChange}
						/>
						<input
							className="textInput"
							name="description"
							type="text"
							placeholder="Description"
							value={this.state.artist.description}
							onChange={this.handleChange}
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

		// return (
		// 	<section className="PortalStyle">
		// 		{PortalNavigation.DrawNavigation(userData, "home")}
		// 		<header>
		// 			Add a new Artist
		// 		</header>
		// 		<div className="c">
		// 			<form
		// 				className="newArtist-form"
		// 				onSubmit={this.handleSubmit}
		// 				encType="multipart/form-data"
		// 			>
		// 				<ul className="artistOutline">
		// 					<li style={artistHeaderImage}>
		// 						<div>
		// 							<i style={artistProfileImage}></i>
		// 							<input className="artistFullName-input"
	     //                                name="artistFullName"
	     //                                type="text"
	     //                                placeholder="Full Name"
	     //                                value={this.state.artistFullName}
	     //                                onChange={this.handleChange}
	     //                                autoFocus={true}
		// 							/>
		// 						</div>
		// 					</li>
		// 					<li>
		// 						<center>
		// 							<TextareaAutosize
		// 								className="artistDescription-input"
		// 								name="artistDescription"
		// 								placeholder="Describe this Artist"
		// 								onChange={this.handleChange}
		// 							/>
		// 						</center>
		// 					</li>
		// 					<li>
		// 						<ul className="artistAlbums">
		// 							Albums
		// 							<li>
		// 								+
		// 							</li>
		// 						</ul>
		// 					</li>
		// 					<li>
		// 						<ul className="artistVideos">
		// 							Videos
		// 							<li>
		// 								+
		// 							</li>
		// 						</ul>
		// 					</li>
		// 				</ul>
		// 			</form>
		// 		</div>
		// 	</section>
		// );
	}
}

export default NewArtist;
