## Aufgabe: Das Vereinsprofil

Im Editor stehen schon ein Objekt `nutzer` und ein Array `punkte`. Du packst Werte aus, baust ein neues Profil und schreibst zwei Funktionen.

### Schritt 1: Name und Stadt auspacken

Hol `name` und `stadt` mit Destructuring aus `nutzer`, in einer einzigen Zeile:

```js
name;  // "Mara"
stadt; // "Nürnberg"
```

Nimm dafür geschweifte Klammern links vom `=`.

### Schritt 2: Die ersten beiden Punktzahlen

Hol die ersten beiden Werte aus `punkte` in die Variablen `erster` und `zweiter`:

```js
erster;  // 12
zweiter; // 7
```

Bei Arrays nimmst du eckige Klammern.

### Schritt 3: Der Umzug

Lege `const umgezogen` an. Es ist eine Kopie von `nutzer`, aber mit der Stadt `"Fürth"`:

```js
umgezogen.stadt; // "Fürth"
umgezogen.name;  // "Mara"
nutzer.stadt;    // "Nürnberg"
```

Wichtig: `nutzer` selbst bleibt unverändert. Baue ein neues Objekt mit `...nutzer` und überschreibe dahinter die Stadt.

### Schritt 4: Beliebig viele Zahlen addieren

Schreibe `summe(...zahlen)`. Sie bekommt beliebig viele Zahlen und gibt ihre Summe zurück:

```js
summe(1, 2, 3);       // 6
summe(10, 20, 30, 40); // 100
summe();              // 0
```

Durch `...zahlen` ist `zahlen` in der Funktion ein Array. Zähl es mit einer Schleife zusammen, so wie in Lektion 10.

### Schritt 5: Sich vorstellen

Schreibe `vorstellen` als Arrow-Funktion. Sie bekommt ein Objekt und packt `name` und `alter` direkt bei den Eingaben aus:

```js
vorstellen({ name: "Ali", alter: 25 }); // "Ali ist 25."
```

Die Eingabe schreibst du als `({ name, alter })`.
