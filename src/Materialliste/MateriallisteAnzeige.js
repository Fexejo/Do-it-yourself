"use strict";

class MateriallisteAnzeige {
	constructor(app, p) {
		this._app = app;
		// _parentNode ist das Element, in welchen die Eintraege angezeit werden sollen
		this._parentNode = p;
		
		this._gesamtpreis = 0;
		
		// falls die Liste nicht leer ist, Daten laden
		if (this._app.MlSpeicher.get().length > 0) {
			this._app._db.getAll().then(res => {
				this._data = res;
				this.show();
			});
		}
	}
	
	show() {
		this._data.forEach(doc => {
			if (this._app.MlSpeicher.get().includes(doc.id)) {
				// Dieses Doc anzeigen
				this._addItem(doc);
			} else {
				// nicht anzeigen
				return true;
			}
		});
		// Gesamtpreis anzeigen
		 document.querySelector("#Gesamtpreis b").innerHTML = "Gesamtpreis: " + this._gesamtpreis + " €";
	}
	
	_addItem(doc) {
		let newEntry = document.getElementById("MlEintrag").content.cloneNode(true);
		
		// Bezeichnung setzen
		newEntry.querySelector("span").lastChild.textContent = doc.data().bezeichnung;
		
		// Anleitung einsetzen
		newEntry.querySelector(".Anleitung span").lastChild.textContent = doc.data().anleitung;
		
		// Materialien und Preisberechnung
		
		//Tabellenzeile klonen
		let tr = newEntry.querySelector("tbody tr").cloneNode(true);
		// Tabelle leeren
		newEntry.querySelector("tbody").innerHTML = "";
		
		// Materialien durchiterieren
		let preis = 0;
		let m = doc.data().material;
		for (let i in m) {
			let newRow = tr.cloneNode(true);
			
			let tds = newRow.querySelectorAll("td");
			tds[0].lastChild.textContent = m[i].Materialname;
			tds[1].lastChild.textContent = m[i].Stueckzahl;
			tds[2].lastChild.textContent = m[i].Laenge + " " + m[i].LaengeEinheit;
			tds[3].lastChild.textContent = m[i].Hoehe + " " + m[i].HoeheEinheit;
			tds[4].lastChild.textContent = m[i].Breite + " " + m[i].BreiteEinheit;
			tds[5].lastChild.textContent = m[i].Preis + " €";
			
			// Preis addieren
			let intPreis = parseInt(m[i].Preis);
			if (!isNaN(intPreis)) {
				preis += intPreis;
			}
			
			// neue Zeile in tbody einhaengen
			newEntry.querySelector("tbody").appendChild(newRow);
		}
		
		// Preis fuer dieses Moebelstueck anzeigen
		newEntry.querySelector(".Preismoebel").lastChild.textContent = " " + preis + " €";
		
		// Preis zum Gesamtpreis addiren
		this._gesamtpreis += preis;
		
		this._parentNode.appendChild(newEntry);
	}
}
export default MateriallisteAnzeige;