adminHandlers = function(){
	//Click handlers
	  // New room
	  $("#submitsetNextDealerAndDealHand").click(function(){
	      setNextDealerAndDealHand();
	  });

	  $("#submitPlayerBalance").click(function(){
	  	let bal = $("#setPlayerBalance input").val();
	  	let pid = $("#setPlayerBalance select").val();
	  	setPlayerBalance(pid,bal);
	  	//Reset inputs
	  	$("#setPlayerBalance select").prop('selectedIndex',0);
	  	$("#setPlayerBalance input").val(0)
	  });

	  $("#submitaddToPlayersBalance").click(function(){
	  	let pid = $("#addToPlayersBalance select").val();
	  	let add = $("#addToPlayersBalance input").val();
	  	addToPlayersBalance(pid,add);
	  });

	  $("#submitsubtractFromPlayersBalance").click(function(){
	  	let pid = $("#subtractFromPlayersBalance select").val();
	  	let sub = $("#subtractFromPlayersBalance input").val();
	  	subtractFromPlayersBalance(pid,sub);
	  });

	  $("#submitmoveFromPotToPlayer").click(function(){
	  	let pid 	= $("#moveFromPotToPlayer select").val();
	  	let amount  = $("#moveFromPotToPlayer input").val();
	  	moveFromPotToPlayer(pid,amount);
	  });

	  $("#submitsetAllPlayersBalance").click(function(){
	  	let bal = $("#setAllPlayersBalance input").val();
	  	setAllPlayersBalance(bal);
	  });

	  $("#submitWinner").click(function(){
	  	let winners = $("#winner select").val();
	  	winner(winners);
	  });

	  $("#submitinputSumTable").click(function(){
	  	sumTable();
	  });

	  $("#submitnextPlayerToTalk").click(function(){
	  	setNextPlayerToTalk();
	  });
	  $("#submitprevPlayerToTalk").click(function(){
	  	setPrevPlayerToTalk();
	  });

	  $("#submitadmShowFlop").click(function(){showFlop()});
	  $("#submitadmShowTurn").click(function(){showTurn()});
	  $("#submitadmShowRiver").click(function(){showRiver()});

	  $("#submitKickPlayerFromTable").click(function(){
	  	let kick 	= $("#kickPlayerFromTable select").val();
	  	let fbref 	= firebase.database().ref('rooms/'+currentRoom+"/players/");
	  	fbref.once('value', function(snapshot){
			var players = snapshot.val();
			var newPlayers = players.filter(function(e) { return e !== kick });
			firebase.database().ref('rooms/'+currentRoom+"/players/").set(newPlayers);	
		});
		let fbref2 	= firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame");
	  	fbref2.once('value', function(snapshot){
			var players2 = snapshot.val();
			var newPlayers2 = players.filter(function(e) { return e !== kick });
			firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame").set(newPlayers2);	
		});
	  });

	  $("#submitFoldPlayer").click(function(){
	  	let fold 	= $("#foldPlayer select").val();
	  	foldPlayer(fold);
	  });

	  $("#submitAdminz").click(function(){
	  	let admins = $("#adminlist select").val();
	  	if(admins.length){
			firebase.database().ref('rooms/'+currentRoom+"/admins/").set(admins);
	  	}else{
	  		alert("Amongst all indians, someone has to be chief");
	  	}
	  });


	setTimeout(function(){
		$("#admin select").empty();
		
		let players = $(".player[data-pid]");
		let selects = $("#admin select");
		playerMap = [];
	  	$.each(players, function(k,v){
			let pid  = $(v).data("pid");
			let name = $(".name", $(v)).text();
			$.each(selects, function (kk,vv){
				let ins = '<option value="'+pid+'">'+name+'</option>';
				$(vv).append(ins);
				playerMap[pid] = name;
	  		});
		});

	  	//mark adminz
	  	let fbref 	= firebase.database().ref('rooms/'+currentRoom+"/admins/");
	  	fbref.once('value', function(admins){
	  		admins = admins.val();
	  		$("select#adminz").val(admins);  			
	  	});

	},2000);
	
}

