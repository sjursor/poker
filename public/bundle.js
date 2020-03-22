(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

const randomizedDeck = () => {

  var deck = [
      ["❤️", "Ace", 11],
      ["❤️", "Two", 2],
      ["❤️", "Three", 3],
      ["❤️", "Four", 4],
      ["❤️", "Five", 5],
      ["❤️", "Six", 6],
      ["❤️", "Seven", 7],
      ["❤️", "Eight", 8],
      ["❤️", "Nine", 9],
      ["❤️", "Ten", 10],
      ["❤️", "Jack", 10],
      ["❤️", "Queen", 10],
      ["❤️", "King", 10],
      ["♠️", "Ace", 11],
      ["♠️", "Two", 2],
      ["♠️", "Three", 3],
      ["♠️", "Four", 4],
      ["♠️", "Five", 5],
      ["♠️", "Six", 6],
      ["♠️", "Seven", 7],
      ["♠️", "Eight", 8],
      ["♠️", "Nine", 9],
      ["♠️", "Ten", 10],
      ["♠️", "Jack", 10],
      ["♠️", "Queen", 10],
      ["♠️", "King", 10],
      ["♦️", "Ace", 11],
      ["♦️", "Two", 2],
      ["♦️", "Three", 3],
      ["♦️", "Four", 4],
      ["♦️", "Five", 5],
      ["♦️", "Six", 6],
      ["♦️", "Seven", 7],
      ["♦️", "Eight", 8],
      ["♦️", "Nine", 9],
      ["♦️", "Ten", 10],
      ["♦️", "Jack", 10],
      ["♦️", "Queen", 10],
      ["♦️", "King", 10],
      ["♣️", "Ace", 11],
      ["♣️", "Two", 2],
      ["♣️", "Three", 3],
      ["♣️", "Four", 4],
      ["♣️", "Five", 5],
      ["♣️", "Six", 6],
      ["♣️", "Seven", 7],
      ["♣️", "Eight", 8],
      ["♣️", "Nine", 9],
      ["♣️", "Ten", 10],
      ["♣️", "Jack", 10],
      ["♣️", "Queen", 10],
      ["♣️", "King", 10],
  ]

  var i = 0
    , j = 0
    , temp = null

  for (i = deck.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
  // console.log(deck)  --uncomment for testing (when using $ node index.js)
  return deck
}

// randomizedDeck()  --uncomment for testing (when using node index.js)

module.exports = {
  randomizedDeck:randomizedDeck
}

},{}],2:[function(require,module,exports){
const doc 		= require('deck-o-cards')

getNewDeck = function(){
	deck = doc.randomizedDeck();
	return deck;
}


setNextDealerAndDealHand = function() {
	var newDeck = getNewDeck();
	console.log("setting dealer and dealing new hand")
	//let roomKey = firebase.database().ref().child('rooms/'+currentRoom);
    
    firebase.database().ref('rooms/'+currentRoom+"/flop").set("");
    firebase.database().ref('rooms/'+currentRoom+"/turn").set("");
    firebase.database().ref('rooms/'+currentRoom+"/river").set("");

    var updates = {};
    updates["rooms/"+currentRoom+"/deck"] = newDeck;
    return firebase.database().ref().update(updates);

}



showFlop = function() {
	console.log("showing flop")
	
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
	console.log("showing turn")
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
	console.log("showing river")
	var deckRef = firebase.database().ref('rooms/'+currentRoom+"/deck");
	var ref  = firebase.database().ref('rooms/'+currentRoom+"/river");
	
	deckRef.once('value', function(snapshot) {
		var deck = snapshot.val();
		var river = deck.pop();
		ref.set(river);
		deckRef.set(deck);
	});

}
},{"deck-o-cards":1}]},{},[2]);
