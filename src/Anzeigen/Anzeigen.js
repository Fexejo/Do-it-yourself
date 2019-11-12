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
            this._doc = doc;
            this._comments = doc.data().comment;

            // main Bereich zum manipulieren getten
            let main = document.querySelector(".anzeigen");

            // Bezeichnung in die Ueberschrift setzen
            main.querySelector("h2").textContent = doc.data().bezeichnung;

            // Kategorie in den #Kopf-DIV
            main.querySelector("#Kopf").firstChild.textContent = "Kategorie: " + doc.data().kategorie;""

            // Anleitung  in den p des #Anleitung-DIV
            main.querySelector("#Anleitung > p").innerHTML = doc.data().anleitung.replace(/\n/g, "<br>");

            // Bild einbinden
            this._app._db.getFileUrl(doc.id + "." + doc.data().bildSuffix).then(url => {
                main.querySelector("#Kopf > img").src = url;
            });


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
            if (this._app.MlSpeicher.contains(this._id)) {
                buttons[1].innerHTML = "Entfernen";
            }
            buttons[1].addEventListener("click", e => {
               if (this._app.MlSpeicher.toggle(this._id) ) {
                   // jetzt in der Materialliste
                   buttons[1].innerHTML = "Entfernen";
               } else {
                   // jetzt nicht in der Materialliste
                   buttons[1].innerHTML = "Hinzufügen";
               }
            });

            // 2: Loeschen
            buttons[2].addEventListener("click", e => {
                this._app._db.delete(this._id).then(res => {
                    this._app.overlay.showAlert("Gelöscht", () => {
                        this._app.overlay._hide();
                        this._app._router.navigate("/suchen");
                    });
                })
            });
            
            // schon vorhandene Kommentare anzeigen
            let comments = doc.data().comment;
            if (Array.isArray(comments)) {
                // schon Kommentare vorhanden
                for (let i in comments) {
                    this.showComment(comments[i].text, comments[i].zeit);
                }
            }
            
            // Kommentarfunktion aktivieren
            this.Kommentarfunktion(main.querySelector("#Kommentarbody"));
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
        return "Anzeigen";
    }


    Kommentarfunktion(kb){
        let submitListener = (event) => {
            // Text aus textarea speichern und diese dann leer machen
            let text = kb.querySelector("textarea").value;
            kb.querySelector("textarea").value="";
            
            let now = new Date();
            let zeit = now.getDate() + "." + now.getMonth() + "." + now.getFullYear() + " um " + now.getHours() + ":" + now.getMinutes() + " Uhr";
            
            // Checken, ob Kommentar leer ist, wenn ja, abbrechen
            if (text == "") return false;
            
            // Kommentar anzeigen
            this.showComment(text, zeit);
            
            // Kommentar in DB speichern
            this.saveComment(text, zeit);
            
        }
        
        
        // Listener fuer den Button registrieren
        kb.querySelector("input").addEventListener("click", submitListener);
        
        // Listener fuer die Enter-Taste registrieren
        kb.querySelector("textarea").addEventListener("keypress", (event) => {
          
          if(event.key == 'Enter') {
            event.preventDefault();
            submitListener();
          }
        });
    }
    
    showComment(text, zeitString) {
        // Die neuen Elemente createn
        let newComment = document.createElement("comment");
        newComment.classList.add("braun");
        let time = document.createElement("time");
        
        // Text einfuegen
        newComment.textContent = text;
        
        // Datum + Zeit einfuegen
        time.textContent = zeitString;
        newComment.appendChild(time);
        
        // Kommentar einhaengen
        let cDiv = document.querySelector("#comments");
        cDiv.insertBefore(newComment, cDiv.firstChild);
    }
    
    saveComment(t, zeitString) {
        // Neuen Kommentar in die DB hinzufuegen
        
        // Pruefung, ob schon Array in Doc vorhanden ist
        if (!Array.isArray(this._comments)) {
            this._comments = [];
        }
        
        // Kommentar in Doc einfuegen
        this._comments.push({text: t, zeit: zeitString});
        
        // Doc mit neuem Kommentar bestuecken und in der DB updaten
        let newDoc = this._doc.data();
        newDoc.comment = this._comments
        this._app._db.update(this._id, newDoc).then(r => {
            return true;
        }).catch(e => {
            this._app.overlay.showAlert("Fehler beim Speichern des Kommentars.");
        });
        
    }

}

export default Anzeigen;
