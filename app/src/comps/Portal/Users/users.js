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

	deleteUser(userId) {
		// PROMPT FOR A MASTER PASSWORD THEN IF IT'S RIGHT - DELETE THE USER!!

		let password = prompt("Please enter the master password", "");
		if (password === "timberlake") {
			fetch(
				"http://highland.oliverrichman.uk/api/users/" +
					userId +
					"/delete",
				{
					method: "POST",
					headers: new Headers({
						Authorization:
							"Bearer " + localStorage.getItem("AuthToken")
					})
				}
			)
				.then(response => response.json())
				.then(response => {
					if (response.code == 200) {
						let userToRemove = this.state.usersData.find(
							u => u.id == userId
						);

						var array = [...this.state.usersData]; // make a separate copy of the array
						var index = array.indexOf(userToRemove);
						if (index !== -1) {
							array.splice(index, 1);
							this.setState({usersData: array});
						}
					}
				});
		}
	}

	render() {
		const {error, isLoaded, userData, usersData} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else {
			const usersHtml = usersData.map(user => {
				let userImage = user.profile_img
					? PortalFunctions.CoreURLImages() + user.profile_img
					: PortalFunctions.CoreURLImages() +
					  "default_profile.jpeg";
				if (userData.id == user.id) {
					this.state.status = true;
				} else {
					this.state.status = false;
				}
				const ThisIsMe = ({status}) =>
					status ? <span> - (this is you)</span> : <a className="deleteUser" onClick={() => this.deleteUser(user.id)}>remove</a>;
				return (
					<li>
						<div>
							<img src={userImage} />
							<h2>{user.first_name} {user.last_name}</h2>
							<p>@{user.username} <ThisIsMe status={this.state.status}></ThisIsMe></p>
						</div>
					</li>
				);
			});
			return (
				<section className="PortalStyle">
					{PortalNavigation.DrawNavigation(userData, "users")}
					<header>
						Users
						<Link to="/users/new">Add a new User</Link>
					</header>
					<ul className="userList">{usersHtml}</ul>
				</section>
			);
		}
	}
}

export default Users;
