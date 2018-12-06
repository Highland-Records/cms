const PortalFunctions = {
	SignOut() {
		if (localStorage.getItem("AuthToken")) {
			fetch("http://highland.oliverrichman.uk/api/logout", {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			})
				.then(response => response.json())
				.then(response => {
					console.log("API Status: ", response.code);
					console.log("API Status Failed: ",response.message);
					localStorage.removeItem("AuthToken");
					window.location.href = "/";
				});
		} else {
			// Assume user doesn't exist and sign out
			localStorage.removeItem("AuthToken");
			window.location.href = "/";
		}
	},
	CoreURLImages() {
		return "http://highland.oliverrichman.uk/api/images/";
	},
	CoreURLVideos() {
		return "http://highland.oliverrichman.uk/api/videos/";
	},
	GetUserData(){
		return fetch(
			"http://highland.oliverrichman.uk/api/me", {
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
	},
	GetAllArtists(){
		return fetch(
			"http://highland.oliverrichman.uk/api/artists/",
			{
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
	},
	GetArtist(artistId){
		return fetch(
			"http://highland.oliverrichman.uk/api/artists/"+artistId,
			{
				method: "GET"
			}
		)
	},
	GetAllAlbums(){
		return fetch(
			"http://highland.oliverrichman.uk/api/albums/",
			{
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
	},
	GetAllUsers(){
		return fetch(
			"http://highland.oliverrichman.uk/api/users/",
			{
				method: "GET",
				headers: new Headers({
					Authorization:
						"Bearer " + localStorage.getItem("AuthToken")
				})
			}
		)
	},
	Randomise(array) {
		var currentI = array.length, temporaryValue, randomI;

	  	while (0 !== currentI) {

	    	randomI = Math.floor(Math.random() * currentI);
	    	currentI -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentI];
		array[currentI] = array[randomI];
		array[randomI] = temporaryValue;
		}

		  return array;
	}
};

export default PortalFunctions;
