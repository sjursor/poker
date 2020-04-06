const doc 	= require('deck-o-cards')
const Hand 	= require('pokersolver').Hand;

getNewDeck = function(){
	deck = doc.randomizedDeck();
	return deck;
}

setNextDealerAndDealHand = function() {
	var newDeck = getNewDeck();
	console.log("setting dealer and dealing new hand");
	let roomKey = firebase.database().ref().child('rooms/'+currentRoom);
	let flopRef 		= firebase.database().ref('rooms/'+currentRoom+"/flop");
	let turnRef			= firebase.database().ref('rooms/'+currentRoom+"/turn");
	let riverRef		= firebase.database().ref('rooms/'+currentRoom+"/river");
	let foldedRef 		= firebase.database().ref('rooms/'+currentRoom+"/folded");
	let shownCardsRef 	= firebase.database().ref('rooms/'+currentRoom+"/shownCards");
    
    flopRef.set("");
    turnRef.set("");
    riverRef.set("");
    foldedRef.set("");
    shownCardsRef.set("");

    let currentDealerRef= firebase.database().ref('rooms/'+currentRoom+"/currentDealer");
	currentDealerRef.once('value', function(snapshot){
		currentDealer = snapshot.val();

		if (currentDealer == 0) {

			console.log("currentdealer is 0")
			let playersRef 		= firebase.database().ref('rooms/'+currentRoom+"/players");
			playersRef.once('value', function(snapshot){
				var players = snapshot.val();
				currentDealer = players.pop();
				$(players).each(function(k,v){
					firebase.database().ref('players/'+v+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
					firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);


				});

				var updates = {};
				updates["rooms/"+currentRoom+"/deck"] = newDeck;
				updates["rooms/"+currentRoom+"/currentDealer"] = currentDealer;
				updates["rooms/"+currentRoom+"/folded"] = [];
				updates["rooms/"+currentRoom+"/shownCards"] = [];

				// Reset fold-button state
				$("#fold").attr("disabled", null);

				$(".playercards").each(function(e,t) {
					console.log(e)
					console.log(t)
				});

				return firebase.database().ref().update(updates);

			});

		} else {

			var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
			playersRef.once('value', function(snapshot){
				var players = snapshot.val();
				Array.prototype.next = function() {     return this[++this.current]; };

				players = players.filter(function (el) {return el != null; });
				dealerpos = $.inArray(currentDealer, players);

				playercount = players.length;

				if (typeof players[dealerpos + 1] === "undefined") {
					nextDealer = players[0]
				} else {
					nextDealer = players[dealerpos + 1];
				}

				$(players).each(function(k,v){
					firebase.database().ref('players/'+v+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
					firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);
				});

				var updates = {};
				updates["rooms/"+currentRoom+"/deck"] = newDeck;
				updates["rooms/"+currentRoom+"/currentDealer"] = nextDealer;
				updates["rooms/"+currentRoom+"/folded"] = [];
				updates["rooms/"+currentRoom+"/shownCards"] = [];

				// Reset fold-button state
				$("#fold").attr("disabled", null);

				return firebase.database().ref().update(updates);
			});

			//console.log("HEI")

		}

	});
/*
    var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
    playersRef.once('value', function(snapshot){
    	var players = snapshot.val();
    	$(players).each(function(k,v){
    		firebase.database().ref('players/'+v+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
    		firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);
    	});
    });

    var updates = {};
    updates["rooms/"+currentRoom+"/deck"] = newDeck;
    return firebase.database().ref().update(updates);
*/
}

showFlop = function() {
	//console.log("showing flop")
	let deckRef			= firebase.database().ref('rooms/'+currentRoom+"/deck");
	let flopRef 		= firebase.database().ref('rooms/'+currentRoom+"/flop");
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var flop = deck.pop()+";"+deck.pop()+";"+deck.pop();
		flopRef.set(flop);
		deckRef.set(deck);
	});

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

currentPlayerHandDescription = function(){
	
	var tableCards = getTableCards();
  	
  	//Players cards
  	firebase.database().ref('players/'+currentPlayer+"/activeCards").once('value', function(s){
  		let cards = s.val().split(";");
  		let playerCards = [];
  		playerCards.push(convertCardToSolver(cards[0].split(",")));
  		playerCards.push(convertCardToSolver(cards[1].split(",")));
  		
  		var hand = Hand.solve(tableCards.concat(playerCards));
  		jQuery("#myCardCurrentStatus").text(hand.descr);

  		return hand;
  	});
	
	//var hand1 = Hand.solve(tableCards);
	//var hand2 = Hand.solve(['3d', 'As', 'Jc', 'Th', '2d', '4s', 'Qd']);
	//var winner = Hand.winners([hand1, hand2]); // hand2
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