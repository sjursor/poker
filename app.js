const http = require('http');


const hostname = '127.0.0.1';
const port = 3000;

const Deck = require('deck-o-cards');

var doc = require('deck-o-cards')
var i = doc.randomizedDeck();

function getOneCard(){
	console.log(i.pop());
	console.log("----");
}
function getThreeCards(){
	console.log(i.pop());
	console.log(i.pop());
	console.log(i.pop());
	console.log("----");
}
function runner(){
	setTimeout(function(){
		getThreeCards();
		getOneCard();
		getOneCard();
		
		if(i.length>5){
			runner();	
		}else{
			console.log("EMPTY");
		}
		
	},400);	
}


runner();

/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/