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

	  $("#submitsetAllPlayersBalance").click(function(){
	  	let bal = $("#setAllPlayersBalance input").val();
	  	setAllPlayersBalance(bal);
	  });

	  $("#submitWinner").click(function(){
	  	let winners = $("#winner select").val();
	  	winner(winners);
	  });

	  $("#submitinputSumTable").click(function(){
	  	let players = $(".player[data-pid] .balance");
	  	let sum = 0;
	  	$.each(players, function(k,v){
  			let val = parseInt($(v).text());
	  		sum += val;
	  	});
	  	$("#inputSumTable").val(sum+parseInt($(".pot").text()));
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
	  });


	// Show card-button
	$("#showcardsadsfasdf").click(function() {

	  if (confirm("Show cards?")) {

	    var card1 = $("#userCard1").attr("class").replace("card ", "");
	    var card2 = $("#userCard2").attr("class").replace("card ", "");
	    let cardClass = card1+";"+card2;

	    currentPlayerHandDescription(function(hand,playerCards){
	      firebase.database().ref('rooms/'+currentRoom+"/shownCards/"+currentPlayer).set({
	        cardClass:cardClass,
	        descr:hand.descr,
	        cards:playerCards
	      });
	    })

	    
	    $("#showCards").attr("disabled","disabled");
	  }

	});

	
	let players = $(".player[data-pid]");
	let selects = $("#admin select");
  	$.each(players, function(k,v){
		let pid  = $(v).data("pid");
		let name = $(".name", $(v)).text();
		$.each(selects, function (kk,vv){
			let ins = '<option value="'+pid+'">'+name+'</option>';
			$(vv).append(ins);
  		});
	});
}

