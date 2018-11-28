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
						<Route exact path='/new' render={(props) => <PortalController {...props} token={this.state.token} request={"NewArtist"} />} />
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
				    	<Route exact path='/about' render={(props) => <SplashController {...props} token={this.state.token} request={"About"} />} />
				    	<Route exact path='/contact' render={(props) => <SplashController {...props} token={this.state.token} request={"Contact"} />} />
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
