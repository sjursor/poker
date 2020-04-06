listPlayersAroundTable = function(){
	var playersRef = firebase.database().ref('rooms/'+currentRoom+"/players");
	playersRef.on('value', function(snapshot){
		var ex_players = snapshot.val();

		//remove empty player-index
		var players = [];
		$.each(ex_players,function(k,player){
		  players.push(player);
		});

		$.each(players,function(k,v){

		  var playerRef = firebase.database().ref('players/'+v);
		  //console.log(playerRef)
		  playerRef.on('value', function(snapshot) {
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
		$( document ).on( "click", "span.removePlayerFromTable", function() {
		  var table = $(this).data("table");
		  var uid   = $(this).data("uid");
		  removePlayerFromTable(uid,table);
		});
	});	
}

//Create new player
newPlayer = function(uid, email, displayName, photoURL, callback){
let newPlayerKey = firebase.database().ref('players/'+uid);
createNewPlayer(uid, email, displayName, photoURL,callback);
callback(uid);
// newPlayerKey.once("value", function(snapshot){
//   if(snapshot.val() == null){
//     createNewPlayer(uid, email, displayName, photoURL,callback);
//   }else{
//     currentPlayer = uid;
//     callback(uid);
//   }
// });
}

createNewPlayer = function(uid, email, displayName, photoURL,callback){
firebase.database().ref().child('players/'+uid).set({
  name:displayName,
  email:email,
  photo:photoURL,
  stack:0,
  currentRoom:currentRoom
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
