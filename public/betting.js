smallBlindBet = 1;
bigBlindBet   = 2;
playerToTalk  = "";

//happens every round
initBetting = function(players,currentDealer){
	console.log("initing betting", players,currentDealer);
	var updates = {};
	playersInGame = players;
    updates["rooms/"+currentRoom+"/betting/playersInGame"] = players;
	updates["rooms/"+currentRoom+"/betting/pot"] = "0";
	updates["rooms/"+currentRoom+"/betting/playerToTalk"] = players[0];
	updates["rooms/"+currentRoom+"/betting/smallBlind"] = 1;
	updates["rooms/"+currentRoom+"/betting/bigBlind"] = 2;
	updates["rooms/"+currentRoom+"/betting/currentBet"] = 2;
	updates["rooms/"+currentRoom+"/betting/thisRoundsBets"] = {};
	updates["rooms/"+currentRoom+"/betting/thisRoundSumBets"]= {};
	
	firebase.database().ref().update(updates);
	updates = {}; 

	let currentDealerPosInArray = $.inArray(currentDealer, players);
	//console.log("CDPIA ",currentDealerPosInArray, players);
	//dealer 		= getAtIndex(players,0,currentDealerPosInArray);
	smallBlindPlayer 	= getAtIndex(players,1,currentDealerPosInArray);
	bigBlindPlayer	 	= getAtIndex(players,2,currentDealerPosInArray);
	utg					= getAtIndex(players,3,currentDealerPosInArray);
	playerToTalk 		= utg;
	currentBet 			= bigBlindBet;
	pot = smallBlindBet+bigBlindBet;
	
	updates["rooms/"+currentRoom+"/betting/bets"] 				= {};
	updates["rooms/"+currentRoom+"/betting/playersBets/"+smallBlindPlayer] 		= smallBlindBet;
		updates["rooms/"+currentRoom+"/betting/thisRoundSumBets/"+smallBlindPlayer] 		= smallBlindBet;
	updates["rooms/"+currentRoom+"/betting/playersBets/"+bigBlindPlayer] 		= bigBlindBet;
		updates["rooms/"+currentRoom+"/betting/thisRoundSumBets/"+bigBlindPlayer] 		= bigBlindBet;
	updates["rooms/"+currentRoom+"/betting/smallBlindPlayer"] 	= smallBlindPlayer;
	updates["rooms/"+currentRoom+"/betting/bigBlindPlayer"] 	= bigBlindPlayer;
	updates["rooms/"+currentRoom+"/betting/utg"] 				= utg;
	updates["rooms/"+currentRoom+"/betting/playerToTalk"] 		= utg;
	updates["rooms/"+currentRoom+"/betting/pot"] 				= pot;

	firebase.database().ref().update(updates);
	blinds(smallBlindPlayer, bigBlindPlayer);
	//firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(utg);
}

function blinds(smallBlindPlayer, bigBlindPlayer){
	//Collect Small blind to the pot
	
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/").once("value", function(s){
		let balance = s.val();
		let smallBlindBalance 	= balance[smallBlindPlayer];
		firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+smallBlindPlayer).set(smallBlindBalance-smallBlindBet);

		let bigBlindBalance 	= balance[bigBlindPlayer];
		firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+bigBlindPlayer).set(bigBlindBalance-bigBlindBet);
		
		let pot = bigBlindBet+smallBlindBet;
		firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(pot);
	});
}

function setPlayerBalance(pid,balance){
    firebase.database().ref("rooms/"+currentRoom+"/betting/balance/"+pid).set(parseFloat(balance));
    //console.log(balance);
}
function addToPlayersBalance(pid,add){
	let newBalance;
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+pid).once("value", function(s){
		newBalance = parseFloat(s.val())+parseFloat(add);
	});
	setPlayerBalance(pid,newBalance);
}
function subtractFromPlayersBalance(pid,subtract){
	firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+pid).once("value", function(s){
		newBalance = parseFloat(s.val())-subtract;
	});
	setPlayerBalance(pid,newBalance);
}
function moveFromPotToPlayer(pid, amount){
	//Trekk fra pot
	firebase.database().ref('rooms/'+currentRoom+"/betting/pot").once("value", function(s){
		let pot = s.val();	
		var updates = {};
	    updates["rooms/"+currentRoom+"/betting/pot"] = (pot-amount);
	    firebase.database().ref().update(updates);
		//$(".pot").text(0);
		addToPlayersBalance(pid,amount);
	});
	//Add to player
}

