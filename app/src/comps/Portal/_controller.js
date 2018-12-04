import React from 'react';
import { Redirect } from 'react-router-dom';
import './PortalStyle.css';
import PortalHome from './Home';

import NewArtist from './Artists/newArtist';
import Artist from './Artists/ArtistPage/component';
import Album from './Albums/AlbumPage/component';
import NewAlbum from './Albums/newAlbum';
import Albums from './Albums/albums';
import Users from './Users/users';
import NewUsers from './Users/newUser';
import Settings from './settings/settings';

class PortalController extends React.Component {
	//Check Auth Token against Database
	render() {
		// Get the user ID
		const { match } = this.props;
		if(this.props.request === "Home") {
			return <PortalHome token={this.props.token} />;
		} else if(this.props.request === "NewArtist") {
			return <NewArtist token={this.props.token} />;
		} else if(this.props.request === "Artist" && match.params.id) {
			return <Artist token={this.props.token} id={match.params.id} />;
		} else if(this.props.request === "Albums") {
			return <Albums token={this.props.token} />;
		} else if(this.props.request === "NewAlbum") {
			return <NewAlbum token={this.props.token} />;
		} else if(this.props.request === "Album" && match.params.id) {
			return <Album token={this.props.token} id={match.params.id} />;
		} else if(this.props.request === "Users") {
			return <Users token={this.props.token} />;
		} else if(this.props.request === "NewUsers") {
				return <NewUsers token={this.props.token} />;
		} else if(this.props.request === "ChangeState") {
			return <Redirect push to="/" />
		} else if(this.props.request === "Settings") {
			return <Settings token={this.props.token} />;
		} else {
			alert("404");
		}
	}
}

export default PortalController;
