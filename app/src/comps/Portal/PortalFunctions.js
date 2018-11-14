import React from "react";
import {Link} from "react-router-dom";

const PortalFunctions = {
	SignOut() {
		if (localStorage.getItem("AuthToken")) {
			fetch("http://highland.oliverrichman.uk/api/logout", {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken"),
					id: localStorage.getItem("UserID")
				}),
				body: "id=" + localStorage.getItem("UserID")
			})
				.then(response => response.json())
				.then(response => {
					console.log("API Status: ", response.code);
					if (response.code === 200) {
						localStorage.removeItem("UserID");
						localStorage.removeItem("AuthToken");
						window.location.href = "/";
					} else {
						console.log(
							"API Status Failed: ",
							response.message
						);
					}
				});
		}
	},
};

export default PortalFunctions;