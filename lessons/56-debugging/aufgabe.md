## Aufgabe: Vier versteckte Fehler

Im Editor steht Code von jemand anderem. Jede der vier Funktionen hat **genau einen** Fehler. Finde ihn und repariere ihn. Schreibe die Funktionen dabei nicht neu, sondern ändere nur die kaputte Stelle. Die Tests prüfen das.

Gehe vor wie in der Erklärung: Lies, welcher Test scheitert, und mach mit `console.log` die Werte sichtbar.

### Schritt 1: Der Durchschnitt

```js
durchschnitt([2, 4, 6]); // soll 4 sein, ist aber NaN
```

Gib in der Schleife `i` und `zahlen[i]` aus. Schau dir den letzten Durchlauf genau an. Was steht dort in `zahlen[i]`?

### Schritt 2: Der Vergleich

```js
istGleich(1, 1);   // soll true sein
istGleich(1, "1"); // soll false sein, ist aber true
```

Die Funktion soll nur `true` liefern, wenn Wert **und** Typ gleich sind. Schau dir die Zahl der Gleichheitszeichen an.

### Schritt 3: Die sortierte Kopie

```js
const liste = [3, 1, 2];
sortiertKopie(liste); // [1, 2, 3]
liste;                // soll [3, 1, 2] bleiben, ist aber umsortiert
```

`sort` verändert die Liste, auf der es aufgerufen wird. Aus Lektion 19 kennst du eine Methode, die stattdessen eine Kopie liefert.

### Schritt 4: Das letzte Element

```js
letzter(["a", "b", "c"]); // soll "c" sein, ist aber undefined
```

Bei drei Elementen sind die Positionen 0, 1 und 2. Welche Position liest die Funktion?
