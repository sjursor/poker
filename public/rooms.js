//List current rooms in firebase
getRooms = function(){
	var roomsRef = firebase.database().ref('rooms');
	roomsRef.on('value', function(snapshot) {
	  	$("#roomlist ul li").remove();
	  	$.each(snapshot.val(), function(key,roomData){
	    	var li = $("#roomlist ul").append('<li data-fid="'+key+'" data-name="'+roomData['name']+'">'+roomData['name']+'</li>');
		});	
	});
}

