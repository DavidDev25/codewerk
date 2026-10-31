## Eine Funktion ist eine kleine Maschine

Manche Dinge braucht ein Programm immer wieder, zum Beispiel eine Zahl verdoppeln oder einen Gruß bauen. Damit du den Code dafür nicht jedes Mal neu schreibst, packst du ihn in eine **Funktion**. Eine Funktion bekommt etwas hinein und gibt ein Ergebnis zurück.

:::alltag
Denk an einen Mixer. Du wirfst Obst hinein, drückst den Knopf und bekommst Saft heraus. Wie das Mixen funktioniert, musst du nicht jedes Mal neu überlegen.
:::

## Eine Funktion schreiben und benutzen

So sieht eine Funktion aus, die eine Zahl verdoppelt:

```js
function verdoppeln(zahl) {
  return zahl * 2;
}

console.log(verdoppeln(4));
```

Die Ausgabe ist 8. Die einzelnen Teile:

- `function verdoppeln` gibt der Funktion einen Namen.
- `zahl` in den runden Klammern ist die Eingabe. Man nennt sie **Parameter**.
- `return` gibt das Ergebnis zurück.
- `verdoppeln(4)` **ruft** die Funktion auf. Dabei wird `zahl` zu 4.

Eine Funktion kann auch mehrere Eingaben haben. Du trennst sie mit Kommas:

```js
function addiere(a, b) {
  return a + b;
}

console.log(addiere(2, 3));
```

Die Ausgabe ist 5.

## Ohne return kommt nichts zurück

Ein häufiger Fehler: Die Funktion rechnet zwar, gibt aber nichts zurück.

```js
function vergesslich(zahl) {
  zahl * 2;
}

console.log(vergesslich(4));
```

Die Ausgabe ist `undefined`. Die Funktion hat 8 ausgerechnet, das Ergebnis aber nicht mit `return` herausgegeben. Es geht verloren.

Auch `console.log` in einer Funktion ersetzt kein `return`. `console.log` zeigt einen Wert nur an. Mit dem Ergebnis weiterrechnen kannst du nur, wenn die Funktion es mit `return` zurückgibt.
