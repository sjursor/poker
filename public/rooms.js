//List current rooms in firebase
getRooms = function(callback){
	var roomsRef = firebase.database().ref('rooms');
	roomsRef.on('value', function(snapshot) {
	  	$(".room[data-rid]").remove();
	  	$.each(snapshot.val(), function(key,roomData){
        let playersInRoom = roomData['players'].length || 0;
        let isPublic = roomData['isPublic'];
        let publicity = isPublic==true?'Public':'Private';
	    	var tr = $(".roomsTable").append('<tr class="room" data-rid="'+key+'" data-public="'+isPublic+'" data-playersInRoom="'+playersInRoom+'">\
                                            <td>'+roomData['name']+'</td>\
                                            <td>'+playersInRoom+'/10</td>\
                                            <td>'+publicity+'</td>\
                                            <td><button class="joinRoom" data-rid="'+key+'">Join Room</button>\
                                            <button class="delete" data-rid="'+key+'">Delete</button></td>\
                                          </tr>');
		});	
      if(typeof(callback)=="function"){callback();}
	});
}

deleteRoom = function(rid){
  //Todo, check if owner
  let updates = {};
  if(rid !== "" && rid !== '-M3NcGg4RPa6ShpXgZXa' && rid !== '-MT5RYDarQOGALe5jgqn'){
    updates['/rooms/' + rid] = {};
    
    firebase.database().ref().update(updates);
  }
  
  
}

//Create new rooms
createNewRoom = function(name,pwd,callback){
  var d = new Date();
  var n = d.toLocaleTimeString();

  let balance = {};
  balance[currentPlayer] = 200;

  let roomData = {
    name:name,
    pwd:pwd||"",
    isPublic: pwd=="",
    players:0,
    currentDealer:[currentPlayer],
    log:[n+" :: Init Game"],
    flop:[],
    betting:{
        'playersInGame':[currentPlayer],
        'playerToTalk':currentPlayer,
        'playersInGame':[currentPlayer],
        'balance':balance,
        'thisRoundsBets':[0],
        'thisRoundSumBets':[],
        'smallBlind':1,
        'bigBlind':2,
        'currentBet':0,
        "pot":0
      },
    turn:"",
    river:"",
    admins:["0oGinVvghrYgAHc1GJz1VGpR8XL2", currentPlayer]
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
      console.log(ex_players.length);
      if(ex_players.length == 10){
        console.log("Table Full");
        return;
      }else{
        $.each(ex_players,function(k,p){
          if(p){players.push(p);}
        });  
      }
    }else{
      //First Player in the room
      //First player in room is playerToTalk
      firebase.database().ref('rooms/'+table+'/betting/playerToTalk').set(player);
      setTimeout(function(){
        setNextDealerAndDealHand();
      },2500);
      
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
