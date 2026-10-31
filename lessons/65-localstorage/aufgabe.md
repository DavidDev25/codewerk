## Aufgabe: Der Notizzettel mit Gedächtnis

Auf der Seite gibt es einen Besuchszähler, ein Textfeld für eine Notiz und einen Knopf zum Speichern. Du sorgst dafür, dass sich die Seite all das merkt. Drücke danach mehrmals **Ausführen** und schau in der **Vorschau**, wie der Zähler wächst.

### Schritt 1: Besuche zählen

Bei jedem Start erhöht sich der Zähler um 1 und steht in `#besuche`:

```js
// erster Lauf
document.querySelector("#besuche").textContent; // "1"
// zweiter Lauf
document.querySelector("#besuche").textContent; // "2"
```

So gehst du vor:

1. Lies den alten Stand: `Number(localStorage.getItem("besuche") ?? 0)`.
2. Zähle 1 dazu und speichere das Ergebnis mit `setItem` unter `"besuche"`.
3. Schreibe den neuen Stand in den `textContent` von `#besuche`.

### Schritt 2: Die Notiz laden

Steht unter `"notiz"` schon etwas, kommt es beim Start in das Textfeld. Setze dafür den `value` von `#notiz` auf `localStorage.getItem("notiz") ?? ""`.

### Schritt 3: Die Notiz speichern

Ein Klick auf `#speichern` speichert die Notiz:

```js
// Klick auf „Speichern“
localStorage.getItem("notiz");                 // was im Textfeld steht
document.querySelector("#status").textContent; // "Gespeichert"
```

Hänge an `#speichern` einen `click`-Listener. Speichere darin den `value` von `#notiz` unter `"notiz"` und schreibe „Gespeichert“ in `#status`.

### Schritt 4: Einstellungen als JSON

```js
einstellungenLaden();                         // { thema: "hell" }
einstellungenSpeichern({ thema: "dunkel" });
einstellungenLaden();                         // { thema: "dunkel" }
```

So gehst du vor:

1. `einstellungenSpeichern(obj)` speichert `JSON.stringify(obj)` unter `"einstellungen"`.
2. `einstellungenLaden()` liest den Text. Ist er `null`, gibt sie `{ thema: "hell" }` zurück.
3. Sonst gibt sie `JSON.parse(text)` zurück.
