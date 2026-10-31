## Aufgabe: Kopie oder Link?

Im Editor gibt es ein Objekt `original` mit 5 Punkten. Du sorgst dafür, dass es nicht aus Versehen verändert wird, und schreibst zwei Funktionen: eine, die ein Objekt verändert, und eine, die es in Ruhe lässt.

### Schritt 1: Eine echte Kopie

Im Editor steht `const kopie = original;`. Danach wird `kopie.punkte` auf 100 gesetzt. Weil `kopie` aber nur ein zweiter Name ist, landen die 100 Punkte auch bei `original`.

Ändere die Zeile so, dass `kopie` eine echte Kopie wird. Danach soll gelten:

```js
original.punkte; // 5
kopie.punkte;    // 100
```

Du brauchst dafür die drei Punkte `...` aus der Erklärung.

### Schritt 2: Das Objekt selbst verändern

Schreibe `plusEins(obj)`. Sie erhöht die `punkte` im übergebenen Objekt um 1. Sie gibt nichts zurück, sondern ändert das Objekt direkt:

```js
const lea = { name: "Lea", punkte: 1 };
plusEins(lea);
lea.punkte; // 2
```

### Schritt 3: Ein neues Objekt zurückgeben

Schreibe `plusEinsKopie(obj)`. Diesmal bleibt das Original unverändert. Die Funktion gibt ein **neues** Objekt zurück, in dem die Punkte um 1 höher sind:

```js
const lea = { name: "Lea", punkte: 1 };
const neu = plusEinsKopie(lea);
neu.punkte; // 2
lea.punkte; // 1
```

So gehst du vor:

1. Mach mit `{ ...obj }` eine Kopie.
2. Erhöhe die Punkte in der Kopie.
3. Gib die Kopie mit `return` zurück.

Wichtig: Ändere nur die Kopie, nie `obj` selbst.
