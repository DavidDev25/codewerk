## Aufgabe: Das Server-Logbuch

Im Editor steht das Array `log` mit den Zeilen einer Nacht. Darunter sind auch eine kaputte Zeile, eine leere Zeile und eine Zeile mit der unbekannten Stufe `DEBUG`. Du baust vier Funktionen, eine auf der anderen.

### Schritt 1: Eine Zeile lesen

`zeileLesen(zeile)` macht aus einer Zeile ein Objekt. Passt die Zeile nicht, kommt `null` heraus:

```js
zeileLesen("2026-10-31 02:15 FEHLER Datenbank nicht erreichbar");
// { datum: "2026-10-31", zeit: "02:15", stufe: "FEHLER", text: "Datenbank nicht erreichbar" }
zeileLesen("kaputte Zeile ohne Format");             // null
zeileLesen("2026-10-31 02:41 DEBUG zu viele Details"); // null
```

So gehst du vor:

1. Nimm das Muster aus der Erklärung. Ersetze die dritte Gruppe durch `(INFO|WARNUNG|FEHLER)`. Der senkrechte Strich bedeutet „oder“.
2. Ist das Ergebnis von `match` gleich `null`, gib `null` zurück.
3. Sonst packe die Teile mit Destructuring aus und gib `{ datum, zeit, stufe, text }` zurück.

### Schritt 2: Nur die Fehler

`nurFehler(zeilen)` ist ein **Generator**. Er liefert nacheinander die gelesenen Objekte aller Fehler:

```js
[...nurFehler(log)].map((f) => f.text); // ["Datenbank nicht erreichbar", "Speicher voll"]
```

So gehst du vor:

1. Schreibe `function* nurFehler(zeilen)`.
2. Lies in einer `for…of`-Schleife jede Zeile mit `zeileLesen`.
3. Ist das Ergebnis nicht `null` und die Stufe `"FEHLER"`, gib es mit `yield` heraus.

### Schritt 3: Stufen zählen

```js
zaehleStufen(log); // { INFO: 3, FEHLER: 2, WARNUNG: 1 }
```

Lege ein leeres Objekt an. Lies jede Zeile mit `zeileLesen`, überspringe `null` und zähle die Stufe: `zaehler[stufe] = (zaehler[stufe] ?? 0) + 1`.

Kaputte Zeilen und `DEBUG` zählen nicht mit. Das erledigt `zeileLesen` schon für dich.

### Schritt 4: Der Bericht

```js
bericht(log);  // "2 Fehler, zuletzt am 31. Oktober 2026 um 02:40: Speicher voll"
bericht([]);   // "Keine Fehler"
```

So gehst du vor:

1. Sammle mit `[...nurFehler(zeilen)]` alle Fehler in einer Liste.
2. Ist die Liste leer, gib `"Keine Fehler"` zurück.
3. Nimm sonst den letzten Fehler mit `.at(-1)`.
4. Schreibe sein Datum mit `Intl.DateTimeFormat`, `dateStyle: "long"` und `timeZone: "UTC"` aus, genau wie in Lektion 52.
5. Baue mit einem Template-String den Text aus Anzahl, Datum, Uhrzeit und Nachricht.
