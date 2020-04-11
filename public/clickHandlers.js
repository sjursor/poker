clickHandlers = function(){

	//Click handlers
	  // New room
	  $("#newRoomSubmit").click(function(){
	      var roomName = jQuery("#roomInput").val();
	      createNewRoom(roomName);
	  });


	  // Next card
	  $("#nextCard").click(function() {
	    switch (tableState) {
	      case 0:
	        if (confirm("Deal new hand?")) {
	          setNextDealerAndDealHand();
	          $("#nextCard").html("Show flop");
	          tableState = 1;
	        }
	        break;

	      case 1:
	        if (confirm("Show flop?")) {
	          showFlop();
	          $("#nextCard").html("Show turn");
	          tableState = 2;
	        }
	        break;

	      case 2:
	        if (confirm("Show turn?")) {
	          showTurn();
	          $("#nextCard").html("Show river");
	          tableState = 3;
	        }
	        break;

	      case 3:
	        if (confirm("Show river?")) {
	          showRiver();
	          $("#nextCard").html("End game and deal new hand");
	          tableState = 4;
	        }
	        break;

	      case 4:
	        if (confirm("End game and deal new hand?")) {
	          setNextDealerAndDealHand();
	          $("#nextCard").html("Show flop");
	          tableState = 1;
	        }
	        break;
	    }

	  });


	// Fold-button
	$("#fold").click(function() {

	  if (confirm("Fold hand?")) {
	    firebase.database().ref('rooms/'+currentRoom+"/folded").push({
	      currentPlayer
	    });
	    firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame").once("value",function(s){
	    	playersInGame = s.val();
	    	const index = playersInGame.indexOf(currentPlayer);
	    	if (index > -1) {
			  playersInGame.splice(index, 1);
			}
			setNextPlayerToTalk();
			firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame").set(playersInGame);
	    });

	    //$("#fold").attr("disabled","disabled");
	  }
	});


	// Show card-button
	$("#showcards").click(function() {

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
}

