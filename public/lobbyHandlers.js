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
				$(".room [data-rid='"+rid+"']").click();
			});
		});

		$(".room").click(function(){
			$(".createRoom").hide();
			let rid = $(this).data("rid");
			console.log(rid);
		});
	}

	showRoom = function(rid){
		$("#createRoom").hide();
		$(".roomDetails").show();
		$()
	}

}