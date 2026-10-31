## Aufgabe: Tief graben

Du schreibst drei Funktionen, die sich selbst aufrufen. Jede braucht wie in der Erklärung einen Abbruch und einen Selbstaufruf mit einer kleineren Aufgabe. Die Tests prüfen, ob sich die Funktionen wirklich selbst aufrufen.

### Schritt 1: Die Fakultät

Die Fakultät von 5 ist 1 · 2 · 3 · 4 · 5, also 120:

```js
fakultaet(5); // 120
fakultaet(3); // 6
fakultaet(1); // 1
fakultaet(0); // 1
```

So gehst du vor:

1. Der Abbruch: Ist `n` kleiner oder gleich 1, gib `1` zurück.
2. Sonst gib `n * fakultaet(n - 1)` zurück.

### Schritt 2: Zahlen in Listen in Listen

`tiefeSumme(liste)` zählt alle Zahlen zusammen, auch die, die in inneren Listen stecken:

```js
tiefeSumme([1, [2, 3], [4, [5]]]); // 15
tiefeSumme([1, 2, 3]);             // 6
tiefeSumme([]);                    // 0
```

So gehst du vor:

1. Lege `let summe = 0` an.
2. Gehe mit `for…of` durch die `liste`.
3. Prüfe mit `Array.isArray(element)`, ob das Element selbst eine Liste ist. Wenn ja, addiere `tiefeSumme(element)`. Wenn nein, addiere die Zahl.
4. Gib `summe` zurück.

Wie bei den Ordnern in der Erklärung ist der Abbruch schon eingebaut: Bei einer leeren Liste läuft die Schleife nicht, und es bleibt bei 0.

### Schritt 3: Die ganze Firma

In `firma` hat jede Person ein Array `team` mit den Leuten, die ihr unterstellt sind. Diese haben wieder ein `team`, und so weiter. `zaehleMitarbeiter(person)` zählt die Person selbst und alle darunter:

```js
zaehleMitarbeiter(firma);                      // 6
zaehleMitarbeiter(firma.team[1]);              // 4
zaehleMitarbeiter({ name: "Solo", team: [] }); // 1
```

Unter Lea stehen Tom, Ben und Mia. Mit Lea selbst sind das 4.

So gehst du vor:

1. Lege `let anzahl = 1` an. Die 1 steht für die Person selbst.
2. Gehe durch `person.team` und addiere für jedes Teammitglied `zaehleMitarbeiter(mitglied)`.
3. Gib `anzahl` zurück.

Genau so hat `alleDateien` in der Erklärung die Ordner gezählt.
