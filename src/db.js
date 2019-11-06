"use strict";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";




class Db {
	constructor() {
		  // Your web app's Firebase configuration
		  let firebaseConfig = {
		    apiKey: "AIzaSyAbOlo76l2kASxR72t6Edv-uZkTAsEHiwo",
		    authDomain: "do-it-yourself-47e53.firebaseapp.com",
		    databaseURL: "https://do-it-yourself-47e53.firebaseio.com",
		    projectId: "do-it-yourself-47e53",
		    storageBucket: "do-it-yourself-47e53.appspot.com",
		    messagingSenderId: "1069359400515",
		    appId: "1:1069359400515:web:cda5b97fe7e911010e36f6"
		  };
		  // Initialize Firebase
		  firebase.initializeApp(firebaseConfig);
		  
		  this._db = firebase.firestore();
		  this._storage = firebase.storage();
	}
	
	getAll () {
		return this._db.collection("moebel").get();
	}
	
	getById(id) {
		return this._db.collection("moebel").doc(id).get();
	}
	
	add(data) {
		return this._db.collection("moebel").add(data);
	}
	
	delete(id) {
		return this._db.collection("moebel").doc(id).delete();
	}
	
	update(id, data) {
		return this._db.collection("moebel").doc(id).update(data)
	}
	
	uploadFile(filename, file) {
		return this._storage.ref().child("img/" + filename).put(file);
	}
	
	getFileUrl(filename) {
		return this._storage.ref().child("img/" + filename).getDownloadURL();
	}
}

export default Db;