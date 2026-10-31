## Aufgabe: Der Lieferdienst

Bei einem Lieferdienst kommen Bestellungen mal vollständig, mal mit Lücken an. Im Editor stehen zwei Beispiele: `komplett` und `lueckenhaft`. Du schreibst drei Funktionen, die mit beiden klarkommen, ohne abzustürzen.

### Schritt 1: Die Stadt

`stadtVon(bestellung)` gibt die Stadt aus `kunde.adresse.stadt` zurück. Fehlt unterwegs etwas, kommt `"unbekannt"` heraus:

```js
stadtVon(komplett);    // "Erlangen"
stadtVon(lueckenhaft); // "unbekannt"
stadtVon({});          // "unbekannt"
```

Wichtig: Auch `kunde` kann fehlen, wie beim letzten Beispiel. Setze deshalb vor jeden Schritt ein `?.`.

### Schritt 2: Der Rabatt

`rabattVon(bestellung)` gibt den `rabatt` zurück. Fehlt er, gibt es 10 Prozent:

```js
rabattVon(komplett);       // 0
rabattVon(lueckenhaft);    // 10
rabattVon({ rabatt: 25 }); // 25
```

Wichtig: Bei `komplett` ist der Rabatt 0. Das ist ein echter Wert und muss 0 bleiben. Nimm deshalb `??`, nicht `||`.

### Schritt 3: Die Anzahl der Artikel

`anzahlArtikel(bestellung)` gibt zurück, wie viele Einträge im Array `artikel` stehen. Gibt es gar keine `artikel`, kommt 0 heraus:

```js
anzahlArtikel(komplett);    // 2
anzahlArtikel(lueckenhaft); // 0
```

Kombiniere `?.` mit `length` und einem Ersatzwert.
