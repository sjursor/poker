loginHandler = function(callback){
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        u = user;
        console.log("user is signed in");
        currentPlayer = user.uid;

        if(typeof(callback=="function")){callback(user);}
        //newPlayer(user.uid, user.email, user.displayName, user.photoURL, function(pid){//});
    } else {
      callback(false);
      $("#login").click(function(){
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;

          console.log("authing");

          newPlayer(user.uid, user.email, user.displayName, user.photoURL, function(pid){
            currentPlayer = pid;
          });

          jQuery("#userinfoname").text("User: "+user.displayName);
          $("#logout").show();
          $("#login").hide();
          $("#loginContainer").hide();

          if(typeof(callback=="function")){callback(user);}
        
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          console.log(errorMessage, errorCode, email);
          // ...
        }); 
      });
    }

    $("#logout").on("click", function(){
      console.log(typeof(currentRoom));
      if(typeof(currentRoom) !== "undefined"){
        removePlayerFromTable(u.uid,currentRoom);
      }
      firebase.auth().signOut().then(function() {
        console.log("signed out success");
        $("#logout").hide();
        $("#loginContainer").show();
        $("#userinfoname").text("You must log in to play the game (reload page)");
        window.location.reload();
      }).catch(function(error) {
        console.log("error", error);
      });
    });


  });  
}


const firebaseConfig = {
        apiKey: "AIzaSyDl7d1_BOmwKUCKE22PjSBGagUsXtIy9EU",
        authDomain: "poker-9c76f.firebaseapp.com",
        databaseURL: "https://poker-9c76f.firebaseio.com",
        projectId: "poker-9c76f",
        storageBucket: "poker-9c76f.appspot.com",
        messagingSenderId: "661582615603",
        appId: "1:661582615603:web:bdbbe82e9fd68d265b3f46"
      };

      firebase.initializeApp(firebaseConfig);