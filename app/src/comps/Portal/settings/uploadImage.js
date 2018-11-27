import React from "react";

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {file: "", imagePreviewUrl: ""};
	}

	_handleSubmit(e) {
		e.preventDefault();
		const data = new FormData();
		data.append("fileToUpload", this.state.file, this.state.file.name);
		fetch("http://highland.oliverrichman.uk/api/upload/profile", {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("AuthToken")
			})
		})
			.then(response => response.json())
			.then(response => {
				console.log("handle uploading-", this.state.file);
				console.log("API Status: ", response.code);
				console.log("API Message: ", response.message);
			});
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
	}

	render() {
		let {imagePreviewUrl} = this.state;
		let $imagePreview = null;
		if (imagePreviewUrl) {
			$imagePreview = <img src={imagePreviewUrl} />;
		} else {
			$imagePreview = (
				<div className="previewText">
					Please select an Image for Preview
				</div>
			);
		}

		return (
			<div className="previewComponent">
				<form onSubmit={e => this._handleSubmit(e)}>
					<input
						name="fileToUpload"
						className="fileInput"
						type="file"
						onChange={e => this._handleImageChange(e)}
					/>
					<button
						className="submitButton"
						type="submit"
						onClick={e => this._handleSubmit(e)}
					>
						Upload Image
					</button>
				</form>
				<div className="imgPreview">{$imagePreview}</div>
			</div>
		);
	}
}
export default ImageUpload;
