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
	      	if (parseInt($(".pot").text()) !== 0) {
				alert("Settle pot first");
			} else {
				if (confirm("End game and deal new hand?")) {
					setNextDealerAndDealHand();
					setNextPlayerToTalk(smallBlindPlayer);
					$("#nextCard").html("Show flop");
					tableState = 1;
				}
			}

	        break;
	    }

	  });


	// Fold-button
	$("#fold").click(function() {

	  if (confirm("Fold hand?")) {
	  	foldPlayer(currentPlayer);
	  }
	});

	foldPlayer = function(pid){
		firebase.database().ref('rooms/'+currentRoom+"/folded").once("value", function(f){
			let folded = f.val();
			
			if(!folded || folded.length == 0){
				folded = [pid];
			}else{
				folded.push(pid);	
			}
			//console.log(folded);

			firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame").once("value",function(s){
				let newPlayersInGame = s.val();
				let index = newPlayersInGame.indexOf(pid);
				let nextPlayerIndex = index;

				// Update players in game with folded player removed
				// Keep index or move it to 0 for next player
				if (index > -1) {
					newPlayersInGame.splice(index, 1);

					if (newPlayersInGame.length == index) {
						nextPlayerIndex = 0;
					}
				}
				firebase.database().ref('rooms/'+currentRoom+"/betting/playersInGame").set(newPlayersInGame);

				// Hide this round bet for folded player
				$(".player[data-pid='"+pid+"'] .thisRoundBet").addClass("folded");


				// If folded is also playertotalk, we need to move to next player
				if (pid == playerToTalk) {
					console.log("folded player is playertotalk, setting next player to talk to be "+newPlayersInGame[nextPlayerIndex]);
					setNextPlayerToTalk(newPlayersInGame[nextPlayerIndex]);
				}

				// Do the actual folded update
				firebase.database().ref('rooms/'+currentRoom+"/folded").set(folded);
			});
		});

	}


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

	$("#adminBtn").click(function(){
		$("#admin").toggle();
	});
}

