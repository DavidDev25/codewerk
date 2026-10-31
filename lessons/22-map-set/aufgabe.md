## Aufgabe: Die Umfrage

Deine Freunde haben abgestimmt, was ihr am Wochenende macht. Im Editor steht das Array `antworten` mit allen Stimmen. Du findest heraus, welche Möglichkeiten es gibt und welche gewonnen hat.

### Schritt 1: Die Möglichkeiten

`optionen` enthält jede Antwort genau **einmal**:

```js
optionen; // ["Kino", "Bowling", "Picknick"]
```

Nimm den Trick aus der Erklärung. Stecke `antworten` in ein `new Set(...)` und mache das Set mit `[...]` wieder zu einer Liste.

### Schritt 2: Die Zählfunktion

`zaehlen(liste)` gibt eine **Map** zurück. Darin steht für jeden Eintrag, wie oft er vorkommt:

```js
const z = zaehlen(["x", "y", "x"]);
z.get("x");       // 2
z.get("y");       // 1
zaehlen([]).size; // 0
```

So gehst du vor:

1. Lege in der Funktion mit `new Map()` eine leere Map an, zum Beispiel `zaehler`.
2. Gehe mit `for…of` durch die `liste`.
3. Erhöhe für jeden Eintrag den Zähler: `zaehler.set(eintrag, (zaehler.get(eintrag) ?? 0) + 1)`.
4. Gib die Map am Ende zurück.

Wichtig: Benutze in der Funktion `liste`, nicht `antworten`. Sonst zählt sie immer nur die Umfrage.

### Schritt 3: Das Ergebnis der Umfrage

```js
ergebnis.get("Kino");     // 3
ergebnis.get("Bowling");  // 2
ergebnis.get("Picknick"); // 1
```

Rufe `zaehlen` mit `antworten` auf und speichere das Ergebnis in `ergebnis`.

### Schritt 4: Der Gewinner

`beliebteste(liste)` gibt den Eintrag zurück, der am häufigsten vorkommt:

```js
beliebteste(antworten);                   // "Kino"
beliebteste(["Tee", "Kaffee", "Kaffee"]); // "Kaffee"
```

So gehst du vor:

1. Zähle mit `zaehlen(liste)`.
2. Lege mit `let` zwei Variablen an: `gewinner` und `meiste` mit dem Wert `0`.
3. Gehe mit `for (const [eintrag, anzahl] of ...)` durch die Map.
4. Ist `anzahl` größer als `meiste`, merkst du dir `eintrag` als neuen Gewinner und `anzahl` als neue Höchstzahl.
5. Gib am Ende `gewinner` zurück.
