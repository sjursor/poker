//List current rooms in firebase
getRooms = function(callback){
	var roomsRef = firebase.database().ref('rooms');
	roomsRef.on('value', function(snapshot) {
	  	$("#roomlist ul li.room").remove();
	  	$.each(snapshot.val(), function(key,roomData){
        console.log(key,roomData);
        let playersCount = roomData['players'].length;
        let isPublic = roomData['isPublic'] ? 'Public' : 'Private';
	    	var li = $("#roomlist ul").prepend('<li class="room" data-rid="'+key+'" data-name="'+roomData['name']+'"  data-players="'+playersCount+'" data-public="'+isPublic+'">'+roomData['name']+'</li>');
		});	
      if(typeof(callback)=="function"){callback();}
	});
}

//Create new rooms
createNewRoom = function(name,callback){
let roomData = {
  name:name,
  players:0,
  currentDealer:0,
  flop:[],
  betting:{'playerToTalk':""},
  turn:"",
  river:""
};
let newRoomKey = firebase.database().ref().child('rooms').push().key;

var updates = {};
updates['/rooms/' + newRoomKey] = roomData;
firebase.database().ref().update(updates);
currentRoom = newRoomKey;
if(typeof(callback)=="function"){callback(newRoomKey);}
return newRoomKey;
}



addPlayerToTable = function(player,table){
var ref = firebase.database().ref('rooms/'+table+'/players');
ref.once("value", function(snapshot){
  var ex_players = snapshot.val();
  var players = [];
  if(ex_players){
    $.each(ex_players,function(k,p){
      if(p){players.push(p);}
    });
  }else{
    //First Player in the room
    //First player in room is playerToTalk
    //Maybe he should also be admin?
    firebase.database().ref('betting/playerToTalk').set(player);
  }
  
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