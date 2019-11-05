"use strict";

import stylesheet from "./Suchen.css";

/**
 * View zur Suche der Moebelstuecke.
 * Falls ein Suchstring als Parameter uebergeben wird, Suche sofort ausfuehren.
 */
class Suchen {
    /**
     * Konstruktor.
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     */
    constructor(app, searchString) {
        this._app = app;
        this._searchString = searchString.toLowerCase();
    }

    /**
     * Von der Klasse App aufgerufene Methode, um die Seite anzuzeigen. Die
     * Methode gibt daher ein passendes Objekt zurück, das an die Methode
     * _switchVisibleContent() der Klasse App übergeben werden kann, um ihr
     * die darzustellenden DOM-Elemente mitzuteilen.
     *
     * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
     * Methode App._switchVisibleContent()
     */
    onShow() {
        let section = document.querySelector("#suchen").cloneNode(true);
        
        // uebergebene Suchanfrage in das Suchfeld eintragen
        section.querySelector("input").value = this._searchString;
        
        // Listener fuer das Suchfeld adden
        section.querySelector("input").addEventListener("keyup", e => {
           this._searchString = e.srcElement.value.toLowerCase();
           this.showSearchResults();
        });
        
        // und noch ein Listener, der die Adresszeile des Browser aktualisieren soll
        section.querySelector("input").addEventListener("blur", e => {
           let text = e.srcElement.value;
           history.pushState({}, "Do it Yourself! - Suchen - " + text, "/suchen/"+text);
        });
        
        
        this._app._db.getAll().then(entries => {
           this._data = [];
           entries.forEach(doc => {
               let entry = doc.data();
               entry.id = doc.id;
               this._data.push(entry);
           });
           this.showSearchResults();
        });
        
        return {
            button: 3,
            className: "suchen",
            main: section.querySelectorAll("main > *"),
        };
    }

    /**
     * Von der Klasse App aufgerufene Methode, um festzustellen, ob der Wechsel
     * auf eine neue Seite erlaubt ist. Wird hier true zurückgegeben, wird der
     * Seitenwechsel ausgeführt.
     *
     * @param  {Function} goon Callback, um den Seitenwechsel zu einem späteren
     * Zeitpunkt fortzuführen, falls wir hier false zurückgeben
     * @return {Boolean} true, wenn der Seitenwechsel erlaubt ist, sonst false
     */
    onLeave(goon) {
        return true;
    }

    /**
     * @return {String} Titel für die Titelzeile des Browsers
     */
    get title() {
        return "Suchen: " + this._searchString;
    }
    
    showSearchResults() {
        // Mit SearchString filtern
        let res = this.filter();
        
        let template = document.getElementById("suchergebnis").content.cloneNode(true);
        let parentNode = document.getElementById("Suchanzeige");
        parentNode.innerHTML = "";
        
        res.forEach(entry => {
           let div = template.cloneNode(true);
           div.querySelector("a").href = "/anzeigen/" + entry.id;
           div.querySelector("img").alt = entry.bezeichnung;
           
           let spans = div.querySelectorAll("span");
           spans[0].innerHTML = entry.bezeichnung;
           spans[1].innerHTML = entry.kategorie;
           
           parentNode.appendChild(div);
        });
        this._app._router.updatePageLinks();
    }
    
    filter() {
        let data = this._data;
        
        return data.filter(e => {
            
            let kat = e.kategorie.toLowerCase().indexOf(this._searchString);
            let bez = e.bezeichnung.toLowerCase().indexOf(this._searchString);
            
            return (kat >= 0 || bez >= 0) ? true : false;
        });
    }
}

export default Suchen;