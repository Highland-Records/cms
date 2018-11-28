import React from "react";
import PortalFunctions from "../PortalFunctions";

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.inputElement = React.createRef();
		this._handleClick = this._handleClick.bind(this);
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

	_handleClick() {
		this.inputElement.current.click();
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
		let currentPreview = userData.profile_img ? PortalFunctions.CoreURLImages() + userData.profile_img : "https://placeimg.com/212/212/animals";
		if (imagePreviewUrl) {
			$imagePreview = imagePreviewUrl
		} else {
			$imagePreview = currentPreview
		}

		return (
			<div>
				<form>
					<input
						name="fileToUpload"
						className="fileInput"
						type="file"
						ref={this.inputElement}
						onChange={e => this._handleImageChange(e)}
					/>
				</form>
				<div className="fileUploadOverlay" onClick={this._handleClick} >
					Edit
				</div>
				<img src={$imagePreview} />
			</div>
		);
	}
}
export default ImageUpload;
