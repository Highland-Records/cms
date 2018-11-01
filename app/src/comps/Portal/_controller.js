import React from 'react';
import { Redirect } from 'react-router-dom';
import './PortalStyle.css';
import PortalHome from './Home';

class PortalController extends React.Component {
	constructor(props) {
    	super(props);
  	}
	//Check Auth Token against Database
	render() {
		// Get the user ID
		const { match } = this.props;
		if(this.props.request === "Home") {
			return <PortalHome token={this.props.token} />;
		} else if(this.props.request === "ChangeState") {
			return <Redirect push to="/" />
		} else {
			alert("404");
		}
	}
}

export default PortalController;
