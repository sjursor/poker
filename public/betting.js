getPlayersAmount = function(){
	var roomsRef = firebase.database().ref('rooms/'+currentRoom+"/wallet");
	roomsRef.on('value', function(snapshot) {
		console.log()
	});
}