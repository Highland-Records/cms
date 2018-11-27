import React from "react";

class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: "",
			new_password: "",
			confirm_password: ""
		};
	}

	_handleSubmit(e) {
		e.preventDefault();
		const data = new FormData();
		data.append("fileToUpload", this.state.file, this.state.file.name);
		fetch("http://highland.oliverrichman.uk/api/users/1/changepassword", {
			method: "POST",
			body: data,
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

	render() {
		// let {imagePreviewUrl} = this.state;
		// let $imagePreview = null;
		// if (imagePreviewUrl) {
		// 	$imagePreview = <img src={imagePreviewUrl} />;
		// } else {
		// 	$imagePreview = (
		// 		<div className="previewText">
		// 			Please select an Image for Preview
		// 		</div>
		// 	);
		// }

		return (
			<div className="previewComponent">
				<form onSubmit={e => this._handleSubmit(e)}>
					<input
						name="password"
						className="password-input"
						type="password"
					/>
					<input
						name="new_password"
						className="password-input"
						type="password"
					/>
					<input
						name="confirm_password"
						className="password-input"
						type="password"
					/>
					<button
						className="submitButton"
						type="submit"
						onClick={e => this._handleSubmit(e)}
					>
					Change Password
					</button>
				</form>
			</div>
		);
	}
}
export default ChangePassword;


// <form
// 	onSubmit={this.handleSubmit}
// 	encType="multipart/form-data"
// 	className="settingsRight"
// >
// 	<h2>Change your Password</h2>
// 	<input
// 		className="password-input"
// 		name="password"
// 		type="password"
// 		placeholder="Your current Password"
// 		value={this.state.passwordCurrent}
// 	/>
// 	<br />
// 	<input
// 		className="password-input"
// 		name="new_password"
// 		type="password"
// 		placeholder="Your new Password"
// 		value={this.state.password}
// 	/>
// 	<br />
// 	<input
// 		className="password-input"
// 		name="passwordConfirm"
// 		type="password"
// 		placeholder="Confirm your new Password"
// 		value={this.state.passwordConfirm}
// 	/>
// 	<br />
// 	<input
// 		className="button"
// 		type="submit"
// 		value="Change Password"
// 	/>
// </form>
