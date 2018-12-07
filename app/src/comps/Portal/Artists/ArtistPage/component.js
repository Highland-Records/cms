import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import "./style.css";
import PortalFunctions from "../../PortalFunctions";
import PortalNavigation from "../../nav/Navigation";

// - New Artist Page
class Artist extends React.Component {
	constructor(props) {
		super(props);
		this.bannerInputElement = React.createRef();
		this.profileInputElement = React.createRef();
		this.addNewRow = React.createRef();
		this.handleBannerClick = this.handleBannerClick.bind(this);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.state = {
			focus: false,
			error: null,
			isLoaded: false,
			status: null,
			message: "",
			userData: {},
			artistId: this.props.id,
			videoArray: [""],
			artist: {}
		};
	}

	handleChange = event => {
		this.setState({
			artist: {
				...this.state.artist,
				[event.target.name]: event.target.value
			}
		});
	};

	handleBannerClick() {
		this.bannerInputElement.current.click();
	}
	handleProfileClick() {
		this.profileInputElement.current.click();
	}

	handleVideoChange = (videoNum, event) => {
		// let videoArray = this.state.videoArray;
		// videoArray[videoNum] = event.target.value;
		// this.setState({
		// 	videoArray: videoArray
		// });
		// //
		// // let artist = JSON.parse(JSON.stringify(this.state.artist));
		// // if (this.state.videoArray.length > 1) {
		// // 	this.state.artist.video_links = this.state.videoArray.join(
		// // 		"!@!"
		// // 	);
		// // } else {
		// // 	this.state.artist.video_links = this.state.videoArray[0];
		// // }
		// //
		// // // this.setState({
		// // // 	artist: artist
		// // // });
		// // console.log(this.state);

		let videoArray = this.state.videoArray;
		videoArray[videoNum] = event.target.value;
		this.setState({
			videoArray: videoArray
		});

		let artist = JSON.parse(JSON.stringify(this.state.artist));
		if (this.state.videoArray.length > 1) {
			artist.video_links = this.state.videoArray.join("!@!");
		} else {
			artist.video_links = this.state.videoArray[0];
		}
		this.setState({
			artist: artist
		});
	};
	addVideo = e => {
		e.preventDefault();
		let artist = JSON.parse(JSON.stringify(this.state.artist));
		this.state.videoArray.push("");
		this.setState({
			artist: artist
		});
	};
	handleKeyDown = e => {
		if (e.key === "Tab") {
			e.preventDefault();
			this.addNewRow.current.click();
			this.setState({
				focus: true
			});
		}
	};
	removeVideo = (videoNum, event) => {
		// console.log(videoNum);
		let videos = this.state.videoArray;
		if (videos.length !== 1) {
			videos.splice(videoNum, 1);
			this.setState({
				videoArray: videos
			});
		}
	};

