const doc 		= require('deck-o-cards')

getNewDeck = function(){
	deck = doc.randomizedDeck();
	return deck;
}


setNextDealerAndDealHand = function() {
	var newDeck = getNewDeck();
	console.log("setting dealer and dealing new hand");
	//let roomKey = firebase.database().ref().child('rooms/'+currentRoom);
    
    firebase.database().ref('rooms/'+currentRoom+"/flop").set("");
    firebase.database().ref('rooms/'+currentRoom+"/turn").set("");
    firebase.database().ref('rooms/'+currentRoom+"/river").set("");
    firebase.database().ref('rooms/'+currentRoom+"/folded").set("");
    firebase.database().ref('rooms/'+currentRoom+"/shownCards").set("");

    currentDealerRef = firebase.database().ref('rooms/'+currentRoom+"/currentDealer");
	currentDealerRef.once('value', function(snapshot){
		currentDealer = snapshot.val();

		if (currentDealer == 0) {

			console.log("currentdealer is 0")
			var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
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

			console.log("HEI")

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
	
	var deckRef = firebase.database().ref('rooms/'+currentRoom+"/deck");
	var flopRef  = firebase.database().ref('rooms/'+currentRoom+"/flop");
	
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var flop = deck.pop()+";"+deck.pop()+";"+deck.pop();
		flopRef.set(flop);
		deckRef.set(deck);
	});

}

showTurn = function() {
	//console.log("showing turn")
	var deckRef = firebase.database().ref('rooms/'+currentRoom+"/deck");
	var ref  = firebase.database().ref('rooms/'+currentRoom+"/turn");
	
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var turn = deck.pop();
		ref.set(turn);
		deckRef.set(deck);
	});
}


showRiver = function() {
	//console.log("showing river")
	var deckRef = firebase.database().ref('rooms/'+currentRoom+"/deck");
	var ref  = firebase.database().ref('rooms/'+currentRoom+"/river");
	
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var river = deck.pop();
		ref.set(river);
		deckRef.set(deck);
	});

}