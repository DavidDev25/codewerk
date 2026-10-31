## Warten, ohne dass alles stehen bleibt

In Lektion 42 hast du Ergebnisse mit `.then(…)` abgeholt. Das funktioniert, wird aber schnell unübersichtlich, wenn mehrere Schritte nacheinander warten müssen. Mit `async` und `await` liest sich solcher Code wie ganz normaler Code, von oben nach unten.

:::alltag
Beim Nudelkochen nach Rezept setzt du Wasser auf und **wartest**, bis es kocht. Dann kommen die Nudeln hinein, und du **wartest** wieder zehn Minuten. Erst danach gießt du ab. Jeder Schritt wartet auf den vorherigen. Während das Wasser heiß wird, kannst du in der Küche aber trotzdem etwas anderes tun.
:::

Im Beispiel kocht die Funktion `nudelnKochen` Schritt für Schritt. Draußen wird währenddessen der Tisch gedeckt:

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

Ausgegeben wird zuerst „Wasser aufsetzen“, dann „Tisch decken“, dann die beiden Nudel-Schritte. Beim ersten `await` pausiert `nudelnKochen`. Das restliche Programm läuft weiter und deckt den Tisch. Nach 300 Millisekunden macht die Funktion genau dort weiter, wo sie aufgehört hat.

- `async` vor einer Funktion macht sie zu einer **asynchronen Funktion**. Sie gibt immer ein Promise zurück.
- `await` geht nur **innerhalb** einer `async`-Funktion. Es wartet, bis das Promise erfüllt ist, und liefert dessen Ergebnis.
- Außerhalb der Funktion läuft das Programm weiter. Deshalb steht „Tisch decken“ schon an zweiter Stelle.

## Ergebnisse weitergeben und Fehler abfangen

Mit `await` landet das Ergebnis eines Promise direkt in einer Variable. Im Beispiel wird gewürfelt. Bei einer 1 wird das Promise abgelehnt:

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

Meistens erscheint etwas wie „Gewürfelt: 4“. Würfelst du eine 1, erscheint „Abgefangen: Pech: eine 1!“. Probier das Beispiel ein paar Mal aus.

- In `const wurf = await wuerfeln();` landet die gewürfelte Zahl direkt in `wurf`.
- Wird das Promise **abgelehnt**, wirft `await` den Fehler. Mit `try` und `catch` fängst du ihn ab, genau wie in Lektion 39.
- Eine `async`-Funktion kann mit `return` ein Ergebnis liefern. Wer sie aufruft, bekommt es mit `await` oder `.then(…)`.
