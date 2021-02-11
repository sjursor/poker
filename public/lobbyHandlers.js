initLobby = function(){
	console.log("initing Lobby");
	getRooms(function(){
		$("#createNewRoomSubmit").unbind("click");
		$(".joinRoom").unbind("click");

		$("#createNewRoomSubmit").click(function(){
			let name = $("#inputRoomName").val();
			let pwd   = $("#inputRoomPassword").val();

			if(name !== ""){
				createNewRoom(name,pwd,function(rid){
					//Auto-join: $(".room [data-rid='"+rid+"']").click();
				});	
			}else{
				alert("Rooms must have names");
			}
			
		});

		$(".joinRoom").click(function(){
			let rid = $(this).data("rid");
			let isPublic = $($(this).closest("tr")[0]).data("public");
			let playersInRoom = $(this).data("playersInRoom") || 0;

			firebase.database().ref('rooms/'+rid+"/pwd").once("value", function(s) {
				if (playersInRoom !== 10){
					if(isPublic){
					location = "/?rid="+rid;
					}else{
						var inputPwd = prompt("This is a private room, please enter password");
						if(inputPwd == s.val()){
							location = "/?rid="+rid;
						}else{
							alert("Wrong password");
						}
					}	
				}else{
					alert("Room is full");
				}
				
			});
			
		});

		$(".delete").click(function(){
			let rid = $(this).data("rid");
			deleteRoom(rid);
		});
	});		



	showRoom = function(rid){
		$("#createRoom").hide();
		$(".roomDetails").show();
	}

}