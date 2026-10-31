## Aufgabe: Die Zeugniskonferenz

In der Zeugniskonferenz liegen die Noten einer Klasse auf dem Tisch. Im Editor stehen schon `noten` und `zeile`. Du beantwortest sechs Fragen, jede mit einer Methode aus der Erklärung. Eine `for`-Schleife brauchst du nicht, und die Tests prüfen, dass keine dabei ist.

### Schritt 1: Haben alle bestanden?

Bestanden hat, wer höchstens eine 4 hat:

```js
alleBestanden; // false
```

Nimm `every` und prüfe, ob jede Note `<= 4` ist. Weil eine 5 und eine 10 dabei sind, kommt `false` heraus.

### Schritt 2: Gibt es eine Eins?

```js
einserDabei; // true
```

Nimm `some` und prüfe, ob eine Note gleich 1 ist.

### Schritt 3: Die Noten sortiert

```js
sortiert; // [1, 1, 2, 2, 3, 5, 10]
noten;    // [2, 1, 3, 2, 5, 1, 10]
```

`noten` soll danach unverändert sein. So gehst du vor:

1. Mache mit `[...noten]` eine Kopie.
2. Sortiere die Kopie mit `sort((a, b) => a - b)`.

Wichtig: Ohne Vergleichsfunktion steht die 10 vor der 2, weil `sort` dann wie Text sortiert. Und ohne Kopie sortiert `sort` die Liste `noten` selbst um.

### Schritt 4: Wo steht die Fünf?

```js
positionFuenf; // 4
```

Nimm `indexOf`. Denk daran, dass ab 0 gezählt wird.

### Schritt 5: Namen aus dem Text

```js
namen; // ["Lea", "Tom", "Ben"]
```

Zerlege `zeile` mit `split`. Geschnitten wird an `", "`, also an Komma **und** Leerzeichen.

### Schritt 6: Wieder ein Text

```js
liste; // "Lea und Tom und Ben"
```

Klebe `namen` mit `join` zusammen. Zwischen die Namen kommt `" und "`, mit je einem Leerzeichen davor und danach.
