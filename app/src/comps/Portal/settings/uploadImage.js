import React from "react";
import PortalFunctions from "../PortalFunctions";

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			file: "",
			imagePreviewUrl: "",
			userData: {}
		};
	}

	_handleImageChange(e) {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
		};

		reader.readAsDataURL(file);

		const data = new FormData();
		data.append("fileToUpload", file, file.name);
		fetch("http://highland.oliverrichman.uk/api/upload/profile", {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("AuthToken")
			})
		})
			.then(response => response.json())
			.then(response => {
				console.log("handle uploading-", file);
				console.log("API Status: ", response.code);
				console.log("API Message: ", response.message);
			});
	}

	_handleClick(e) {
		e.preventDefault();
		var inputField = this.refs.fileField;
		inputField.click()
	}

	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) {
					console.log("API Status: ",res.status);
					PortalFunctions.SignOut();
					throw new Error(res.status);
				} else {
					return res.json();
				}
			})
			.then(
				r => {this.setState({isLoaded: true,userData: r})},
				e => {this.setState({isLoaded: true,e})}
			);
	}

	render() {
		const {error, isLoaded, userData} = this.state;
		let {imagePreviewUrl} = this.state;
		let $imagePreview = null;
		let currentPreview = PortalFunctions.CoreURLImages() + userData.profile_img;
		if (imagePreviewUrl) {
			$imagePreview = imagePreviewUrl
		} else {
			$imagePreview = currentPreview
		}

		return (
			<div className="settingsLeft">
				<h2>Change your Profile Photo</h2>
				<form>
					<input
						name="fileToUpload"
						className="fileInput"
						type="file"
						ref="fileField"
						onChange={e => this._handleImageChange(e)}
					/>
				</form>
				<img src={$imagePreview} onClick={this._handleClick} />
			</div>
		);
	}
}
export default ImageUpload;
