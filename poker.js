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

    var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
    playersRef.once('value', function(snapshot){
    	var players = snapshot.val().split(";");
    	$(players).each(function(k,v){
    		firebase.database().ref('players/'+v+"/activeCards").set(newDeck.pop()+";"+newDeck.pop());
    		firebase.database().ref('players/'+v+"/currentRoom").set(currentRoom);
    	});
    });

    var updates = {};
    updates["rooms/"+currentRoom+"/deck"] = newDeck;
    return firebase.database().ref().update(updates);

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