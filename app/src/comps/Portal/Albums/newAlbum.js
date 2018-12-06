import React from "react";
import {Link} from "react-router-dom";
import "./newAlbumStyle.css";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - New Album Page
class NewAlbum extends React.Component {
	constructor(props) {
		super(props);
		this.albumInputElement = React.createRef();
		this.handleAlbumClick = this.handleAlbumClick.bind(this);
		// this.removeSong = this.removeSong.bind(this);
		this.state = {
			status: null,
			message: "",
			userData: {},
			artists: [],
			album: {
				title: "",
				year: null,
				artist: null,
				tracklistArray: [""],
				tracklist: "",
				albumFile: "",
				albumArtPreviewUrl: ""
			}
		};
	}

	handleChange = event => {
		let album = JSON.parse(JSON.stringify(this.state.album));
		album[event.target.name] = event.target.value;
		this.setState({
			album: album
		});
	};

	handleSongChange = (songNum, event) => {
		let album = JSON.parse(JSON.stringify(this.state.album));
		album.tracklistArray[songNum] = event.target.value;
		this.setState({
			album: album
		});
	};

	albumArtFormData = null;

	addSong = e => {
		e.preventDefault();
		let album = JSON.parse(JSON.stringify(this.state.album));
		album.tracklistArray.push("");
		this.setState({
			album: album
		});
	};

