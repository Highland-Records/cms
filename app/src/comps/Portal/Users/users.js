import React from "react";
import {Link} from "react-router-dom";
import PortalFunctions from "../PortalFunctions";
import PortalNavigation from "../nav/Navigation";

// - Users list page
class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: false,
			error: null,
			isLoaded: false,
			userData: {},
			usersData: []
		};
	}

	componentDidMount() {
		PortalFunctions.GetUserData()
			.then(res => {
				if (!res.ok) {
					console.log("API Status: ", res.status);
					PortalFunctions.SignOut();
					throw new Error(res.status);
				} else {
					return res.json();
				}
			})
			.then(
				r => {
					this.setState({isLoaded: true, userData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
		PortalFunctions.GetAllUsers()
			.then(res => {
				if (!res.ok) throw new Error(res.status);
				else return res.json();
			})
			.then(
				r => {
					this.setState({isLoaded: true, usersData: r});
				},
				e => {
					this.setState({isLoaded: true, e});
				}
			);
	}
	render() {
		const {error, isLoaded, userData, usersData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div />;
		} else {
			const ThisIsMe = ({status}) => (
                status ? <span> - (this is you)</span> : ""
            );
			const usersHtml = usersData.map(user => {
				let userImage = PortalFunctions.CoreURLImages() + user.profile_img;
				if(userData.id == user.id) {
					this.state.status = true
				} else {
					this.state.status = false
				}
				return (
					<li>
						<img src={userImage} />
						<h2>{user.first_name} {user.last_name}</h2>
						<p>@{user.username} <ThisIsMe status={this.state.status}></ThisIsMe></p>
					</li>
				)
			});
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData, "users")}
					<header>
						Users
						<Link to="/new-artist">Add a new User</Link>
					</header>
					<ul className="userList">{usersHtml}</ul>
				</section>
			);
		}
	}
}

export default Users;
