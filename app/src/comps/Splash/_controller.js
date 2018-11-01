import React from 'react';
import { Redirect } from 'react-router-dom';
import './SplashStyle.css';
import SplashHome from './Home';
import SignInPage from './SignIn';

class SplashController extends React.Component {
	render() {
		if(this.props.request === "Home") {
			return <SplashHome token={this.props.token} />;
		} else if(this.props.request === "SignIn") {
			return <SignInPage token={this.props.token} />;
		} else if(this.props.request === "ChangeState") {
			return <Redirect push to="/" />
		}
	}
}

export default SplashController;
