listPlayersAroundTable = function(callback){
	var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
	playersRef.on('value', function(snapshot){
		var ex_players = snapshot.val();

		//remove empty player-index
		players = [];
		$.each(ex_players,function(k,player){
		  players.push(player);
		});

		currentPlayerIndex = players.indexOf(currentPlayer);

		// currentPlayer needs to sit first on each client
		// First make new array starting with currentPlayer
		var playersorganized = [];
		for (var i = currentPlayerIndex; i < players.length; i++) {
			playersorganized.push(players[i]);
		}

		// Then finish the array with the rest of the players, unless currentPlayer was already first in the database
		if (currentPlayerIndex > 0) {
			for (var i = 0; i < currentPlayerIndex; i++) {
				playersorganized.push(players[i]);
			}
		}

		players = playersorganized;

		$.each(players,function(k,v){

		  var playerRef = firebase.database().ref('players/'+v);
		  //console.log(playerRef)
		  playerRef.on('value', function(snapshot) {
		  	console.log("playerUpdate");
		    var val = snapshot.val();
		    var playerkey = snapshot.key;

		    var playerPos = $.inArray(playerkey,players)+1;

		    if(val !== null) {
		      // Add player pid as a data attribute
		      $("#player" + playerPos).attr("data-pid", playerkey);
		      if (val.photo) {
		        photoURLs[playerkey] = val.photo + "?width=135";
		        $("#player" + playerPos + " .playercards").css("background-image", "url("+photoURLs[playerkey]+")");
		        $("#player" + playerPos + " .playercards").css("background-size", "contain");
		      }

		      // Write the player name
		      $("#player" + playerPos + " .name").html(val["name"]);
		    }
		  });
		});
		
		if(typeof(callback)=="function"){callback();}
	});	
}

//Create new player
newPlayer = function(uid, email, displayName, photoURL, callback){
	let newPlayerKey = firebase.database().ref('players/'+uid);
	createNewPlayer(uid, email, displayName, photoURL,callback);
	callback(uid);
}

createNewPlayer = function(uid, email, displayName, photoURL,callback){
firebase.database().ref().child('players/'+uid).set({
  name:displayName,
  email:email,
  photo:photoURL
  //currentRoom:currentRoom
},function(error) {
  if (error) {
    console.log("The write failed...");
  } else {
    // Data saved successfully!
    currentPlayer = uid;
    //callback(uid);
  }
});
}
