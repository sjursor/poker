
function listenForChangesInTheRoom(){
	activeRoom = firebase.database().ref('rooms/'+currentRoom);
	activeRoom.on('value', function(snapshot) {
	  var val = snapshot.val();

	  $("#currentTableName").html(val["name"]);

	  // Set tablestate and button text
	  if (val["flop"] == "") {
		tableState = 1;
		$("#nextCard").html("Show flop");
	  } else if (val["turn"] == "") {
		tableState = 2;
		$("#nextCard").html("Show turn");
	  } else if (val["river"] == "") {
		tableState = 3;
		$("#nextCard").html("Show river");
	  } else {
		tableState = 4;
		$("#nextCard").html("End game and deal new hand");
	  }

	  // Show button only when currentplayer is dealer
	  currentDealer = val["currentDealer"];
	  if (currentDealer != currentPlayer) {$("#nextCard").hide();
	  } else {$("#nextCard").show();}

	  // Show the flop if available
	  if(!val["flop"] || val["flop"] === ""){
		jQuery(".flop span").removeClass();
	  } else {
		flop = val["flop"].split(";");
		jQuery("#flopp1").removeClass().addClass(getCardClass(flop[0].split(",")));
		jQuery("#flopp2").removeClass().addClass(getCardClass(flop[1].split(",")));
		jQuery("#flopp3").removeClass().addClass(getCardClass(flop[2].split(",")));
	  }


	  // Show the turn if available
	  if(!val["turn"] || val["turn"] === "") {
		jQuery("#turn").removeClass();
	  } else {
		jQuery("#turn").removeClass().addClass(getCardClass(val["turn"]));
	  }

	  // Show the river if available
	  if(!val["river"] || val["river"] === "") {
		jQuery("#river").removeClass();
	  } else {
		jQuery("#river").removeClass().addClass(getCardClass(val["river"]));
	  }

	  // Show folded if anyone
	  if (val["folded"]) {
		folded = val["folded"];

		if(!folded || folded.length == 0){
		  jQuery("#fold").removeAttr("disabled");
		}

		// Clear all infotext before applying folded-state
		jQuery(".infotext").empty();
		jQuery(".infotext").hide();

		$.each(folded, function(k,v){
		  if (v) {
			jQuery("[data-pid='"+v['currentPlayer']+"']").addClass("folded");
			jQuery("[data-pid='"+v['currentPlayer']+"']").find(".infotext").text("FOLDED");
			jQuery("[data-pid='"+v['currentPlayer']+"']").find(".infotext").show();
			if (v['currentPlayer'] == currentPlayer) {
			  //$("#fold").attr("disabled","disabled");
			}
		  }
		});
	  } else {
		// Nobody is folded, reset all infotext
		jQuery(".folded").removeClass("folded");
		jQuery(".infotext").empty();
		jQuery(".infotext").hide();
	  }

	  // Add dealer class
	  if (val["currentDealer"]) {
		$.each($(".player"), function(k, v) {
		  if (val["currentDealer"] == $(this).attr("data-pid")) {
			$(this).find(".name").addClass("dealer");
		  } else {
			$(this).find(".name").removeClass("dealer");
		  }
		});
	  }

	  //Set player to talk
	  if (val.betting["playerToTalk"]) {
		$(".playerToTalk").removeClass("playerToTalk");
		var ptt = $(".player[data-pid='"+val.betting["playerToTalk"]+"']");
		if(ptt.hasClass('folded')){
		  setNextPlayerToTalk(val.betting["playerToTalk"]);
		}else{
		  ptt.addClass("playerToTalk");  
		}
		
	  }else{
		console.log("found no player to talk", val);
	  }
	  if(val.betting["pot"]){
		$(".pot").text(val.betting["pot"]);
	  }
	  if(val.betting["currentBet"]){
	    currentBet = val.betting["currentBet"];
	    console.log("Current bet: "+currentBet);
	    $("span.currentBet").text(parseInt(currentBet));
	  }
	  if(val.betting["balance"]){
		$.each(val.betting["balance"], function(k,v){
			$("[data-pid='" + k + "'] .balance").html(v);
		});
	  }
	  //console.log("sjur",val.betting["pot"]);

	  //See currentPlayerHandDescription
	  currentPlayerHandDescription();

	  // Reset photo URLs
	  $.each(photoURLs, function(k, v) {
		$("[data-pid='" + k + "'] .playercards").css("background-image", "url(" + photoURLs[k] + ")");
	  });


	  // Show the cards of those who have decided to show their cards
	  shownCards = val["shownCards"];

	  $(".playercards").each(function(e, obj) {
		$(this).find(".playercard1").removeClass().addClass("playercard1");
		$(this).find(".playercard2").removeClass().addClass("playercard2");
		$(this).find(".descr").text("").hide();
	  });
	  $(".winner").removeClass("winner");

	  if (shownCards) {
		let rank = [];
		$.each(shownCards,function(k, v) {

		  // Remove profile picture
		  $("[data-pid='" + k + "'] .playercards").css("background-color", "#fff");
		  $("[data-pid='" + k + "'] .playercards").css("background-image", "none");

		  // Get active cards
		  var userCards = shownCards[k].cardClass.split(";");
		  // Show card 1
		  $("[data-pid='" + k + "'] .playercards .playercard1").addClass(userCards[0]);
		  // Show card 2
		  $("[data-pid='" + k + "'] .playercards .playercard2").addClass(userCards[1]);

		  solvShownCards();
		  $("[data-pid='" + k + "'] .playercards .descr").text(shownCards[k].descr).show();

		  //Solving Rank
		  let tableCards = getTableCards();
		  var folded = jQuery("[data-pid='"+k+"']").hasClass("folded");
		  if(!folded){
			rank.push(Hand.solve(tableCards.concat(shownCards[k].cards)));
		  }

		  //var hand1 = Hand.solve(tableCards);
		  //var hand2 = Hand.solve(['3d', 'As', 'Jc', 'Th', '2d', '4s', 'Qd']);
		  //var winner = Hand.winners([hand1, hand2]); // hand2
		  
		});
		if(rank.length){
		  let winner = Hand.winners(rank); // hand2
		  //console.log(winner);
		  //console.log(rank);
		  //console.log(winner);
		  var winPlayer = jQuery(".player .descr:contains("+winner[0].descr+")");
		  winPlayer.addClass("winner");  
		}
		
	  }

	});	
}