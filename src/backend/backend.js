
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
const config = {
  apiKey: "AIzaSyALUrUT8h6_oBFaOOMmmbPM0UVyMB7OEx4",
  authDomain: "makeit-4ee8e.firebaseapp.com",
  databaseURL: "https://makeit-4ee8e-default-rtdb.firebaseio.com",
  projectId: "makeit-4ee8e",
  storageBucket: "makeit-4ee8e.appspot.com",
  messagingSenderId: "293032715387",
  appId: "1:293032715387:web:cceb8a4431736f2f622ede",
  measurementId: "G-MJQZ37WXNP"
};

firebase.initializeApp(config);

var db = firebase.database();
var auth = firebase.auth();
let storage = firebase.storage();

export { db, auth, storage }