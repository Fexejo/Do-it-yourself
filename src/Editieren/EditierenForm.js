"use strict";

class EditierenForm {
	constructor(db, id) {
		this._db = db;
		this._id = id;
	}
	
	show(parentNode) {
		// Template holen
		let c = document.querySelector("#EditierenForm").content.cloneNode(true);
		// Zeile der Tabelle zur Vervielfaeltigung sichern
		this._tr = c.querySelector("tbody > tr").cloneNode(true);
		
		if (this._data) {
			// Formularinhalte vorhanden -> einfuegen
			c = this._fill(c);
			
		}
		// EventListener auf Submit Button registrieren
		c.querySelector("#suchbutton").addEventListener("click", e => {
			e.preventDefault();
			console.log(this.getData());
			this.save();
		});
		
		// EventListener fuer neue Tabellenzeilen registrieren
		c.querySelector("thead").addEventListener("click", e => {
			document.querySelector("#table tbody").appendChild(this._tr.cloneNode(true));
		});
		
		
		// Dummy leeren
		parentNode.innerHTML = "";
		
		// Formular in den Dummy einhaengen
		parentNode.appendChild(c);
	}
	
	_fill(c) {
		c.querySelector("#textfeld").value = "Jojo";
		return c;
	}
	
	save() {
		if (this._id) {
			// vorhanden -> update
			
		} else {
			// neues doc anlegen
			console.log("Saving...");
			this._db.add(this.getData()).then(m => {
				console.log("Result:");
				console.log(m);
			}).catch(e => {
				console.log("Error");
				console.log(e);
			})
			console.log("done.");
		}
	}
	
	getData() {
		let domEl = document.querySelector("#app #formDummy");
		let ret = {};
		
		ret.bezeichnung = domEl.querySelector("#textfeld").value;
		ret.anleitung = domEl.querySelector("#textfeld2").value;
		ret.kategorie = domEl.querySelector("#auswahl").value;
		
		//  Bilder
		
		// Material
		ret.material = {};
		let counter = 0;
		let rows = domEl.querySelectorAll("#table tbody tr");
		rows.forEach(row => {
			let inputs = row.querySelectorAll("input");
			ret.material[counter] = {
				Materialname: 	inputs[0].value,
				Stueckzahl:		inputs[1].value,
				Laenge:			inputs[2].value,
				LaengeEinheit:	inputs[3].value,
				Hoehe:			inputs[4].value,
				HoeheEinheit:	inputs[5].value,
				Breite:			inputs[6].value,
				BreiteEinheit:	inputs[7].value,
				Preis:			inputs[8].value,
			};
			counter++;
		});
		
		
		return ret;
	}
}

export default EditierenForm;