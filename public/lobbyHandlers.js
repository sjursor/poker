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
			let isPublic = $(this).data("rid") == "Public" ? true : false;
			if(isPublic){
				location = "/?rid="+rid;
			}else{
				firebase.database().ref('rooms/'+rid+"/pwd").once("value", function(s) {
					var inputPwd = prompt("This is a private room, please enter password");
					if(inputPwd == s.val()){
						location = "/?rid="+rid;
					}else{
						alert("Wrong password");
					}
				});
			}
			
		});
	}

	showRoom = function(rid){
		$("#createRoom").hide();
		$(".roomDetails").show();
	}

}