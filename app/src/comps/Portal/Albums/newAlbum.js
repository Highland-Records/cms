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
		this.addNewRow = React.createRef();
		this.handleAlbumClick = this.handleAlbumClick.bind(this);
		// this.removeSong = this.removeSong.bind(this);
		this.state = {
			focus: false,
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

	handleKeyDown = e => {
	    if (e.key === "Tab") {
	    	e.preventDefault();
			this.addNewRow.current.click();
			this.setState({
				focus: true
			});
	    }
  	}

	removeSong = (songNum, event) => {
		// console.log(songNum);
		let albumC = JSON.parse(JSON.stringify(this.state.album));
		if(albumC.tracklistArray.length !== 1) {
			albumC.tracklistArray.splice(songNum, 1);
			this.setState({
				album: albumC
			});
		}
	};

	handleSubmit = event => {
		event.preventDefault();

		this.state.album.tracklist = this.state.album.tracklistArray.join(
			"!@!"
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
				if (response.id) {
					if (this.albumArtFormData != null){
						this.albumArtFormData.append("id",response.id);
						fetch("http://highland.oliverrichman.uk/api/upload/album", {
							method: "POST",
							body: this.albumArtFormData,
							headers: new Headers({
								Authorization: "Bearer " + localStorage.getItem("AuthToken")
							})
						})
							.then(response => response.json())
							.then(response => {
								console.log(response);
								// console.log("API Status: ", response.code);
								// console.log("API Message: ", response.message);
							});
					}
					this.setState({
						status: true,
						message: "Created this album"
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
		let albumCurrentPreview = album.album_art? PortalFunctions.CoreURLImages() + '/albums/' + album.album_art : PortalFunctions.CoreURLImages() + '/albums/default_album.jpg';
		if (album.albumArtPreviewUrl) {
		 	albumArtPreview = album.albumArtPreviewUrl
		} else {
		 	albumArtPreview = albumCurrentPreview
		}

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
						onKeyDown={this.handleKeyDown}
						autoFocus={this.state.focus}
					/>
					<span onClick={e => this.removeSong(i, e)}>remove</span>
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
									className="albumTitle"
									name="title"
									type="text"
									placeholder="Album Title"
									autoFocus={true}
									onChange={this.handleChange}
								/>
								<select
									onChange={this.handleChange}
									name="artist"
								>
								<option value="0" disabled selected>Pick a Artist</option>
									{artistsDropdown}
								</select>
								<input
									className="albumYear"
									name="year"
									type="text"
									maxLength="4"
									placeholder="Release Year"
									onChange={this.handleChange}
								/>
								<ul>
									{songInputs}
									<li onClick={this.addSong} ref={this.addNewRow}>
										Add a song
									</li>
								</ul>
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
	}
}

export default NewAlbum;
