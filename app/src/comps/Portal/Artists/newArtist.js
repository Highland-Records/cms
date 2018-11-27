import React from "react";
import {Link} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import './newArtistStyle.css';
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - New Artist Page
class NewArtist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: {},
			artistFullName: "",
            artistDescription: ""
		};
	}
	// On change set the data states
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
	handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        // Post this to API
        fetch("http://highland.oliverrichman.uk/api/login", {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(response => {
                console.log("API Status: ", response.code);
                console.log("API Message: ", response.message);
                if (!response.code) {
                    localStorage.setItem('AuthToken', response.token);
                    this.setState({token: localStorage.getItem("AuthToken")});
                } else {
                    this.setState({
                        status: false
                    });
                }
            });
    }
	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {this.setState({isLoaded: true,userData: r})},
				e => {this.setState({isLoaded: true,e})}
			);
	}
	render() {
		const {error, isLoaded, userData} = this.state;
		const artistHeaderImage = {
			//backgroundImage: "url(" + {artistsData.HeaderImage} + ")"
		}
		const artistProfileImage = {
			//backgroundImage: "url(" + {artistsData.ProfileImage} + ")"
		}
		return (
			<section className="PortalStyle">
				{PortalNavigation.DrawNavigation(userData)}
				<header>
					Add a new Artist
				</header>
				<div className="c">
					<form
						className="newArtist-form"
						onSubmit={this.handleSubmit}
						encType="multipart/form-data"
					>
						<ul className="artistOutline">
							<li style={artistHeaderImage}>
								<div>
									<i style={artistProfileImage}></i>
									<input className="artistFullName-input"
	                                    name="artistFullName"
	                                    type="text"
	                                    placeholder="Full Name"
	                                    value={this.state.artistFullName}
	                                    onChange={this.handleChange}
	                                    autoFocus={true}
									/>
								</div>
							</li>
							<li>
								<center>
									<TextareaAutosize
										className="artistDescription-input"
										name="artistDescription"
										placeholder="Describe this Artist"
										onChange={this.handleChange}
									/>
								</center>
							</li>
							<li>
								<ul className="artistAlbums">
									Albums
									<li>
										+
									</li>
								</ul>
							</li>
							<li>
								<ul className="artistVideos">
									Videos
									<li>
										+
									</li>
								</ul>
							</li>
						</ul>
					</form>
				</div>
			</section>
		);
	}
}

export default NewArtist;
