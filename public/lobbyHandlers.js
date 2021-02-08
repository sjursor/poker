initLobby = function(){

	$(document).ready(function(){
		getRooms(function(){
			lobbyHandlers();	
		});		
	});

	lobbyHandlers = function(){
		$("#createNewRoomSubmit").click(function(){
			let input = $("#inputRoomName").val();
			createNewRoom(input,function(rid){
				//Auto-join: $(".room [data-rid='"+rid+"']").click();
			});
		});

		$(".joinRoom").click(function(){
			let rid = $(this).data("rid");
			location = "/?rid="+rid;
		});
	}

	showRoom = function(rid){
		$("#createRoom").hide();
		$(".roomDetails").show();
	}

}