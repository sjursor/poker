initBetting = function(){
	var updates = {};
    updates["rooms/"+currentRoom+"/betting/playersInGame"] = ["0oGinVvghrYgAHc1GJz1VGpR8XL2","9qEcvtXYbzMHg5kLU8YOjKFpvLh2", "J0GfoIqLhzaxL1SrAeYigI7oXVx1"];
	updates["rooms/"+currentRoom+"/betting/currentPot"] = "300";
	updates["rooms/"+currentRoom+"/betting/playerToTalk"] = "0oGinVvghrYgAHc1GJz1VGpR8XL2";
	updates["rooms/"+currentRoom+"/betting/currentBet"] = "20";
	updates["rooms/"+currentRoom+"/betting/smallBlind"] = 1;
	updates["rooms/"+currentRoom+"/betting/bigBlind"] = 2;
	updates["rooms/"+currentRoom+"/betting/lastBet"] = 0;
	updates["rooms/"+currentRoom+"/betting/currentDealer"] = currentDealer;
	
	firebase.database().ref().update(updates);
}


getPlayers = function(){
	var roomsRef = firebase.database().ref('rooms/'+currentRoom+"/betting");
	roomsRef.on('value', function(snapshot) {
		console.log()
	});
}