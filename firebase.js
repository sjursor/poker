const firebase = require('firebase/app');
//const firestore = require('firebase/firestore');
//require("firebase/auth");
//require("firebase/firestore");

//let db = firestore();

// db.child("room").on('value', function(snapshot) {
//   console.log(snapshot);
// });

const firebaseConfig = {
  apiKey: "AIzaSyDl7d1_BOmwKUCKE22PjSBGagUsXtIy9EU",
  authDomain: "poker-9c76f.firebaseapp.com",
  databaseURL: "https://poker-9c76f.firebaseio.com",
  projectId: "poker-9c76f",
  storageBucket: "poker-9c76f.appspot.com",
  messagingSenderId: "661582615603",
  appId: "1:661582615603:web:bdbbe82e9fd68d265b3f46"
};

firebase.initializeApp(config);