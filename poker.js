const doc 		= require('deck-o-cards')

getNewDeck = function(){
	deck = doc.randomizedDeck();
	return deck;
}