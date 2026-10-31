## Eine Schleife wiederholt Arbeit

Programme müssen oft dieselbe Arbeit viele Male erledigen, zum Beispiel jeden Namen in einer Liste begrüßen. Dafür schreibst du den Code nicht zehnmal hin, sondern einmal in eine **Schleife**.

:::alltag
Du sollst 10 Briefe frankieren. Du schreibst dir nicht 10 Anleitungen. Du sagst: „Nimm jeden Brief aus dem Stapel und klebe eine Marke drauf.“
:::

## Jeden Eintrag einer Liste durchgehen

Die einfachste Schleife nimmt sich jeden Eintrag eines Arrays der Reihe nach vor:

```js
const namen = ["Mara", "Jonas", "Lea"];

for (const name of namen) {
  console.log("Hallo " + name);
}
```

Die Ausgabe ist dreimal ein Gruß: an Mara, Jonas und Lea. Bei jeder Runde steht in `name` der nächste Eintrag der Liste.

## Eine Schleife mit Zähler

Willst du eine bestimmte Anzahl von Runden, nimmst du einen Zähler:

```js
for (let i = 1; i <= 3; i++) {
  console.log("Runde " + i);
}
```

Die Ausgabe ist `Runde 1`, `Runde 2` und `Runde 3`. In den runden Klammern stehen drei Teile, getrennt durch Semikolons:

1. `let i = 1` legt den Zähler an und startet bei 1.
2. `i <= 3` ist die Bedingung. Solange sie stimmt, läuft die Schleife weiter.
3. `i++` erhöht den Zähler nach jeder Runde um 1.

## Ein Ergebnis sammeln

Willst du zum Beispiel alles zusammenzählen, legst du die Variable für das Ergebnis **vor** der Schleife an:

```js
let summe = 0;
for (const zahl of [4, 5, 6]) {
  summe += zahl;
}
console.log(summe);
```

Die Ausgabe ist 15. In jeder Runde kommt eine Zahl dazu: 0 + 4, dann + 5, dann + 6. Stünde `let summe = 0` in der Schleife, würde sie in jeder Runde wieder auf 0 gesetzt.

## Wiederholen, solange etwas gilt: while

Manchmal weißt du vorher nicht, wie viele Runden es werden. Dann nimmst du `while`. Die Schleife läuft, solange die Bedingung stimmt:

```js
let guthaben = 100;
let monate = 0;
while (guthaben < 150) {
  guthaben = guthaben * 1.1;
  monate++;
}
console.log(`Nach ${monate} Monaten sind es ${Math.round(guthaben)} €.`);
```

Die Ausgabe ist `Nach 5 Monaten sind es 161 €.` Jeden Monat wächst das Guthaben um 10 Prozent. Sobald es 150 erreicht, ist die Bedingung falsch und die Schleife hört auf.

:::alltag
Vorsicht: Wird die Bedingung nie falsch, läuft die Schleife endlos. Achte darauf, dass sich in der Schleife etwas ändert, das sie irgendwann beendet. Codewerk hält endlose Schleifen nach ein paar Sekunden an.
:::

## Früher aufhören und überspringen

Zwei Wörter steuern eine Schleife von innen:

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
```

Die Ausgabe ist 3, 8 und dann der Satz. Die 5 kommt nie dran, weil die Schleife bei der -2 abbricht.

```js
for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log("ungerade:", i);
}
```

Die Ausgabe sind die ungeraden Zahlen 1, 3 und 5. Bei jeder geraden Zahl springt `continue` direkt in die nächste Runde.

In einer Funktion kannst du statt `break` auch mit `return` aussteigen. Das beendet die Schleife und die ganze Funktion.
