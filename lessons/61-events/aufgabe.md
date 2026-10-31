## Aufgabe: Klicks und Eingaben

Auf der Seite gibt es einen Zähler, ein Namensfeld und eine Liste mit Farben. Du erweckst alle drei mit Listenern zum Leben. Probiere deine Lösung danach in der **Vorschau** aus.

### Schritt 1: Der Zähler

Ein Klick auf **+1** erhöht den Zähler. Der Stand steht in `#stand`:

```js
// drei Klicks auf +1
document.querySelector("#stand").textContent; // "3"
```

So gehst du vor:

1. Lege außerhalb aller Listener `let zaehler = 0;` an.
2. Hänge an `#plus` einen `click`-Listener.
3. Erhöhe darin `zaehler` und schreibe den neuen Wert in den `textContent` von `#stand`.

### Schritt 2: Zurücksetzen

Ein Klick auf **Zurücksetzen** setzt den Zähler auf 0. Danach zählt **+1** wieder ab 1.

Hänge an `#reset` einen `click`-Listener. Setze darin `zaehler` auf 0 und schreibe die 0 in `#stand`.

Wichtig: Setze auch die Variable zurück, nicht nur den Text. Sonst zählt der nächste Klick beim alten Stand weiter.

### Schritt 3: Die Begrüßung

Bei jeder Eingabe in `#name` steht in `#gruss` eine Begrüßung:

```js
// im Feld steht „Lea“
document.querySelector("#gruss").textContent; // "Hallo Lea!"
// im Feld stehen nur Leerzeichen
document.querySelector("#gruss").textContent; // ""
```

So gehst du vor:

1. Hänge an `#name` einen `input`-Listener.
2. Lies darin den Inhalt mit `event.target.value` und entferne mit `trim()` die Leerzeichen am Rand.
3. Ist danach nichts übrig, setze den Text von `#gruss` auf `""`. Sonst setze ihn auf die Begrüßung mit Namen.

### Schritt 4: Die Farbwahl

Ein Klick auf eine Farbe schreibt die Auswahl in `#auswahl`:

```js
// Klick auf „Blau“
document.querySelector("#auswahl").textContent; // "Gewählt: blau"
```

Hänge **einen** Listener an `#farben`, genau wie in der Erklärung. Suche mit `event.target.closest("li")` den Eintrag und schreibe seine Farbe aus `dataset.farbe` in `#auswahl`.

Wichtig: Gib nicht jedem `<li>` einen eigenen Listener. Die Tests fügen später eine neue Farbe hinzu, und auch die muss funktionieren.
