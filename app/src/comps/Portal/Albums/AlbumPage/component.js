import React from "react";
import './style.css';
import PortalFunctions from "../../PortalFunctions";
import PortalNavigation from "../../nav/Navigation";

// - New Album Page
class Album extends React.Component {
	constructor(props) {
		super(props);
		this.albumInputElement = React.createRef();
		this.addNewRow = React.createRef();
		this.handleAlbumClick = this.handleAlbumClick.bind(this);
		this.state = {
			focus: false,
			status: null,
			message: "",
			userData: {},
			artists: [],
			albumId: this.props.id,
			album: {},
			tracklistArray: []
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
		let tracklistArray = this.state.tracklistArray;
		tracklistArray[songNum] = event.target.value;
		this.setState({
			tracklistArray: tracklistArray
		});

		let album = JSON.parse(JSON.stringify(this.state.album));
		if (this.state.tracklistArray.length > 1){
			album.tracklist = this.state.tracklistArray.join('!@!');
		} else {
			album.tracklist = this.state.tracklistArray[0];
		}
		this.setState({
			album: album
		});
	};

	albumArtFormData = null;

	addSong = e => {
		e.preventDefault();
		let album = JSON.parse(JSON.stringify(this.state.album));
		this.state.tracklistArray.push("");
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
		let tracklist = this.state.tracklistArray;
		if (tracklist.length !== 1) {
			tracklist.splice(songNum, 1);
			this.setState({
				tracklistArray: tracklist
			});
		}
	};

	handleSubmit = event => {
		event.preventDefault();

		// this.state.album.tracklist = this.state.album.tracklistArray.join(
		// 	"!@!"
		// );

		const formData = new FormData(event.target);
		formData.append("id",this.state.album.id);

		console.log(this.state.album.id);

		fetch("http://highland.oliverrichman.uk/api/albums/"+this.state.album.id, {
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
				// 	if (this.albumArtFormData != null){
				// 		this.albumArtFormData.append("id",response.id);
				// 		fetch("http://highland.oliverrichman.uk/api/upload/album", {
				// 			method: "POST",
				// 			body: this.albumArtFormData,
				// 			headers: new Headers({
				// 				Authorization: "Bearer " + localStorage.getItem("AuthToken")
				// 			})
				// 		})
				// 			.then(response => response.json())
				// 			.then(response => {
				// 				console.log(response);
				// 			});
				// 	}
				// 	this.setState({
				// 		status: true,
				// 		message: "Updated this album"
				// 	});
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
			fetch(
				"http://highland.oliverrichman.uk/api/albums/" +
					this.state.albumId,
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
				if(response.id === this.state.albumId) {
					this.setState({
						album: response
					});
					let albumArtImageURL = PortalFunctions.CoreURLImages() + '/albums/' + this.state.album.album_art;
					this.setState({
						album: {...this.state.album, "albumArtImageURL": albumArtImageURL}
					});

					if (String(this.state.album.tracklist).includes('!@!')){
						let tracklistArr =  this.state.album.tracklist.split('!@!')
						this.setState({
							tracklistArray: tracklistArr
						});
					} else {
						this.setState({
							tracklistArray: [this.state.album.tracklist]
						});
					}
				} else {
					console.log("Page failed to load API data");
				}
			});

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
		let albumCurrentPreview = album.albumArtImageURL? PortalFunctions.CoreURLImages() + '/albums/' + album.album_art : PortalFunctions.CoreURLImages() + '/albums/default_album.jpg';
		if (album.albumArtPreviewUrl) {
			albumArtPreview = album.albumArtImageURL
		} else {
			albumArtPreview = albumCurrentPreview
		}

		const artistsDropdown = artists.map(artist => {
			if(artist.id === album.artist) {
				return <option value={artist.id} selected>{artist.name}</option>;
			} else {
				return <option value={artist.id}>{artist.name}</option>;
			}
		});
		// let tracklistArray = [];
		let songInputs;

		songInputs = this.state.tracklistArray.map((val, i) => {
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
				<header>Edit Album</header>
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
									value={album.title}
								/>
								<select
									onChange={this.handleChange}
									name="artist"
								>
								<option value="0" disabled>Pick a Artist</option>
									{artistsDropdown}
								</select>
								<input
									className="albumYear"
									name="year"
									type="text"
									maxLength="4"
									placeholder="Release Year"
									onChange={this.handleChange}
									value={album.year}
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
									value="Update this Album"
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

export default Album;
