const doc 		= require('deck-o-cards')
const Hand 		= require('pokersolver').Hand;
const {sha256} 	= require('crypto-hash');

// Notes...
// Sjur: 0oGinVvghrYgAHc1GJz1VGpR8XL2
// John: J0GfoIqLhzaxL1SrAeYigI7oXVx1
// Stian: 9qEcvtXYbzMHg5kLU8YOjKFpvLh2

getNewDeck = function(){
	deck = doc.randomizedDeck();
	return deck;
}   

hash = function(h){
	return sha256(h);
}

setNextDealerAndDealHand = function() {
	console.log("setting dealer and dealing new hand",currentRoom);
	jQuery(".thisRoundBet").removeClass("white green red blue black");
	if(parseInt($(".pot").text()) !== 0){
		alert("Admin must first announce winner to settle the pot");
		return false;
	}else{
		var newDeck = getNewDeck();
		var updates = {};
	    updates["rooms/"+currentRoom+"/flop"] = "";
		updates["rooms/"+currentRoom+"/turn"] = "";
		updates["rooms/"+currentRoom+"/river"] = "";
		updates["rooms/"+currentRoom+"/shownCards"] = "";
		updates["rooms/"+currentRoom+"/folded"] = "";
		
		firebase.database().ref().update(updates);
	    
	    let currentDealerRef= firebase.database().ref('rooms/'+currentRoom+"/currentDealer");

		currentDealerRef.once('value', function(snapshot){
			currentDealer = snapshot.val();

			if (currentDealer == 0) {
				console.log("initing currentDealer",'rooms/'+currentRoom+"/players");
				let playersRef 		= firebase.database().ref('rooms/'+currentRoom+"/players");
				playersRef.once('value', function(snapshot){
					var players = snapshot.val();
					currentDealer = players[0];
					
					$(players).each(function(k,v){
						firebase.database().ref('players/'+v+"/"+currentRoom+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
						firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);
					});

					// Reset fold-button state
					$("#fold").attr("disabled", null);

					$(".playercards .descr").hide();
					
					initBetting(players,currentDealer);

					var updates = {};
					updates["rooms/"+currentRoom+"/deck"] = newDeck;
					updates["rooms/"+currentRoom+"/currentDealer"] = currentDealer;
					updates["rooms/"+currentRoom+"/folded"] = [];

					return firebase.database().ref().update(updates);

				});

			} else {
				//console.log("elsing currentDealer");
				var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
				playersRef.once('value', function(snapshot){
					var players = snapshot.val();
					Array.prototype.next = function() {     return this[++this.current]; };

					players = players.filter(function (el) {return el != null; });
					dealerpos = $.inArray(currentDealer, players);
					//console.log(dealerpos)

					playercount = players.length;

					if (typeof players[dealerpos + 1] === "undefined") {
						nextDealer = players[0]
					} else {
						nextDealer = players[dealerpos + 1];
					}

					$(players).each(function(k,v){
						firebase.database().ref('players/'+v+"/"+currentRoom+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
						firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);
					});

					initBetting(players,nextDealer);

					var updates = {};
					updates["rooms/"+currentRoom+"/deck"] = newDeck;
					updates["rooms/"+currentRoom+"/currentDealer"] = nextDealer;
					//updates["rooms/"+currentRoom+"/folded"] = [];
					//updates["rooms/"+currentRoom+"/shownCards"] = [];

					// Reset fold-button state
					$("#fold").attr("disabled", null);
					return firebase.database().ref().update(updates);
				});

				//console.log("HEI")

			}

		});
		return true;
	}
}

showFlop = function() {
	let deckRef			= firebase.database().ref('rooms/'+currentRoom+"/deck");
	let flopRef 		= firebase.database().ref('rooms/'+currentRoom+"/flop");
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var flop = deck.pop()+";"+deck.pop()+";"+deck.pop();
		flopRef.set(flop);
		deckRef.set(deck);
	});

	resetBetsAndSetFirstPlayerToTalk();
}

showTurn = function() {
	let turnRef  = firebase.database().ref('rooms/'+currentRoom+"/turn");
	let deckRef	 = firebase.database().ref('rooms/'+currentRoom+"/deck");

	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var turn = deck.pop();
		turnRef.set(turn);
		deckRef.set(deck);
	});

	resetBetsAndSetFirstPlayerToTalk();
}


showRiver = function() {
	let deckRef	 = firebase.database().ref('rooms/'+currentRoom+"/deck");
	let riverRef		= firebase.database().ref('rooms/'+currentRoom+"/river");

	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var river = deck.pop();
		riverRef.set(river);
		deckRef.set(deck);
	});

	resetBetsAndSetFirstPlayerToTalk();
}

