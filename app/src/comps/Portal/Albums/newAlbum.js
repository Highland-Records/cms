import React from "react";
import {Link} from "react-router-dom";
import './newAlbumStyle.css';
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
			status: null,
			message: "",
			userData: {},
			artists: [],
			album: {
				title: "",
				year: null,
				artist: null,
				tracklist: [
					"",
				],
				"albumFile": "",
				"albumArtPreviewUrl": "",
			}
		};
	}

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSongChange = (songNum, event) => {
		let album = JSON.parse(JSON.stringify(this.state.album));
   		album.tracklist[songNum] = event.target.value;
   		this.setState({
      		album: album
 		});
	};

	albumArtFormData = null;

	addSong = e => {
		e.preventDefault();
		let album = JSON.parse(JSON.stringify(this.state.album));
   		album.tracklist.push("")
   		this.setState({
      		album: album
 		});
	}

	// On change set the data states
	handleAlbumChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				album: {...this.state.album, "albumFile": file, "albumArtPreviewUrl": reader.result}
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
	    }
  	}

	removeSong = (songNum, event) => {
		// console.log(songNum);
		let albumC = JSON.parse(JSON.stringify(this.state.album));

		albumC.tracklist.splice(songNum,1);
		this.setState({
      		album: albumC
 		});
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
		PortalFunctions.GetAllArtists()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {this.setState({isLoaded: true,artists: r})},
				e => {this.setState({isLoaded: true,e})}
			);
	}

	render() {
		const {userData, artists, album} = this.state;

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

		let albumArtPreview = null;
		let albumCurrentPreview = album.album_art? PortalFunctions.CoreURLImages() + '/albums/' + album.album_art : PortalFunctions.CoreURLImages() + '/albums/default_album.jpg';
		if (album.albumArtPreviewUrl) {
		 	albumArtPreview = album.albumArtPreviewUrl
		} else {
		 	albumArtPreview = albumCurrentPreview
		}

		const artistsDropdown = artists.map(artist => {
			return (
		  		<option value={artist.id}>{artist.name}</option>
			);
		});
;
		// console.log(this.state.album.tracklist);

		const songInputs = album.tracklist.map((val,i) => {
			// let songNum = album.tracklist.indexOf(i);
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
					/>
					<span onClick={e => this.removeSong(i, e)}>remove</span>
				</li>
			);
		});

		return(
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
											onChange={e => this.handleAlbumChange(e)}
										/>
									</form>
									<div className="fileUploadOverlay" onClick={this.handleAlbumClick} >
										Edit
									</div>
									<img src={albumArtPreview} alt="" />
								</div>
							</li><li>
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
									<select>
										<option value="0" disabled selected>Pick a Artist</option>
										{artistsDropdown}
									</select>
									<input
										className="albumYear"
										name="year"
										type="text"
										placeholder="Release Year"
										value={this.state.album.year}
										onChange={this.handleChange}
									/>
									<ul>
										{songInputs}
										<li onClick={this.addSong} ref={this.addNewRow}>Add a song</li>
									</ul>
									<input
										className="button"
										type="submit"
										value="Add this Album"
									/>
									<Message status={this.state.status} message={this.state.message}></Message>
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
