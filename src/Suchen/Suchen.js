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
        this._searchString = searchString;
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
        
        //this._app.overlay.showAlert("Die Datenbank ist noch leer. Füge erst Möbelstücke hinzu, damit Du suchen kannst.");
        this._app._db.getAll().then(data => {
           data.forEach(doc => {
               console.log(doc.data());
           });
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
}

export default Suchen;