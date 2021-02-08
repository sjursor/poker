//List current rooms in firebase
getRooms = function(callback){
	var roomsRef = firebase.database().ref('rooms');
	roomsRef.on('value', function(snapshot) {
	  	$(".room[data-rid]").remove();
	  	$.each(snapshot.val(), function(key,roomData){
        let playersCount = roomData['players'].length || 0;
        let isPublic = roomData['isPublic'] ? 'Public' : 'Private';
	    	var tr = $(".roomsTable").append('<tr class="room" data-rid="'+key+'">\
                                            <td>'+roomData['name']+'</td>\
                                            <td>'+playersCount+'</td>\
                                            <td>'+isPublic+'</td>\
                                            <td><button class="joinRoom" data-rid="'+key+'">Join Room</button>\
                                            <button class="deleteRoom" style="display:none" data-rid="'+key+'">Delete Room</button></td>\
                                          </tr>');
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
    betting:{
        'playersInGame':['0oGinVvghrYgAHc1GJz1VGpR8XL2'],
        'playerToTalk':"",
        'playersInGame':['0oGinVvghrYgAHc1GJz1VGpR8XL2'],
        'balance':[],
        'thisRoundsBets':[0],
        'thisRoundSumBets':[],
        'smallBlind':1,
        'bigBlind':2,
        'currentBet':0,
        "pot":0
      },
    turn:"",
    river:"",
    admins:["0oGinVvghrYgAHc1GJz1VGpR8XL2", "9qEcvtXYbzMHg5kLU8YOjKFpvLh2", "J0GfoIqLhzaxL1SrAeYigI7oXVx1"]
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