"use strict";


// Stylesheet fuer Overlay
import stylesheet from "./Overlay.css";

class Overlay {
	constructor() {
		this._domElement = document.getElementById("overlay");
		console.log("Overlay Konstruktor");
	}
	
	_show () {
		this._domElement.classList.remove("hidden");
		this._domElement.classList.add("overlay");
		console.log("Overlay show()");
		console.log(this);
	}
	
	_hide () {
		let domEl = document.getElementById("overlay");
		domEl.classList.remove("overlay");
		domEl.classList.add("hidden");
		console.log("Overlay hide()");
		console.log(domEl);
	}
	
	showAlert(message, callback = null) {
		let p = document.createElement("p");
		p.innerHTML = message;
		
		let button = document.createElement("button");
		button.innerHTML = "OK";
		
		let container = document.createElement("message");
		container.appendChild(p);
		container.appendChild(button);
		
		if (callback) {
			// uebergebene Callback als Listener registrieren
			button.addEventListener("click", callback);
		} else {
			// Kein Callback, nur _hide
			button.addEventListener("click", this._hide);
		}
		
		this._domElement.innerHTML = "";
		this._domElement.appendChild(container);
		this._show();
		button.focus();
	}
}

export default Overlay;