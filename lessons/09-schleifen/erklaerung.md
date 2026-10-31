## Eine Schleife wiederholt Arbeit

:::alltag
Du sollst 10 Briefe frankieren. Du schreibst dir nicht 10 Anleitungen. Du sagst: „Nimm jeden Brief aus dem Stapel und klebe eine Marke drauf.“
:::

Die einfachste Schleife geht eine Liste Stück für Stück durch:

```js
const namen = ["Mara", "Jonas", "Lea"];

for (const name of namen) {
  console.log("Hallo " + name);
}
```

Eine Schleife mit Zähler:

```js
for (let i = 1; i <= 3; i++) {
  console.log("Runde " + i);
}
```

Ein Ergebnis sammelst du in einer Variable außerhalb der Schleife:

```js
let summe = 0;
for (const zahl of [4, 5, 6]) {
  summe += zahl;
}
console.log(summe);
```

## Wiederholen, solange etwas gilt: while

Manchmal weißt du vorher nicht, wie oft wiederholt werden muss. Dann nimmst du `while`: Die Schleife läuft, **solange** die Bedingung stimmt.

```js
let guthaben = 100;
let monate = 0;
while (guthaben < 150) {
  guthaben = guthaben * 1.1;
  monate++;
}
console.log(`Nach ${monate} Monaten sind es ${Math.round(guthaben)} €.`);
```

:::alltag
Vorsicht: Wird die Bedingung nie falsch, läuft die Schleife endlos. Achte darauf, dass sich in der Schleife etwas ändert, das sie irgendwann beendet. Codewerk hält endlose Schleifen nach 5 Sekunden an.
:::

## Früher aufhören und überspringen

- `break` beendet die Schleife sofort.
- `continue` überspringt den Rest dieser Runde und macht mit der nächsten weiter.

```js
for (const zahl of [3, 8, -2, 5]) {
  if (zahl < 0) {
    console.log("Negative Zahl gefunden, Schluss.");
    break;
  }
  console.log(zahl);
}

for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log("ungerade:", i);
}
```

In einer Funktion kannst du statt `break` auch direkt mit `return` aussteigen. Das beendet Schleife **und** Funktion.
