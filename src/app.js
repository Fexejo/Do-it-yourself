"use strict";

/**
 * Hauptklasse der Anwendung. Kümmert sich darum, die Anwendung auszuführen
 * und die angeforderten Bildschirmseiten anzuzeigen.
 */

// Navigo fuer Routing laden
import Navigo from "navigo/lib/navigo.js";

// Overlay laden
import Overlay from "./Overlay/Overlay.js";

// Viewklassen laden
import Start from "./Start/Start.js";
import Editieren from "./Editieren/Editieren.js";
import Suchen from "./Suchen/Suchen.js";
import Anzeigen from "./Anzeigen/Anzeigen.js";
import Materialliste from "./Materialliste/Materialliste.js";



class App {
    /**
     * Konstruktor.
     */
    constructor() {
            // Die zentrale Instanz des Overlays erzeugen, die dann immer von ueberall aus verwendet werden kann.
        this.overlay = new Overlay();
        
        this._title = "Do it yourself!";
        this._currentView = null;
    
        // Single Page Router aufsetzen
        this._router = new Navigo();
        this._currentUrl = "";
        this._navAborted = false;
    
        this._router.on({
            "*":                    () => this.showStart(""),
            "/editieren":           () => this.showEditieren(""),
            "/suchen":             () => this.showSuchen(""),
            "/suchen/:searchString": params => this.showSuchen(params.searchString),
            "/anzeigen":            () => this.showAnzeigen(""),
            "/anzeigen/:id":        params => this.showAnzeigen(params.id),
            "/materialliste":       () => this.showMaterialliste(),
        });
    
        this._router.hooks({
            after: (params) => {
                if (!this._navAborted) {
                    // Navigation durchführen, daher die neue URL merken
                    this._currentUrl = this._router.lastRouteResolved().url;
                } else {
                    // Navigation abbrechen, daher die URL in der Adresszeile
                    // auf den alten Wert der bisherigen View zurücksetzen
                    this._router.pause(true);
                    this._router.navigate(this._currentUrl);
                    this._router.pause(false);
    
                    this._navAborted = false;
                }
            }
        });
    }

    /**
     * Ab hier beginnt die Anwendung zu laufen.
     */
    start() {
        console.log("Die Klasse App sagt Hallo!");
        this._router.resolve();
    }
    
    _switchVisibleView(view) {
        // Callback, mit dem die noch sichtbare View den Seitenwechsel zu einem
        // späteren Zeitpunkt fortführen kann, wenn sie in der Methode onLeave()
        // false zurückliefert. Dadurch erhält sie die Möglichkeit, den Anwender
        // zum Beispiel zu fragen, ob er ungesicherte Daten speichern will,
        // bevor er die Seite verlässt.
        let newUrl = this._router.lastRouteResolved().url;
        let goon = () => {
            // ?goon an die URL hängen, weil der Router sonst nicht weiternavigiert
            this._router.navigate(newUrl + "?goon");
        }
    
        // Aktuelle View fragen, ob eine neue View aufgerufen werden darf
        if (this._currentView && !this._currentView.onLeave(goon)) {
            this._navAborted = true;
            return false;
        }
        
        console.log("View wechseln: " + view.title);
        // Alles klar, aktuelle View nun wechseln
        document.title = `${this._title} – ${view.title}`;
    
        this._currentView = view;
        this._switchVisibleContent(view.onShow());
        return true;
    }
    
    
     /* Auswechseln des sichtbaren Inhalts der App. Hierfür muss der Methode
     * ein Objekt mit folgendem Aufbau übergeben werden:
     *
     *   {
            className: "CSS-Klassenname",
     *      topbar: [DOM Element, DOM Element, DOM Element, ...],
     *      main: [DOM Element, DOM Element, DOM Element, ...],
     *   }
     *
     * Beide Attribute (topbar und main) sind optional, was dazu führt, dass
     * im jeweiligen Bereich einfach nichts angezeigt wird. Werden sie jedoch
     * mitgegeben, müssen sie mit forEach(element => { … }) iteriert werden
     * können, um ihren Inhalt in den DOM-Baum zu integrieren.
     *
     * Wichtig ist, dass die übergebenen Elemente noch an keiner Stelle im
     * DOM vorhanden sein dürfen. Werden die Elemente in der index.html
     * als Vorlage definiert, muss hier deshalb eine Kopie anstelle der
     * Elemente selbst übergeben werden!
     *
     * @param {Object} content Objekt mit den anzuzeigenden DOM-Elementen
     */
    _switchVisibleContent(content) {
        
        // <header> und <main> des HTML-Grundgerüsts ermitteln
        let app = document.querySelector("#app");
        let header = document.querySelector("#app > header");
        let main = document.querySelector("#app > main");
    
        // Zuvor angezeigte Inhalte entfernen
        // Bei der Topbar nur die untere Zeile, im Hauptbereich alles!
        header.querySelectorAll("img").forEach(b =>{
            b.className = "";
        });
        main.className = "";
        main.innerHTML = "";
        
        // Klasse .active dem entsprechenden Button geben
        if (content && content.button) {
            header.querySelectorAll("img")[content.button - 1].classList.add("active");
            console.log(header.querySelectorAll("img"));//[content.button].classList.add(".active");
        }
        
        // CSS-Klasse übernehmen, um die viewspezifischen CSS-Regeln zu aktivieren
        if (content && content.className) {
            main.className = content.className;
        }
    
        // Neue Inhalte der Topbar einfügen
        if (content && content.topbar) {
            content.topbar.forEach(element => {
                element.classList.add("bottom");
                header.appendChild(element);
            });
        }
    
        // Neue Inhalte des Hauptbereichs einfügen
        if (content && content.main) {
            content.main.forEach(element => {
                main.appendChild(element);
            });
        }
        
        // Navigo an die Links in der View binden
        this._router.updatePageLinks();
    }
    
    showStart() {
        let view = new Start(this);
        this._switchVisibleView(view);
    }
    
    showEditieren (id) {
        let view = new Editieren(this, id);
        this._switchVisibleView(view);
    }
    
    showSuchen(searchString) {
        let view = new Suchen(this, searchString);
        this._switchVisibleView(view);
    }
    
    showAnzeigen (id) {
        let view = new Anzeigen(this, id);
        this._switchVisibleView(view);
    }
    
    showMaterialliste () {
        let view = new Materialliste(this);
        this._switchVisibleView(view);
    }

}

export default App;