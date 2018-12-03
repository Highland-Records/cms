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
		this.bannerInputElement = React.createRef();
		this.profileInputElement = React.createRef();
		this.handleBannerClick = this.handleBannerClick.bind(this);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.state = {
			error: null,
			isLoaded: false,
			status: null,
			message: "",
			userData: {},
			artistId: this.props.id,
			artistsData: {},
			artist: {
				name: "",
				description: "",
				"bannerFile": "",
				"bannerImagePreviewUrl": "",
				"profileFile": "",
				"profileImagePreviewUrl": "",
			}
		}
	}
	handleChange = event => {
		this.setState({artistsData: {...this.state.artistsData, [event.target.name]: event.target.value}})
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
		fetch("http://highland.oliverrichman.uk/api/artists/"+this.state.artistId+"/edit", {
			method: "POST",
			body: formData,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("AuthToken")
			})
		})
			.then(response => response.json())
			.then(response => {

				//change API so that when an artist's data is edited it returns the artist back, as the new artist does

				if(response.id) {
					if (this.bannerImageFormData != null){
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
								console.log("API Status: ", response.code);
								console.log("API Message: ", response.message);
							});
					}

					if (this.profileImageFormData != null){
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
								console.log("API Status: ", response.code);
								console.log("API Message: ", response.message);
							});
					}

					this.setState({
						status: true,
						message: "Created this artist"
					});
				} else {
					this.setState({
						status: false,
						message: response.message
					});
				}
			});
	};

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
				let bannerImageURL = PortalFunctions.CoreURLImages() + '/banners/' + this.state.artistsData.banner_img;
				this.setState({
					artist: {...this.state.artist, "bannerImagePreviewUrl": bannerImageURL}
				});
				let profileImageURL = PortalFunctions.CoreURLImages() + '/artists/' + this.state.artistsData.profile_img;
				this.setState({
					artist: {...this.state.artist, "profileImagePreviewUrl": profileImageURL}
				});
			} else {
				console.log("Page failed to load API data");
			}
		});
	}
	render() {
		const {userData, artistsData, artist} = this.state;

		let bannerImagePreview = artist.bannerImagePreviewUrl;

		let profileImagePreview = artist.profileImagePreviewUrl;

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
										<Message status={this.state.status} message={this.state.message}></Message>
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
