smallBlindBet = 1;
bigBlindBet   = 2;
playerToTalk  = "";

//happens every round
initBetting = function(players,currentDealer){
	console.log("initing betting");
	var updates = {};
	playersInGame = players;
    updates["rooms/"+currentRoom+"/betting/playersInGame"] = players;
	updates["rooms/"+currentRoom+"/betting/pot"] = "0";
	updates["rooms/"+currentRoom+"/betting/playerToTalk"] = players[0];
	updates["rooms/"+currentRoom+"/betting/smallBlind"] = 1;
	updates["rooms/"+currentRoom+"/betting/bigBlind"] = 2;
	updates["rooms/"+currentRoom+"/betting/currentBet"] = 2;
	updates["rooms/"+currentRoom+"/betting/currentDealer"] = currentDealer;
	
	firebase.database().ref().update(updates);

	let currentDealerPosInArray = $.inArray(currentDealer, players);
	//console.log("CDPIA ",currentDealerPosInArray, players);
	//dealer 		= getAtIndex(players,0,currentDealerPosInArray);
	smallBlind 	= getAtIndex(players,1,currentDealerPosInArray);
	bigBlind 	= getAtIndex(players,2,currentDealerPosInArray);
	utg			= getAtIndex(players,3,currentDealerPosInArray);
	playerToTalk= utg;
	currentBet 	= bigBlind;
	pot = smallBlindBet+bigBlindBet;
	blinds(smallBlind, bigBlind);
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(utg);
}

function blinds(smallBlindPlayer, bigBlindPlayer){
	//Collect Small blind to the pot
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/").once("value", function(s){
		let balance = s.val();
		let smallBlindBalance 	= balance[smallBlindPlayer];
		firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+smallBlind).set(smallBlindBalance-smallBlindBet);

		let bigBlindBalance 	= balance[bigBlindPlayer];
		firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+bigBlind).set(bigBlindBalance-bigBlindBet);
		
		let pot = bigBlindBet+smallBlindBet;
		firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(pot);
	});
}

function setPlayerBalance(pid,balance){
    firebase.database().ref("rooms/"+currentRoom+"/betting/balance/"+pid).set(parseInt(balance));
    console.log(balance);
}
function addToPlayersBalance(pid,add){
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+pid).once("value", function(s){
		newBalance = parseInt(s.val())+parseInt(add);
	});
	setPlayerBalance(pid,newBalance);
}
function subtractFromPlayersBalance(pid,subtract){
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+pid).once("value", function(s){
		newBalance = parseInt(s.val())-subtract;
	});
	setPlayerBalance(pid,newBalance);
}
function setAllPlayersBalance(balance){
	var updates = {};
	$.each(players,function(k,pid){
		updates["rooms/"+currentRoom+"/betting/balance/"+pid] = balance;
	});
	firebase.database().ref().update(updates);
}

function winner(pids){
	//del currentPot på alle pids i array
	let winnerCount = pids.length;

	firebase.database().ref('rooms/'+currentRoom+"/betting/pot").once("value", function(s){
		let pot = s.val();
		let potshare = pot/winnerCount;

		$.each(pids, function(k,v){
			addToPlayersBalance(v,potshare);
		});
		

		var updates = {};
	    updates["rooms/"+currentRoom+"/betting/pot"] = 0;
	    firebase.database().ref().update(updates);
		$(".pot").text(0);
	});

}

function getBetting(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/").once("value", function(s){
		let betting = s.val();
		playerToTalk = betting.playerToTalk;

		return betting;
	});
}

function setNextPlayerToTalk(ptt){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();
		if(typeof playerToTalk == 'undefined'){
			playerToTalk = ptt;
		}
		let index = $.inArray(playerToTalk, playersInGame);
		console.log("index", index);

		//TODO: Check if this round is finished and enable show flop
		//If last player checks or calls, showFlop()
		nextPlayerToTalk = getAtIndex(players,1,index);
		
		playerToTalk = nextPlayerToTalk;

		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(playerToTalk);
		console.log("Player To Talk",playerToTalk);
	});
}

function setPrevPlayerToTalk(){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();
		if(typeof playerToTalk == 'undefined'){
			playerToTalk = ptt;
		}
		let index = $.inArray(playerToTalk, playersInGame);

		//TODO: Check if this round is finished and enable show flop
		//If last player checks or calls, showFlop()
		playerToTalk = getAtIndex(players,-1,index);

		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(playerToTalk);
		console.log("Player To Talk",playerToTalk);
	});
}


function talkingPlayer(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").on("value", function(s){
		let talkingPlayer = s.val();
		let talkingPlayersBalance = 0;

		firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+talkingPlayer).once("value", function(s){
			talkingPlayersBalance = s.val();
		});
		if(talkingPlayer == currentPlayer){

			$("#check").show().unbind();
			$("#bet").show().unbind();
			$("#call").show().unbind();

			$("#call").click(function(){
				if (confirm("Call "+currentBet+"?")) {
		        	if(currentBet>talkingPlayersBalance){
		        		alert("Insufficient funds");
		        	}else{
						firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+currentPlayer).set(currentBet);
						//update pot
						firebase.database().ref('rooms/'+currentRoom+"/betting/pot").once("value", function(s){
							firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(parseInt(s.val())+currentBet);
						});
						setPlayerBalance(talkingPlayer,talkingPlayersBalance-currentBet);
						setNextPlayerToTalk();
					}
					setNextPlayerToTalk();
		        }
			});

			$("#check").click(function(){
				if (confirm("Check?")) {
		        	firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+currentPlayer).set(0);
					setNextPlayerToTalk();
		        }
			});
			$("#bet").click(function(){
				var bet = parseInt(prompt("Please enter your bet", "10"));

				if (bet == null || bet == "") {
				  bet = 0;
				} else {
					if(bet>talkingPlayersBalance){
						alert("Bet larger than balance");
					}else if(bet>=currentBet){
						if(bet>currentBet){
							firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet/").set(bet);
						}
						firebase.database().ref('rooms/'+currentRoom+"/betting/playerBet/"+currentPlayer).set(bet);
						//update pot
						firebase.database().ref('rooms/'+currentRoom+"/betting/pot").once("value", function(s){
							firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(parseInt(s.val())+bet);
						});
						currentBet = bet;
						setPlayerBalance(talkingPlayer,talkingPlayersBalance-bet);
						setNextPlayerToTalk();
					}else{
						alert("Bet to small, current bet is "+currentBet);
					}
				}
			});
		}else{
			$("#check").hide().unbind();
			$("#bet").hide().unbind();
			$("#call").hide().unbind();
		}
	});
}

function getPot(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/pot").on("value", function(s){
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