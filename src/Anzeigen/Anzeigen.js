"use strict";

import stylesheet from "./Anzeigen.css";

/**
 * View zur Anzeige und Suche der Moebelstuecke.
 * ID des Moebelstuecks als GET-Parameter uebergeben.
 * Bei keinem Parameter die Suche anzeigen.
 */
class Anzeigen {
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
        let section = document.querySelector("#anzeigen").cloneNode(true);

        // Datenbankanfrage mit der uebergebenen ID absetzten
        this._app._db.getById(this._id).then(doc => {
            console.log(doc.data());
            this.Kommentarerstellen();
        });


        return {
            button: 3,
            className: "anzeigen",
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
        return "Suche" + this._id;
    }


    Kommentarerstellen(){


    document.querySelector("input").addEventListener("click", submitListener);
    window.addEventListener("keypress", (event) => {
      console.log(event.key + " pressed");
      if(event.key == 'Enter') {
        event.preventDefault();
        submitListener();
      }
    });


  console.log("js found");

  let submitListener = (event) => {
    let text = document.querySelector("#Kommentarbody textarea").value;
    console.log(text);
    let commi = document.getElementById("comments");
    let newComment = document.createElement("commi");
    newComment.classList.remove ("hellbraun");
    newComment.classList.add ("braun");
    let time = document.createElement("time");

    newComment.textContent = text;
    let now = new Date();
    time.textContent = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    newComment.appendChild(time);
    comments.appendChild(newComment);
    document.querySelector("textarea").value="";
  }
}

}

export default Anzeigen;
