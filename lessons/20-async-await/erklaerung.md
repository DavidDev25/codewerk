## Warten, ohne dass alles stehen bleibt

In Lektion 19 hast du Ergebnisse mit `.then(…)` abgeholt. Das funktioniert, wird aber schnell unübersichtlich, wenn mehrere Schritte nacheinander warten müssen. Mit `async` und `await` liest sich asynchroner Code wie ganz normaler Code – von oben nach unten.

:::alltag
Beim Nudelkochen nach Rezept: Du setzt Wasser auf und **wartest**, bis es kocht. Dann kommen die Nudeln rein und du **wartest** wieder 10 Minuten. Erst danach gießt du ab. Jeder Schritt wartet auf den vorherigen – aber während das Wasser heiß wird, kannst du in der Küche trotzdem etwas anderes tun.
:::

```js
function warten(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function nudelnKochen() {
  console.log("Wasser aufsetzen");
  await warten(300);
  console.log("Wasser kocht – Nudeln rein");
  await warten(300);
  console.log("Abgießen, fertig!");
}

nudelnKochen();
console.log("Tisch decken");
```

- `async` vor einer Funktion macht sie zu einer **asynchronen Funktion**. Sie gibt immer ein Promise zurück.
- `await` geht nur **innerhalb** einer `async`-Funktion. Es wartet, bis das Promise erfüllt ist, und liefert dessen Ergebnis.
- Draußen läuft das Programm weiter – deshalb steht „Tisch decken“ schon an zweiter Stelle.

## Ergebnisse weitergeben und Fehler abfangen

```js
function wuerfeln() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const zahl = Math.floor(Math.random() * 6) + 1;
      if (zahl === 1) reject(new Error("Pech: eine 1!"));
      else resolve(zahl);
    }, 200);
  });
}

async function spielen() {
  try {
    const wurf = await wuerfeln();
    console.log("Gewürfelt: " + wurf);
  } catch (fehler) {
    console.log("Abgefangen: " + fehler.message);
  }
}

spielen();
```

- `const wurf = await wuerfeln();` – das Ergebnis des Promises landet direkt in der Variablen.
- Wird das Promise **abgelehnt**, wirft `await` den Fehler. Mit `try … catch` fängst du ihn ab – genau wie in Lektion 16.
- Eine `async`-Funktion kann mit `return` ein Ergebnis liefern. Wer sie aufruft, bekommt es mit `await` oder `.then(…)`.

Probiere das zweite Beispiel ein paar Mal aus – manchmal würfelst du eine 1.