resetBetsAndSetFirstPlayerToTalk = function() {
	let roomRef = firebase.database().ref('rooms/'+currentRoom);
	roomRef.once('value', function(s) {
		let room = s.val();
		let betting = room["betting"];

		if (betting["playersInGame"]) {
			let ptt = null;

			if (betting["playersInGame"][1] && betting["playersInGame"][0] == room["currentDealer"]) {
				// Current dealer is still in game, set second player in array to talk
				ptt = betting["playersInGame"][1];
			} else {
				// Use first available player still in game
				ptt = betting["playersInGame"][0];
			}

			// Set player to talk in database
			firebase.database().ref('rooms/'+currentRoom+"/betting/playerToTalk").set(ptt);

			// Reset players bets and current bet
			firebase.database().ref('rooms/'+currentRoom+"/betting/currentBet/").set(0);
			firebase.database().ref('rooms/'+currentRoom+"/betting/playersBets/").set([]);
		}
	});
}

getTableCards = function(){
	//Table cards 
	let tableCards = [];
  	firebase.database().ref('rooms/'+currentRoom+"/flop").on('value',function(s){
  		if(s.val()){
  			let flop = s.val().split(";");
			tableCards.push(convertCardToSolver(flop[0].split(",")));
			tableCards.push(convertCardToSolver(flop[1].split(",")));
			tableCards.push(convertCardToSolver(flop[2].split(",")));
  		}
  	});
  	firebase.database().ref('rooms/'+currentRoom+"/turn").on('value',function(s){
  		if(s.val()){
  			tableCards.push(convertCardToSolver(s.val()));
  		}
  	});
  	firebase.database().ref('rooms/'+currentRoom+"/river").on('value',function(s){
  		if(s.val()){
  			tableCards.push(convertCardToSolver(s.val()));	
  		}
  	});
  	return tableCards;
}

solvShownCards = function(callback, pid){
	//console.log("solving cards");
	let pRef = firebase.database().ref('rooms/'+currentRoom+'/shownCards');
	pRef.once('value', function(s){
  		let shown = s.val();
  		var tableCards = getTableCards();

  		$.each(shown, function(pid,v){
  			var hand = Hand.solve(tableCards.concat(v.cards));
  			//console.log(pid,hand);
  			firebase.database().ref('rooms/'+currentRoom+'/shownCards/'+pid+'/descr').set(hand.descr);
  		});

  		if(typeof(callback)=="function")callback(hand,playerCards);
  	});
}

currentPlayerHandDescription = function(callback){	
	var tableCards = getTableCards();
  	let pRef = firebase.database().ref('players/'+currentPlayer+"/"+currentRoom+"/activeCards");

  	//Players cards
  	pRef.once('value', function(s){
  		if(s.val()){ 
  			let cards = s.val().split(";");
	  		let playerCards = [];
	  		playerCards.push(convertCardToSolver(cards[0].split(",")));
	  		playerCards.push(convertCardToSolver(cards[1].split(",")));
	  		
	  		var hand = Hand.solve(tableCards.concat(playerCards));
	  		jQuery("#myCardCurrentStatus").text(hand.descr);
	  		if(typeof(callback)=="function")callback(hand,playerCards);
  		}
  	});

  	/*
	var tableCards = getTableCards();
	var hand1 = Hand.solve(tableCards);
	var hand2 = Hand.solve(['3d', 'As', 'Jc', 'Th', '2d', '4s', 'Qd']);
	var hand3 = Hand.solve(['3h', 'Ad', 'Jd', 'Td', '2d', '4d', 'Qd']);
	var winner = Hand.winners([hand1, hand2,hand3]); // hand2
	*/
	//console.log("Winner is "+winner);
	//console.log(hand1.descr);
	//console.log(hand2.name); // Two Pair
	//console.log(hand2.descr); // Two Pair, A's & Q's

}

convertCardToSolver = function(card){
	let type;
	let value;
	//determine type
	switch(card[0]) {
	  	case '♠️':type = 's';break;
	  	case '♦️':type = 'd';break;
	    case '♣️':type = 'c';break;
	    case '❤️':type = 'h';break;
	}
	//determine value
	if(card[2]<10){
		value = card[2];
	}else{
		switch(card[1]){
			case 'Jack':value = 'J';break;
			case 'Queen':value = 'Q';break;
			case 'King':value = 'K';break;
			case 'Ace':value = 'A';break;
			case 'Ten':value = 'T';break;
		}
	}
	return value+type;
}

updateUserCards = function() {
  playerRef = firebase.database().ref('players/'+currentPlayer);
  playerRef.on('value', function(snapshot){
    var userData = snapshot.val();

    if(userData[currentRoom] && userData[currentRoom]['activeCards']){
      var userCards = userData[currentRoom]['activeCards'].split(";");
      console.log(userCards);
      var klass1 = userCards[0].split(",");
      var type = getType(klass1[0]);
      $("#userCard1").removeClass().addClass(getCardClass(klass1));

      var klass2 = userCards[1].split(",");
      var type = getType(klass2[0]);
      $("#userCard2").removeClass().addClass(getCardClass(klass2));//"card "+klass2[1].toLowerCase()+'_'+type);  
    }else{
    	console.log("nope");
    }
    
  });
}