function setAllPlayersBalance(balance){
	var updates = {};
	$.each(players,function(k,pid){
		updates["rooms/"+currentRoom+"/betting/balance/"+pid] = parseFloat(balance);
	});
	firebase.database().ref().update(updates);
}

function winner(pids){
	//del currentPot på alle pids i array
	let winnerCount = pids.length;
	if(winnerCount == 0){return;}

	firebase.database().ref('rooms/'+currentRoom+"/betting/pot").once("value", function(s){
		let pot = s.val();
		let potshare = pot/winnerCount;
		console.log("Sharing pot ",pot,winnerCount,potshare);

		$.each(pids, function(k,v){
			addToPlayersBalance(v,potshare);
		});
		

		var updates = {};
	    updates["rooms/"+currentRoom+"/betting/pot"] = 0;
	    updates["rooms/"+currentRoom+"/betting/playersBets"] = 0;
	    updates["rooms/"+currentRoom+"/betting/bets/thisRoundBet"] = {};
	    updates["rooms/"+currentRoom+"/betting/thisRoundSumBets"] = {}; 
	    firebase.database().ref().update(updates);
		$(".pot").text(0);
	});

}

function sumTable(){
	let players = $(".player[data-pid] .balance");
  	let sum = 0;
  	$.each(players, function(k,v){
			let val = parseInt($(v).text());
  		sum += val;
  	});
  	$("#inputSumTable").val(sum+parseInt($(".pot").text()));
}

function getBetting(){
	console.log("enabling betting");
	bettingEnabled = true;
	firebase.database().ref('rooms/'+currentRoom+"/betting/").once("value", function(s){
		let betting = s.val();
		playerToTalk = betting.playerToTalk;
	});
	// firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet").on("value", function(s){
	// 	console.info("currentBet updated");
	// 	currentBet = parseInt(s.val());
	// 	$("span.currentBet").text(currentBet);
	// });

}

function setNextPlayerToTalk(ptt){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();
		//console.log("playertotalk", ptt);
		//console.log("playersInGame", playersInGame)
		if(ptt){
			nextPlayerToTalk = ptt;
		}else{
			//console.log("PlayerToTalk",playerToTalk);
			let index = $.inArray(playerToTalk, playersInGame);
			//console.log("index: "+index);
			//console.log("playersInGame",playersInGame);
			//TODO: Check if this round is finished and enable show flop
			//If last player checks or calls, showFlop()
			nextPlayerToTalk = getAtIndex(playersInGame,1,index);
			//console.log("Found to be new talking player:  "+nextPlayerToTalk);
		}
		playerToTalk = nextPlayerToTalk;
		//console.log("setting player to talk: ", nextPlayerToTalk);
		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(nextPlayerToTalk);
		
		//console.log("Player To Talk",playerToTalk);
	});
}

function setPrevPlayerToTalk(){
	let pttRef = firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	pttRef.once('value', function(s){
		playersInGame = s.val();
		
		let index = $.inArray(playerToTalk, playersInGame);


		playerToTalk = getAtIndex(playersInGame,-1,index);

		firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(playerToTalk);
		//console.log("Player To Talk",playerToTalk);
	});
}


