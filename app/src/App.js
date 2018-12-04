import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SplashController from './comps/Splash/_controller';
import PortalController from './comps/Portal/_controller';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: localStorage.getItem("AuthToken")
		};
	}
	render() {
		if(this.state.token) {
			const NotFound = ({location}) =>  (
				"Page not found (Portal)"
			)
			return (
				<main>
				    <Switch>
						<Route exact path='/api' />
				    	<Route exact path='/' render={(props) => <PortalController {...props} token={this.state.token} request={"Home"} />} />
						<Route exact path='/artist/' render={(props) => <PortalController {...props} token={this.state.token} request={"Home"} />} />
						<Route exact path='/artist/:id' render={(props) => <PortalController {...props} token={this.state.token} request={"Artist"} />} />
						<Route exact path='/artists/new' render={(props) => <PortalController {...props} token={this.state.token} request={"NewArtist"} />} />
						<Route exact path='/album/:id' render={(props) => <PortalController {...props} token={this.state.token} request={"Album"} />} />
						<Route exact path='/albums/' render={(props) => <PortalController {...props} token={this.state.token} request={"Albums"} />} />
						<Route exact path='/albums/new/' render={(props) => <PortalController {...props} token={this.state.token} request={"NewAlbum"} />} />
						<Route exact path='/users' render={(props) => <PortalController {...props} token={this.state.token} request={"Users"} />} />
						<Route exact path='/users/new' render={(props) => <PortalController {...props} token={this.state.token} request={"NewUsers"} />} />
						<Route exact path='/settings' render={(props) => <PortalController {...props} token={this.state.token} request={"Settings"} />} />
						<Route path='/change-state' render={(props) => <PortalController {...props} token={this.state.token} request={"ChangeState"} />} />
						<Route component={NotFound} />
				    </Switch>
				</main>
			)
		} else {
			const NotFound = ({location}) =>  (
				"Page not found (Splash)"
			)
			return(
				<main>
				    <Switch>
						<Route exact path='/api' />
				    	<Route exact path='/' render={(props) => <SplashController {...props} token={this.state.token} request={"Home"} />} />
				    	<Route exact path='/artists' render={(props) => <SplashController {...props} token={this.state.token} request={"Artists"} />} />
						<Route exact path='/artist/:id' render={(props) => <SplashController {...props} token={this.state.token} request={"ArtistPage"} />} />
						<Route exact path='/videos' render={(props) => <SplashController {...props} token={this.state.token} request={"Videos"} />} />
				    	<Route exact path='/about' render={(props) => <SplashController {...props} token={this.state.token} request={"About"} />} />
				    	<Route exact path='/releases' render={(props) => <SplashController {...props} token={this.state.token} request={"Releases"} />} />
				    	<Route path='/sign-in' render={(props) => <SplashController {...props} token={this.state.token} request={"SignIn"} />} />
						<Route path='/change-state' render={(props) => <SplashController {...props} token={this.state.token} request={"ChangeState"} />} />
						<Route component={NotFound} />
				    </Switch>
				</main>
			)
		}
	}
}

export default App;
