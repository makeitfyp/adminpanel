
import firebase from 'firebase';
import {
  getFirestore, query,
  getDocs, collection,
  where, addDoc, update 
}from "firebase/firestore";
var config = {
    apiKey: "AIzaSyCrtUrEBF8X0pQQU7_-GS9F5IaxX8mGtXU",
    authDomain: "make-it-cde4f.firebaseapp.com",
    databaseURL: "https://make-it-cde4f-default-rtdb.firebaseio.com",
    projectId: "make-it-cde4f",
    storageBucket: "make-it-cde4f.appspot.com",
    messagingSenderId: "835509810208",
    appId: "1:835509810208:web:cc696476ad076d008ef845"
};

firebase.initializeApp(config);
const db = firebase.firestore()


