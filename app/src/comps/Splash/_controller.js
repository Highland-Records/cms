import React from 'react';
import { Redirect } from 'react-router-dom';
import './SplashStyle.css';
import SplashHome from './Home';
import SignInPage from './SignIn';
import Artists from './Artists';
import ArtistPage from './SubLevel/Artist';
import Videos from './Videos';
import About from './About';
import Releases from './Releases';
import AlbumPage from './SubLevel/Album';

class SplashController extends React.Component {
	render() {
		const { match } = this.props;
		if(this.props.request === "Home") {
			return <SplashHome token={this.props.token} />;
		} else if(this.props.request === "SignIn") {
			return <SignInPage token={this.props.token} />;
		} else if(this.props.request === "Artists") {
			return <Artists token={this.props.token} />;
		} else if(this.props.request === "ArtistPage" && match.params.id) {
			return <ArtistPage token={this.props.token} id={match.params.id} />;
		} else if(this.props.request === "Videos") {
				return <Videos token={this.props.token} />;
		} else if(this.props.request === "About") {
			return <About token={this.props.token} />;
		} else if(this.props.request === "Releases") {
			return <Releases token={this.props.token} />;
		} else if(this.props.request === "AlbumPage" && match.params.id) {
			return <AlbumPage token={this.props.token} id={match.params.id} />;
		} else if(this.props.request === "ChangeState") {
			return <Redirect push to="/" />
		}
	}
}

export default SplashController;
