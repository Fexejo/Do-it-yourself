"use strict";

import stylesheet from "./Suchen.css";

/**
 * View zur Anzeige und Suche der Moebelstuecke.
 * ID des Moebelstuecks als GET-Parameter uebergeben.
 * Bei keinem Parameter die Suche anzeigen.
 */
class Suchen {
    /**
     * Konstruktor.
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     */
    constructor(app, id) {
        this._app = app;
        this._id = id;
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

        return {
            className: "suc",
            topbar: null,
            main: document.querySelectorAll("#suchen > *"),
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
        return "suchen";
    }
}

export default Suchen;