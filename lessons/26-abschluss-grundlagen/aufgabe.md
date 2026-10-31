## Aufgabe: Das Klassenbuch

Im Editor steht die Liste `klasse`. Jeder Eintrag hat einen `name` und ein Array `noten`. Du baust fünf kleine Funktionen. Die späteren benutzen die früheren. Schreibe sie deshalb der Reihe nach und teste jede einzeln.

### Schritt 1: Der Durchschnitt

```js
durchschnitt([1, 2, 2]);    // 1.7
durchschnitt([3, 4, 3, 2]); // 3
```

So gehst du vor:

1. Zähle die Noten mit `reduce` zusammen.
2. Teile die Summe durch `noten.length`.
3. Runde auf eine Nachkommastelle: `Math.round(wert * 10) / 10`.

### Schritt 2: Die Bewertung

`bewertung(schnitt)` gibt das passende Wort zum Durchschnitt zurück:

| Durchschnitt | Wort |
| --- | --- |
| bis 1.5 | `"sehr gut"` |
| bis 2.5 | `"gut"` |
| bis 3.5 | `"befriedigend"` |
| bis 4.5 | `"ausreichend"` |
| darüber | `"nicht bestanden"` |

```js
bewertung(1.5); // "sehr gut"
bewertung(1.6); // "gut"
bewertung(4.6); // "nicht bestanden"
```

Schreibe eine Kette aus `if`, `else if` und `else`. Prüfe dabei von der besten Note zur schlechtesten.

Wichtig: Bei „bis 1.5“ gehört 1.5 noch dazu. Nimm deshalb `<=` und nicht `<`.

### Schritt 3: Das Zeugnis

`zeugnis(klasse)` gibt für jede Person eine Zeile zurück:

```js
zeugnis(klasse);
// ["Lea: 1.7 (gut)", "Tom: 3 (befriedigend)", "Ben: 4.7 (nicht bestanden)", "Mia: 1.3 (sehr gut)"]
```

So gehst du vor:

1. Gehe mit `map` durch `klasse`. Mit `({ name, noten })` packst du jede Person direkt aus.
2. Rechne mit `durchschnitt(noten)` den Schnitt aus.
3. Baue die Zeile mit einem Template-String: Name, Doppelpunkt, Schnitt und dahinter die Bewertung in Klammern.

### Schritt 4: Der beste Schnitt

`bester(klasse)` gibt den **Namen** der Person mit dem kleinsten Durchschnitt zurück:

```js
bester(klasse); // "Mia"
```

So gehst du vor:

1. Mache mit `[...klasse]` eine Kopie.
2. Sortiere die Kopie mit `sort`. Vergleiche dabei `durchschnitt(a.noten) - durchschnitt(b.noten)`.
3. Gib den Namen der ersten Person zurück.

Wichtig: Sortiere nicht `klasse` selbst. Sonst steht danach Mia vorne, und die Reihenfolge der Klasse ist durcheinander.

### Schritt 5: Der Notenspiegel

`notenSpiegel(klasse)` zählt, wie oft jede einzelne Note in der ganzen Klasse vorkommt:

```js
notenSpiegel(klasse); // { 1: 4, 2: 4, 3: 2, 4: 2, 5: 2 }
```

Die 1 kommt viermal vor: einmal bei Lea und dreimal bei Mia.

So gehst du vor:

1. Lege ein leeres Objekt `spiegel` an.
2. Gehe mit einer Schleife durch alle Personen und darin mit einer zweiten Schleife durch ihre Noten.
3. Zähle jede Note: `spiegel[note] = (spiegel[note] ?? 0) + 1`.
4. Gib `spiegel` zurück.

Noten, die nie vorkommen, tauchen im Objekt gar nicht auf.
