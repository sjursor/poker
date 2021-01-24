//List current rooms in firebase
getRooms = function(){
	var roomsRef = firebase.database().ref('rooms');
	roomsRef.on('value', function(snapshot) {
	  	$("#roomlist ul li").remove();
	  	$.each(snapshot.val(), function(key,roomData){
	    	var li = $("#roomlist ul").append('<li data-fid="'+key+'" data-name="'+roomData['name']+'">'+roomData['name']+'</li>');
		});	
	});
}

//Create new rooms
createNewRoom = function(name){
let roomData = {
  name:name,
  players:0,
  currentDealer:0,
  flop:[],
  turn:"",
  river:""
};
let newRoomKey = firebase.database().ref().child('rooms').push().key;

var updates = {};
updates['/rooms/' + newRoomKey] = roomData;
firebase.database().ref().update(updates);
currentRoom = newRoomKey;
return newRoomKey;
}



addPlayerToTable = function(player,table){
var ref = firebase.database().ref('rooms/'+table+'/players');
ref.once("value", function(snapshot){
  var ex_players = snapshot.val();
  var players = [];
  $.each(ex_players,function(k,p){
    if(p){players.push(p);}
  });

  //Add player to playerslist if not already on table
  if($.inArray(player,players)==-1){players.push(player); }

  //setting currentRoom on player obj
  firebase.database().ref('players/'+player+'/currentRoom').set(table);
  //setting players on table
  firebase.database().ref('rooms/'+table+'/players').set(players);

});
}
  
removePlayerFromTable = function(player,table){
var ref = firebase.database().ref('rooms/'+table);
ref.once("value", function(snapshot){
  if(snapshot){

    var data = snapshot.val();
    var players = data['players'];

    console.log(players);
    var newPlayers = [];
    $.each(players,function(k,v){
      console.log(k,v);
      if(v == player){
        return;
      }else{
        newPlayers.push(v);
      }
    });

    var updates = {};
    updates['/rooms/' + table + '/players'] = newPlayers;
    return firebase.database().ref().update(updates);
  }else{
    console.log("No room data available");
  }
});
}