	// On change set the data states
	handleAlbumChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				album: {
					...this.state.album,
					albumFile: file,
					albumArtPreviewUrl: reader.result
				}
			});
		};

		reader.readAsDataURL(file);
		const data = new FormData();
		data.append("album_art", file, file.name);
		this.albumArtFormData = data;
	};

	handleAlbumClick() {
		this.albumInputElement.current.click();
	}

	removeSong = (songNum, event) => {
		// console.log(songNum);
		let albumC = JSON.parse(JSON.stringify(this.state.album));

		albumC.tracklistArray.splice(songNum, 1);
		this.setState({
			album: albumC
		});
	};

	handleSubmit = event => {
		event.preventDefault();

		this.state.album.tracklist = this.state.album.tracklistArray.join(
			","
		);

		const formData = new FormData();
		formData.append("title", this.state.album.title);
		formData.append("year", this.state.album.year);
		formData.append("artist", this.state.album.artist);
		formData.append("tracklist", this.state.album.tracklist);

		fetch("http://highland.oliverrichman.uk/api/albums", {
			method: "POST",
			body: formData,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("AuthToken")
			})
		})
			.then(response => response.json())
			.then(response => {
				console.log(response);
				// if (response.id) {
				// 	console.log("done");
				// 	// DO ALBUM ART UPLOAD
				// 	// if (this.bannerImageFormData != null){
				// 	// 	this.bannerImageFormData.append("id",response.id);
				// 	// 	fetch("http://highland.oliverrichman.uk/api/upload/artist/banner", {
				// 	// 		method: "POST",
				// 	// 		body: this.bannerImageFormData,
				// 	// 		headers: new Headers({
				// 	// 			Authorization: "Bearer " + localStorage.getItem("AuthToken")
				// 	// 		})
				// 	// 	})
				// 	// 		.then(response => response.json())
				// 	// 		.then(response => {
				// 	// 			console.log("API Status: ", response.code);
				// 	// 			console.log("API Message: ", response.message);
				// 	// 		});
				// 	// }
				// 	//
				// 	// if (this.profileImageFormData != null){
				// 	// 	this.profileImageFormData.append("id",response.id);
				// 	// 	fetch("http://highland.oliverrichman.uk/api/upload/artist/profile", {
				// 	// 		method: "POST",
				// 	// 		body: this.profileImageFormData,
				// 	// 		headers: new Headers({
				// 	// 			Authorization: "Bearer " + localStorage.getItem("AuthToken")
				// 	// 		})
				// 	// 	})
				// 	// 		.then(response => response.json())
				// 	// 		.then(response => {
				// 	// 			console.log("API Status: ", response.code);
				// 	// 			console.log("API Message: ", response.message);
				// 	// 		});
				// 	// }
				// 	// this.setState({
				// 	// 	status: true,
				// 	// 	message: "Created this artist"
				// 	// });
				// } else {
				// 	this.setState({
				// 		status: false,
				// 		message: response.message
				// 	});
				// }
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
		PortalFunctions.GetAllArtists()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {
					this.setState({isLoaded: true, artists: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}

	render() {
		const {userData, artists, album} = this.state;

		const Message = ({status, message}) =>
			status ? (
				<p className="wrong-back-text green">{message}</p>
			) : (
				<p className="wrong-back-text">{message}</p>
			);

		let albumArtPreview = null;
		// let albumCurrentPreview = album.album_art? PortalFunctions.CoreURLImages() + '/albums/' + album.album_art : PortalFunctions.CoreURLImages() + '/albums/default_album.jpg';
		// if (album.albumArtPreviewUrl) {
		// 	albumArtPreview = album.albumArtPreviewUrl
		// } else {
		// 	albumArtPreview = albumCurrentPreview
		// }

		const artistsDropdown = artists.map(artist => {
			return <option value={artist.id}>{artist.name}</option>;
		});
		// console.log(this.state.album.tracklist);

		const songInputs = album.tracklistArray.map((val, i) => {
			let className = `song-input-${i}`;
			return (
				<li>
					<input
						className={className}
						name="name"
						type="text"
						placeholder="Song title"
						value={val}
						onChange={e => this.handleSongChange(i, e)}
					/>
					<span onClick={e => this.removeSong(i, e)}>D</span>
				</li>
			);
		});

		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData, "albums")}
				<header>Add a new Album</header>
				<div className="c">
					<ul className="newAlbum">
						<li>
							<div className="albumArt">
								<form>
									<input
										name="album_art"
										className="fileInput"
										type="file"
										accept="image/*"
										ref={this.albumInputElement}
										onChange={e =>
											this.handleAlbumChange(e)
										}
									/>
								</form>
								<div
									className="fileUploadOverlay"
									onClick={this.handleAlbumClick}
								>
									Edit
								</div>
								<img src={albumArtPreview} alt="" />
							</div>
						</li>
						<li>
							<form
								onSubmit={this.handleSubmit}
								encType="multipart/form-data"
								className="visableForm"
							>
								<input
									className="albumTitle-input"
									name="title"
									type="text"
									placeholder="Title"
									autoFocus={true}
									onChange={this.handleChange}
								/>
								<select
									onChange={this.handleChange}
									name="artist"
								>
									{artistsDropdown}
								</select>
								<input
									className="albumYear-input"
									name="year"
									type="text"
									placeholder="Year"
									onChange={this.handleChange}
								/>
								<ul>
									{songInputs}
									<li onClick={this.addSong}>
										Add a song
									</li>
								</ul>
								<br />
								<input
									className="button"
									type="submit"
									value="Add this Album"
								/>
								<Message
									status={this.state.status}
									message={this.state.message}
								/>
							</form>
						</li>
					</ul>
				</div>
			</section>
		);

		// return (
		// 	<section className="PortalStyle">
		// 		{PortalNavigation.DrawNavigation(userData, "albums")}
		// 		<header>Add a new Album</header>
		// 		<div className="c">
		// 			<ul className="newArtist">
		//
		// 				<li>
		// 					<div className="profileName">
		// 						<form>
		// 							<input
		// 								name="profile_img"
		// 								className="fileInput"
		// 								type="file"
		// 								ref={this.profileInputElement}
		// 								onChange={e => this.handleProfileChange(e)}
		// 							/>
		// 						</form>
		// 						<div className="fileUploadOverlay" onClick={this.handleProfileClick} >
		// 							Edit
		// 						</div>
		// 						<img src={profileImagePreview} alt="" />
		// 						<form
		// 							onSubmit={this.handleSubmit}
		// 							encType="multipart/form-data"
		// 							className="visableForm"
		// 						>
		// 							<input
		// 								className="artistFullName-input"
		// 								name="name"
		// 								type="text"
		// 								placeholder="Full Name"
		// 								value={this.state.artist.name}
		// 								autoFocus={true}
		// 								onChange={this.handleChange}
		// 							/>
		// 							<TextareaAutosize
		// 								className="artistDescription-input"
		// 							 	name="description"
		// 							 	placeholder="Describe this Artist"
		// 								value={this.state.artist.description}
		// 							 	onChange={this.handleChange}
		// 							 />
		// 							<br />
		// 							<input
		// 								className="button"
		// 								type="submit"
		// 								value="Add this Artist"
		// 							/>
		// 							<Message status={this.state.status} message={this.state.message}></Message>
		// 						</form>
		// 					</div>
		// 				</li>
		// 			</ul>
		// 		</div>
		// 	</section>
		// );
	}
}

export default NewAlbum;
