let playersInGame;
//let dealer;
//let smallBlind;
//let bigBlind;
//let utg;
//let playerToTalk;

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

	let currentDealerPosInArray = $.inArray(currentDealer, players);
	//console.log("CDPIA ",currentDealerPosInArray, players);
	//dealer 		= getAtIndex(players,0,currentDealerPosInArray);
	smallBlind 	= getAtIndex(players,1,currentDealerPosInArray);
	bigBlind 	= getAtIndex(players,2,currentDealerPosInArray);
	utg			= getAtIndex(players,3,currentDealerPosInArray);
	playerToTalk = utg;
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(utg);
}

function setNextPlayerToTalk(){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();

		let index = $.inArray(playerToTalk, playersInGame);
		//console.log(index);
		//console.log(playerToTalk, playersInGame);

		let nextPlayerToTalk;
		if(playersInGame.length == index){
			nextPlayerToTalk = playersInGame[0];
		}else{
			nextPlayerToTalk = playersInGame[index+1];
		}


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

function getAtIndex(theArray,i,currentIndex) {
    if (i === 0) {
        return theArray[currentIndex];
    } else if (i < 0) {
        return theArray[(currentIndex + theArray.length + i) % theArray.length];
    } else if (i > 0) {
        return theArray[(currentIndex + i) % theArray.length];
    }
}