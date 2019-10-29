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

        // Datenbankanfrage mit der uebergebenen ID absetzen
        this._app._db.getById(this._id).then(doc => {
            // Daten zum Anzeigen geladen
            console.log(doc.data());
            
            // main Bereich zum manipulieren getten
            let main = document.querySelector(".anzeigen");
            
            // Bezeichnung in die Ueberschrift setzen
            main.querySelector("h2").textContent = doc.data().bezeichnung;
            
            // Kategorie in den #Kopf-DIV
            main.querySelector("#Kopf").firstChild.textContent = "Kategorie: " + doc.data().kategorie;""
            
            // Anleitung  in den p des #Anleitung-DIV
            main.querySelector("#Anleitung > p").innerHTML = doc.data().anleitung.replace(/\n/g, "<br>");
            
            // Liste der Materialien
            let tbody = main.querySelector("tbody");
            let tr = tbody.querySelector("tr").cloneNode(true);
            tbody.innerHTML = "";
            
            let m = doc.data().material;
            for (let i in m) {
                let newRow = tr.cloneNode(true);
                let cells = newRow.querySelectorAll("td");
                
                cells[0].lastChild.textContent = m[i].Materialname;
                cells[1].lastChild.textContent = m[i].Stueckzahl;
                cells[2].lastChild.textContent = m[i].Laenge + m[i].LaengeEinheit;
                cells[3].lastChild.textContent = m[i].Hoehe + m[i].HoeheEinheit;
                cells[4].lastChild.textContent = m[i].Breite + m[i].BreiteEinheit;
                cells[5].lastChild.textContent = m[i].Preis + " €"
                
                tbody.appendChild(newRow);
            }
            
            // Listener fuer die Buttons
            let buttons = main.querySelectorAll("#Buttons button");
            
            // 0: Bearbeiten
            buttons[0].addEventListener("click", e => {
                this._app._router.navigate("/editieren/" + this._id);
            });
            
            // 1: Hinzufuegen (Materialliste)
            
            
            // 2: Loeschen
            buttons[2].addEventListener("click", e => {
                this._app._db.delete(this._id).then(res => {
                    this._app.overlay.showAlert("Gelöscht", () => {
                        this._app.overlay._hide();
                        this._app._router.navigate("/suchen");
                    });
                })
            });
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
