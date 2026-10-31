## Aufgabe: Das Anmeldeformular prüft genauer

Ein Anmeldeformular soll falsche Eingaben freundlich melden, aber echte Programmfehler nicht verstecken. Du baust dafür eine eigene Fehlerart und drei Funktionen, die sie benutzen.

### Schritt 1: Die Fehlerart

```js
const f = new EingabeFehler("email", "Da fehlt das @.");
f.message; // "Da fehlt das @."
f.name;    // "EingabeFehler"
f.feld;    // "email"
```

So gehst du vor:

1. Schreibe `class EingabeFehler extends Error`.
2. Schreibe einen `constructor(feld, nachricht)`. Rufe darin zuerst `super(nachricht)` auf.
3. Setze danach `this.name` auf `"EingabeFehler"` und speichere `this.feld`.

Das ist genau die Klasse aus der Erklärung.

### Schritt 2: Das Alter prüfen

`alterPruefen(text)` macht aus einem Text eine Zahl. Bei Unsinn wirft sie einen `EingabeFehler`:

```js
alterPruefen("42");      // 42
alterPruefen("vierzig"); // EingabeFehler: Bitte eine Zahl eingeben.
alterPruefen("-3");      // EingabeFehler: Das Alter kann nicht negativ sein.
```

So gehst du vor:

1. Wandle den Text mit `Number(text)` in eine Zahl um.
2. Ist das Ergebnis keine Zahl, wirf `new EingabeFehler("alter", "Bitte eine Zahl eingeben.")`. Das prüfst du mit `Number.isNaN(zahl)`.
3. Ist die Zahl kleiner als 0, wirf `new EingabeFehler("alter", "Das Alter kann nicht negativ sein.")`.
4. Sonst gib die Zahl zurück.

### Schritt 3: Das Profil lesen

`profilLesen(json)` gibt das Objekt aus einem JSON-Text zurück:

```js
profilLesen('{"name":"Lea"}'); // { name: "Lea" }
profilLesen("{kaputt");        // Error: Profil beschädigt
```

So gehst du vor:

1. Gib im `try`-Block `JSON.parse(json)` zurück.
2. Wirf im `catch (fehler)`-Block einen neuen Fehler mit der Meldung `"Profil beschädigt"`. Gib den alten Fehler als Ursache mit: `{ cause: fehler }`.

### Schritt 4: Sicher ausführen

`sicher(fn)` ruft `fn()` auf und gibt immer ein Objekt zurück, das sagt, wie es gelaufen ist:

```js
sicher(() => alterPruefen("7")); // { ok: true, wert: 7 }
sicher(() => alterPruefen("x")); // { ok: false, feld: "alter", nachricht: "Bitte eine Zahl eingeben." }
```

So gehst du vor:

1. Rufe im `try`-Block `fn()` auf und gib `{ ok: true, wert: ... }` mit dem Ergebnis zurück.
2. Prüfe im `catch (fehler)`-Block mit `instanceof`, ob es ein `EingabeFehler` ist. Wenn ja, gib `{ ok: false, feld: ..., nachricht: ... }` zurück.
3. Jeden anderen Fehler wirfst du mit `throw fehler;` unverändert weiter.

Wichtig: Schritt 3 darfst du nicht weglassen. Sonst verschluckt `sicher` auch echte Programmfehler, und niemand bemerkt sie.
