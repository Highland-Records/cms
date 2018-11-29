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
				bannerFile: "",
				bannerImagePreviewUrl: "",
				profileFile: "",
				profileImagePreviewUrl: "",
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
	handleBannerChange = event => {
		// this.setState({
		// 	[event.target.name]: event.target.value
		// });
		console.log('banner');
	};

	// On change set the data states
	handleProfileChange = event => {
		// this.setState({
		// 	[event.target.name]: event.target.value
		// });
		console.log('profile');
	};

	render() {
		const {error, isLoaded, userData} = this.state;
		// let bannerURL = artistsData.banner_img? PortalFunctions.CoreURLImages() + artistsData.banner_img : PortalFunctions.CoreURLImages() + 'default_banner.jpeg';
		// const artistHeaderImage = {
		// 	backgroundImage: "url(" + {bannerURL} + ")"
		// }
		// const artistProfileImage = {
		// 	//backgroundImage: "url(" + {artistsData.ProfileImage} + ")"
		// }

		let {bannerImagePreviewUrl} = this.state;
		let bannerImagePreview = null;
		let bannerCurrentPreview = PortalFunctions.CoreURLImages() + "banners/default_banner.jpeg";
		if (bannerImagePreviewUrl) {
			bannerImagePreview = bannerImagePreviewUrl
		} else {
			bannerImagePreview = bannerCurrentPreview
		}

		let {profileImagePreviewUrl} = this.state;
		let profileImagePreview = null;
		let profileCurrentPreview = PortalFunctions.CoreURLImages() + "artists/default_artist_profile.jpeg";
		if (profileImagePreviewUrl) {
			profileImagePreview = profileImagePreviewUrl
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
						/>
						<input
							className="textInput"
							name="description"
							type="text"
							placeholder="Description"
							value={this.state.artist.description}
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
