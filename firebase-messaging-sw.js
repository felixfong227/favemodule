importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBTcyHe0hmifq39jzIBi6MfF0mWTFkzDbs",
    authDomain: "favemodule.firebaseapp.com",
    databaseURL: "https://favemodule.firebaseio.com",
    storageBucket: "favemodule.appspot.com",
    messagingSenderId: "164472444045"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();