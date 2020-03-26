loginHandler = function(){
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("user is signed in");

        addPlayerToTable(user.uid, "-M3NcGg4RPa6ShpXgZXa");
        currentPlayer = user.uid;
        showGame(user);
        updateUserCards();
    } else {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        newPlayer(user.uid, user.email, user.displayName, user.photoURL, function(pid){
          currentPlayer = pid;
          console.log("Current room "+currentRoom);
          addPlayerToTable(pid,currentRoom);
          jQuery("#userinfo").text("User: "+user.displayName);
        });
          showGame();
          updateUserCards();

        // ...
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
    }
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