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
	playerToTalk= utg;
	currentBet = 2;
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(0);
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+smallBlind).set(1);
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+bigBlind).set(2);
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+bigBlind).set(3);
	firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet/").set(2);
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(utg);
}

function getBetting(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/").once("value", function(s){
		let betting = s.val();
		playerToTalk = betting.playerToTalk;

		return betting;
	});
}

function setNextPlayerToTalk(){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();

		let index = $.inArray(playerToTalk, playersInGame);
		nextPlayerToTalk = getAtIndex(players,1,index);
		
		playerToTalk = nextPlayerToTalk;

		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(nextPlayerToTalk);
		console.log(nextPlayerToTalk);
	});
}

function talkingPlayer(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").on("value", function(s){
		var talkingPlayer = s.val();
		if(talkingPlayer == currentPlayer){
			$("#check").show().unbind();
			$("#bet").show().unbind();

			$("#check").click(function(){
				firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+currentPlayer).set(0);
				setNextPlayerToTalk();
			});
			$("#bet").click(function(){
				var bet = parseInt(prompt("Please enter your bet", "10"));

				if (bet == null || bet == "") {
				  bet = 0;
				} else {
					if(bet>=currentBet){
						if(bet>currentBet){
							firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet/").set(bet);	
						}
						firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+currentPlayer).set(bet);
						setNextPlayerToTalk();
					}else{
						alert("Bet to small, current bet is "+currentBet);
					}
				}
			});
		}else{
			$("#check").hide().unbind();
			$("#bet").hide().unbind();
		}
	});
}

function getPot(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/pot/").on("value", function(s){
		pot = s.val();
		return pot;
	});
}

function endRoundBetting(){
	//Set current bet to 0
	//set player to talk = smallBlind
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