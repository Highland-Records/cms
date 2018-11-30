import React from "react";
import {Link} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import './style.css';
import PortalFunctions from "../../PortalFunctions";
import PortalNavigation from "../../nav/Navigation";

// - New Artist Page
class Artist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artistId: this.props.id,
			artistsData: {}
		}
	}
	handleChange = event => {
		this.setState({artistsData: {...this.state.artistsData, [event.target.name]: event.target.value}})
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		PortalFunctions.GetUserData()
		.then(res => {
			if (!res.ok) throw new Error(res.status);
			else return res.json();
		})
		.then(
			r => {this.setState({isLoaded: true,userData: r})},
			e => {this.setState({isLoaded: true,e})}
		);
		fetch(
			"http://highland.oliverrichman.uk/api/artists/" +
				this.state.artistId,
			{
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
		.then(response => response.json())
		.then(response => {
			if(response.id === this.state.artistId) {
				this.setState({
					artistsData: response
				});
			} else {
				console.log("Page failed to load API data");
			}
		});
	}
	render() {
		const {userData, artistsData} = this.state;
		let bannerImagePreview = null;
		let bannerCurrentPreview = artistsData.banner_img? PortalFunctions.CoreURLImages() + '/banners/' + artistsData.banner_img : PortalFunctions.CoreURLImages() + 'banners/' + 'default_banner.jpeg';
		if (artistsData.bannerImagePreviewUrl) {
			bannerImagePreview = artistsData.bannerImagePreviewUrl
		} else {
			bannerImagePreview = bannerCurrentPreview
		}

		let profileImagePreview = null;
		let profileCurrentPreview = artistsData.profile_img? PortalFunctions.CoreURLImages() + '/artists/' + artistsData.profile_img : PortalFunctions.CoreURLImages() + 'artists/' + 'default_artist_profile.jpeg';
		if (artistsData.profileImagePreviewUrl) {
			profileImagePreview = artistsData.profileImagePreviewUrl
		} else {
			profileImagePreview = profileCurrentPreview
		}
		return(
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "home")}
				<header>Artist Overview</header>
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
											value={artistsData.name}
											onChange={this.handleChange}
										/>
										<TextareaAutosize
											className="artistDescription-input"
										 	name="description"
										 	placeholder="Describe this Artist"
											value={artistsData.description}
										 	onChange={this.handleChange}
										 />
										<br />
										<input
											className="button"
											type="submit"
											value="Update this Artist"
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

export default Artist;
