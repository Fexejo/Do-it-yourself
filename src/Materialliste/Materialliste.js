"use strict";

import stylesheet from "./Materialliste.css";

// Klasse fuer die Anzeige der Liste laden
import MateriallisteAnzeige from "./MateriallisteAnzeige.js";

/**
 * View zur Anzeige der Materialliste in Abhaengigkeit der ausgewaehlten Moebelstuecke.
 */
class Materialliste {
    /**
     * Konstruktor.
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     */
    constructor(app) {
        this._app = app;
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
        let section = document.querySelector("#materialliste").cloneNode(true);
        
        let anzeige = new MateriallisteAnzeige(this._app, section.querySelector("#MlEintraege"));
        
	    return {
            button: 4,
	        className: "materialliste",
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
        return "Materialliste (" + this._app.MlSpeicher.sizeOf() + ")";
    }
}

export default Materialliste;