function talkingPlayer(){
	firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").on("value", function(s){
		let talkingPlayer = s.val();


		/*firebase.database().ref('rooms/'+currentRoom+"/betting/balance/"+talkingPlayer).once("value", function(s){
			talkingPlayersBalance = s.val();
		});*/
		if(talkingPlayer == currentPlayer){

			$("#check").show().unbind();
			$("#bet").show().unbind();
			$("#call").show().unbind();

			$("#call").click(function(){
				console.log("currentBet", currentBet);
				//playerBet = det som ligge på bordet foran deg
				//currentBet = høyste bet til nå
				//thisRoundSumBets = summen av dine bets gjennom denne håndå

				//Så må vi sjekke om han har bettet litt allerede kanskje? evt. trekke dette ifra toCall
				firebase.database().ref('rooms/'+currentRoom+"/betting/").once("value", function(s){
					let betting = s.val();
					let playerBets = betting['playersBets'];
					let playerBet = 0;
					let talkingPlayersBalance = betting['balance'][currentPlayer]

					if(playerBets && playerBets[currentPlayer]>0){
						playerBet = playerBets[currentPlayer];
					}

					let thisRoundSumPlayerBet = 0;
					if(betting['thisRoundSumBets'] && betting['thisRoundSumBets'][currentPlayer]){
						thisRoundSumPlayerBet = betting['thisRoundSumBets'][currentPlayer];
					}

					// sumToCall is the actual sum this player can call (in case of all-in situation)
					let sumToCall = currentBet > talkingPlayersBalance ? talkingPlayersBalance : currentBet;

					if (confirm("Call "+sumToCall+"?")) {

						let playerSumBets = betting['thisRoundSumBets'][currentPlayer] ? betting['thisRoundSumBets'][currentPlayer] : 0;

						// deduct is the amount to add to the pot, add to thisRoundSumBets and deduct from balance
						let deduct = currentBet > talkingPlayersBalance ? sumToCall : currentBet-playerBet;

						// currentBetForPlayer is the new bet, depending on all-in or not
						let currentBetForPlayer = currentBet > talkingPlayersBalance ? sumToCall+playerBet : currentBet;

						firebase.database().ref('rooms/'+currentRoom+"/betting/playersBets/"+currentPlayer).set(currentBetForPlayer);

						//update pot
						let pot = betting['pot'];
						firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(pot+(deduct));

						
						firebase.database().ref('rooms/'+currentRoom+"/betting/thisRoundSumBets/"+currentPlayer).set(playerSumBets+deduct);	

						let newbalance = talkingPlayersBalance-deduct;

						setPlayerBalance(talkingPlayer,newbalance);
						setNextPlayerToTalk();
			        }
				});

			});

			$("#check").click(function(){
				firebase.database().ref('rooms/'+currentRoom+"/betting/playersBets/"+currentPlayer).once("value", function(s) {
					// Make sure check is only possible when playerbet matches currentbet

					if (!s.val() || currentBet == s.val()) {
						if (confirm("Check?")) {
							firebase.database().ref('rooms/'+currentRoom+"/betting/playersBets/"+currentPlayer).set(0);
							setNextPlayerToTalk();
						}
					} else {
						alert("Cannot check! Please call or fold");
					}
				});

			});
			$("#bet").click(function(){
				var bet = parseFloat(prompt("Please enter your bet (add)", "10"));
				if(isNaN(bet)){
					return;
				}

				if (bet == null || bet == "") {
				  bet = 0;
				} else {

					firebase.database().ref('rooms/'+currentRoom+"/betting/").once("value", function(s){
						let betting = s.val();
						let playerBets = betting['playersBets'];
						let playerBet = 0;
						let talkingPlayersBalance = betting['balance'][currentPlayer];

						if (bet>talkingPlayersBalance) {
							alert("Bet larger than balance");
						} else {
							//If player not betted yet
							if(playerBets && playerBets[currentPlayer]>0){
								playerBet = playerBets[currentPlayer];
							}

							let thisRoundSumPlayerBet = 0;
							if(betting['thisRoundSumBets'] && betting['thisRoundSumBets'][currentPlayer]){
								thisRoundSumPlayerBet = betting['thisRoundSumBets'][currentPlayer];
							}

							let pot = betting['pot'];

							//bet = inputBoxen
							//playerBet = det som ligge på bordet foran deg
							//currentBet = høyste bet til nå
							//thisRoundSumBets = summen av dine bets gjennom denne håndå
							if(bet>1 && (bet+playerBet >= currentBet) ){
								firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet/").set(bet+playerBet);
								firebase.database().ref('rooms/'+currentRoom+"/betting/playersBets/"+currentPlayer).set(bet+playerBet);
								firebase.database().ref('rooms/'+currentRoom+"/betting/thisRoundSumBets/"+currentPlayer).set(thisRoundSumPlayerBet+bet);
								firebase.database().ref('rooms/'+currentRoom+"/betting/pot").set(parseFloat(pot+bet));
								currentBet = bet+playerBet;
								setPlayerBalance(currentPlayer,talkingPlayersBalance-bet);
								setNextPlayerToTalk();
							} else {
								alert("Invalid bet!", bet, playerBet, currentBet);
							}

						}



					});

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