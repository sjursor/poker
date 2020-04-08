let playersInGame;
let dealer;
let smallBlind;
let bigBlind;
let utg;
let playerToTalk;

initBetting = function(players,currentDealer){
	var updates = {};
	playersInGame = players;
    updates["rooms/"+currentRoom+"/betting/playersInGame"] = players;
	updates["rooms/"+currentRoom+"/betting/currentPot"] = "0";
	updates["rooms/"+currentRoom+"/betting/playerToTalk"] = players[0];
	updates["rooms/"+currentRoom+"/betting/currentBet"] = "0";
	//updates["rooms/"+currentRoom+"/betting/smallBlind"] = 1;
	//updates["rooms/"+currentRoom+"/betting/bigBlind"] = 2;
	updates["rooms/"+currentRoom+"/betting/lastBet"] = 0;
	updates["rooms/"+currentRoom+"/betting/currentDealer"] = currentDealer;
	
	firebase.database().ref().update(updates);

	index 		= $.inArray(currentDealer, players);
	dealer 		= getAtIndex(players,1,index);
	smallBlind 	= getAtIndex(players,2,index);
	bigBlind 	= getAtIndex(players,3,index);
	utg			= getAtIndex(players,4,index);
	playerToTalk = utg;
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(utg);
}

function setNextPlayerToTalk(){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();

		let index = $.inArray(playerToTalk, playersInGame);
		let nextPlayerToTalk = getAtIndex(playersInGame,2,index);
		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(nextPlayerToTalk);
		console.log(nextPlayerToTalk);
	});
}

function talkingPlayer(){
	$("#check").show().unbind();
	$("#bet").show().unbind();
	$("#fold").show().unbind();

	$("#check").click(function(){

	});
}


getPlayers = function(){
	var roomsRef = firebase.database().ref('rooms/'+currentRoom+"/betting");
	roomsRef.on('value', function(snapshot) {
		console.log()
	});
}


function getAtIndex(theArray,i,currentIndex) {
    if (i === 0) {
        return theArray[currentIndex];
    } else if (i < 0) {
        return theArray[(currentIndex + theArray.length + i) % theArray.length];
    } else if (i > 0) {
        return theArray[(currentIndex + i) % theArray.length];
    }
}