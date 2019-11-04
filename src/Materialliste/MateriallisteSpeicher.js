"use strict";

class MateriallisteSpeicher {
	constructor () {
		// Leere Liste zur spaeteren Speicherung der IDs anlegen
		this._speicher = [];
		console.log("ML- Konstruktor");
	}
	
	add (id) {
		// uebergebene ID zum Speicher hinzufuegen
		if (!this._speicher.includes(id)) {
			this._speicher.unshift(id);
			return true;
		}
		// ID schon gespeichert, erstmal nix weiter tun
		return false;
	}
	
	contains (id) {
		// zurueckgeben, ob die ID im Speicher ist
		console.log(id);
		if (this._speicher.includes(id)) {
			return true;
		}
		return false;
	}
	
	remove (id) {
		// uebergebene ID aus dem Speicher entfernen
		if (this._speicher.indexOf(id) >= 0) {
			this._speicher.splice(this._speicher.indexOf(id));
			return true;
		}
		return false;
	}
	
	toggle (id) {
		if (this._speicher.includes(id)) {
			// schon drin, also raus damit
			this.remove(id);
			return false;
		} else {
			// nicht drin, also rein tun
			this.add(id);
			return true;
		}
	}
}

export default MateriallisteSpeicher;