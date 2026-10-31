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
