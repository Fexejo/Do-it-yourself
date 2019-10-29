"use strict";

class EditierenForm {
	constructor(app, db, id) {
		this._app = app;
		this._db = db;
		this._id = id;
		
		if (this._id != "") {
			// ID wurde uebergeben, versuche doc aus DB zu holen
			this._db.getById(this._id).then(doc => {
				if (doc.exists) {
					// Inhalte gefunden
					this._data = doc;
					console.log(this._data);
					this.show(document.getElementById("formDummy"));
				} else {
					// ID nicht in DB vorhanden
					console.log("ID nicht in DB gefunden.");
					// erstmal nichts weiter tun
					
				}
			}).catch(e => {
				console.log("ERROR");
			});
		}
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
		// Daten aus DocumentSnapshot holen
		let data = this._data.data();
		
		// Bezeichnung und Anleitung einfach als value setzen
		c.querySelector("#textfeld").value = data.bezeichnung;
		c.querySelector("#textfeld2").value = data.anleitung;
		
		// Kategorie setzen
		c.querySelectorAll("#auswahl option").forEach(o => {
			if (o.innerHTML == data.kategorie) {
				o.selected = "selected";
			}
		});
		
		// Liste der Materialien
		let tbody = c.querySelector("tbody");
		tbody.innerHTML = "";
		console.log(data.material);
		for (let i in data.material) {
			let m = data.material[i];
			let newRow = this._tr.cloneNode(true);
			let inputs = newRow.querySelectorAll("input");
			
			inputs[0].value = m.Materialname;
			inputs[1].value = m.Stueckzahl;
			inputs[2].value = m.Laenge;
			inputs[3].value = m.LaengeEinheit;
			inputs[4].value = m.Hoehe;
			inputs[5].value = m.HoeheEinheit;
			inputs[6].value = m.Breite;
			inputs[7].value = m.BreiteEinheit;
			inputs[8].value = m.Preis;
			
			tbody.appendChild(newRow);
		}
		
		return c;
	}
	
	save() {
		if (this._id) {
			// vorhanden -> update
			this._db.update(this._id, this.getData()).then(res => {
				console.log(this);
				this._app.overlay.showAlert("Daten wurden erfolgreich aktualisiert.", () => {
					this._app.overlay._hide();
					this._app._router.navigate("/anzeigen/" + this._id);
				});
			});
			
			
		} else {
			// neues doc anlegen
			this._db.add(this.getData()).then(m => {
				this._app.overlay.showAlert("Möbelstück wurde gespeichert.", () => {
					this._app.overlay._hide();
					this._app._router.navigate("/suchen");
				});
			}).catch(e => {
				console.log("Error beim Saven von Data");
				console.log(e);
			})
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
			if (inputs[0].value != "") {
				// Zeile nur speichern, wenn Materialname gesetzt ist
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
			}
		});
		
		
		return ret;
	}
}

export default EditierenForm;