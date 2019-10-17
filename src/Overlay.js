"use strict";

class Overlay {
	constructor() {
		this._domElement = document.getElementById("overlay");
		console.log("Overlay Konstruktor");
	}
	show () {
		this._domElement.classList.remove("hidden");
		this._domElement.addEventListener("click", this.hide);
		console.log("Overlay show()");
		console.log(this);
	}
	
	hide () {
		this.removeEventListener("click", this.hide);
		this.classList.add("hidden");
		console.log("Overlay hide()");
		console.log(this);
	}
}

export default Overlay;