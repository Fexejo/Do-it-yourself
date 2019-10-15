"use strict";

// Das CSS fuer das Layout laden
import stylesheet from "./index.css";

// Hauptklasse laden
import App from "./app.js";

// Erst loslaufen, wenn das Document Object Modul bereit ist
window.addEventListener("load", () => {
    // Anwendung starten
    let app = new App();
    app.start();
});