	// On change set the data states
	handleBannerChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				artist: {
					...this.state.artist,
					bannerFile: file,
					bannerImagePreviewUrl: reader.result
				}
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
				artist: {
					...this.state.artist,
					profileFile: file,
					profileImagePreviewUrl: reader.result
				}
			});
		};

		reader.readAsDataURL(file);
		const data = new FormData();
		data.append("profile_img", file, file.name);
		this.profileImageFormData = data;
	};

	handleSubmit = event => {
		let videoLinks = "";
		if (this.state.videoArray.length > 1) {
			videoLinks = this.state.videoArray.join("!@!");
		} else {
			videoLinks = this.state.videoArray[0];
		}
		event.preventDefault();
		const formData = new FormData(event.target);
		formData.append("id", this.state.artist.id);
		formData.append("video_links", videoLinks);
		// Post this to API
		fetch(
			"http://highland.oliverrichman.uk/api/artists/" +
				this.state.artist.id +
				"/edit",
			{
				method: "POST",
				body: formData,
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
			.then(response => response.json())
			.then(response => {
				//change API so that when an artist's data is edited it returns the artist back, as the new artist does
				console.log(response);
				if (response.id) {
					let noBanner,
						noProfile = true;

					if (this.bannerImageFormData != null) {
						noBanner = false;
						this.setState({
							status: false,
							message: "Uploading Banner"
						});

						this.bannerImageFormData.append(
							"id",
							response.id
						);
						fetch(
							"http://highland.oliverrichman.uk/api/upload/artist/banner",
							{
								method: "POST",
								body: this.bannerImageFormData,
								headers: new Headers({
									Authorization:
										"Bearer " +
										localStorage.getItem(
											"AuthToken"
										)
								})
							}
						)
							.then(response => response.json())
							.then(response => {
								if (response.code === 200) {
									this.setState({
										status: true,
										message: "Uploaded Banner"
									});
								}
							});
					}

					if (this.profileImageFormData != null) {
						noProfile = false;
						this.setState({
							status: false,
							message: "Uploading Picture"
						});

						this.profileImageFormData.append(
							"id",
							response.id
						);
						fetch(
							"http://highland.oliverrichman.uk/api/upload/artist/profile",
							{
								method: "POST",
								body: this.profileImageFormData,
								headers: new Headers({
									Authorization:
										"Bearer " +
										localStorage.getItem(
											"AuthToken"
										)
								})
							}
						)
							.then(response => response.json())
							.then(response => {
								if (response.code === 200) {
									this.setState({
										status: true,
										message: "Uploaded Picture"
									});
								}
							});
					}

					if (noBanner && noProfile) {
						this.setState({
							status: true,
							message: "Created this artist"
						});
					}
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
				r => {
					this.setState({isLoaded: true, userData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
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
				if (response.id === this.state.artistId) {
					// let videoLinksArray = [];
					// if(videoLinksArray.length !== 0) {
					// 	if (response.video_links.includes("!@!")) {
					// 		videoLinksArray = response.video_links.split(
					// 			"!@!"
					// 		);
					// 	} else {
					// 		videoLinksArray.push(response.video_links);
					// 	}
					// }
					this.setState({
						artist: response
					});
					// console.log(videoLinksArray)

					if (
						String(this.state.artist.video_links).includes("!@!")
					) {
						let videoArr = this.state.artist.video_links.split(
							"!@!"
						);
						this.setState({
							videoArray: videoArr
						});
					} else {
						let videoArr = [];
						videoArr.push(this.state.artist.video_links);
						this.setState({
							videoArray: videoArr
						});
					}

					let bannerImageURL =
						PortalFunctions.CoreURLImages() +
						"banners/" +
						this.state.artist.banner_img;
					this.setState({
						artist: {
							...this.state.artist,
							bannerImagePreviewUrl: bannerImageURL
						}
					});
					let profileImageURL =
						PortalFunctions.CoreURLImages() +
						"artists/" +
						this.state.artist.profile_img;
					this.setState({
						artist: {
							...this.state.artist,
							profileImagePreviewUrl: profileImageURL
						}
					});
				} else {
					console.log("Page failed to load API data");
				}
			});
	}
	render() {
		const {userData, artist} = this.state;

		let bannerImagePreview = artist.bannerImagePreviewUrl;

		let profileImagePreview = artist.profileImagePreviewUrl;

		const Message = ({status, message}) =>
			status ? (
				<p className="wrong-back-text green">{message}</p>
			) : (
				<p className="wrong-back-text">{message}</p>
			);

			console.log(this.state.videoArray);
		const videoInputs = this.state.videoArray.map((val, i) => {
			let className = `video-input-${i}`;
			return (
				<li>
					<input
						className={className}
						name="videoUrl"
						type="text"
						placeholder="YouTube Code"
						value={val}
						onChange={e => this.handleVideoChange(i, e)}
						onKeyDown={this.handleKeyDown}
						autoFocus={this.state.focus}
					/>
					<span onClick={e => this.removeVideo(i, e)}>
						remove
					</span>
				</li>
			);
		});

		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "home")}
				<header>Edit Artist</header>
				<div />
				<div className="c">
					<ul className="newArtist">
						<li>
							<div className="banner">
								<form>
									<input
										name="banner_img"
										className="fileInput"
										type="file"
										accept="image/*"
										ref={this.bannerInputElement}
										onChange={e =>
											this.handleBannerChange(
												e
											)
										}
									/>
								</form>
								<div
									className="fileUploadOverlay"
									onClick={this.handleBannerClick}
								>
									Edit
								</div>
								<img src={bannerImagePreview} alt="" />
							</div>
						</li>
						<li>
							<div className="profileName">
								<form>
									<input
										name="profile_img"
										className="fileInput"
										type="file"
										accept="image/*"
										ref={this.profileInputElement}
										onChange={e =>
											this.handleProfileChange(
												e
											)
										}
									/>
								</form>
								<div
									className="fileUploadOverlay"
									onClick={this.handleProfileClick}
								>
									Edit
								</div>
								<img src={profileImagePreview} alt="" />
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
										value={artist.name}
										onChange={this.handleChange}
									/>
									<TextareaAutosize
										className="artistDescription-input"
										name="description"
										placeholder="Describe this Artist"
										value={artist.description}
										onChange={this.handleChange}
									/>
									<br />
									<ul className="artistVideoLinks">
										<h2>Add Videos to {artist.name}</h2>
										{videoInputs}
										<li
											onClick={this.addVideo}
											ref={this.addNewRow}
										>
											Add a video
										</li>
									</ul>
									<input
										className="button"
										type="submit"
										value="Update this Artist"
									/>
									<Message
										status={this.state.status}
										message={this.state.message}
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

// <ul className="videoList">
// 	<h2>Videos</h2>
// 	{showVideoList}
// 	<li>
// 		<div className="video">
// 			<form>
// 				<input
// 					name="file"
// 					className="fileInput"
// 					type="file"
// 					ref={this.videoInputElement}
// 					onChange={e => this.handleVideoChange(e)}
// 				/>
// 			</form>
// 			<div className="fileUploadOverlay" onClick={this.handleVideoClick} >
// 				+
// 			</div>
// 		</div>
// 	</li>
// </ul>

export default Artist;
