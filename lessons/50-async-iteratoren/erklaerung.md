## Generatoren, die warten können

In Lektion 49 haben Generatoren Werte auf Abruf geliefert, aber immer sofort. Was, wenn jeder Wert erst aus dem Netz geholt werden muss? Dann kombinierst du `async` und `function*`:

```js
async function* nutzerNachUndNach() {
  for (let id = 1; id <= 3; id++) {
    const antwort = await fetch(`/uebung/nutzer/${id}`);
    yield await antwort.json();
  }
}

async function zeigen() {
  for await (const nutzer of nutzerNachUndNach()) {
    console.log(nutzer.name);
  }
}

zeigen();
```

- `async function*` darf `await` **und** `yield` benutzen.
- `for await (… of …)` wartet bei jedem Durchlauf, bis der nächste Wert da ist.

:::alltag
Wie eine Fernsehserie, die wöchentlich erscheint: Du schaust Folge für Folge, sobald sie verfügbar ist, statt auf die ganze Staffel zu warten.
:::

Typischer Einsatz ist das **Seitenweise Laden** (Paginierung): Viele Server liefern Daten in Häppchen, und der Generator holt so lange die nächste Seite, bis keine mehr kommt. Der Code, der die Daten benutzt, merkt davon nichts und sieht nur eine Schleife.

Alle Werte auf einmal sammelt `Array.fromAsync`:

```js
async function* drei() {
  yield 1;
  yield 2;
  yield 3;
}

Array.fromAsync(drei()).then((liste) => console.log(liste));
```

## Iterator-Helfer

Seit 2025 haben Iteratoren eigene Methoden, ähnlich wie Arrays, aber **faul**: Sie berechnen nur so viel, wie wirklich gebraucht wird. Damit kannst du sogar unendliche Generatoren verarbeiten:

```js
function* zahlenAb(start) {
  let n = start;
  while (true) {
    yield n;
    n++;
  }
}

const ergebnis = zahlenAb(1)
  .filter((n) => n % 3 === 0)
  .map((n) => n * 10)
  .take(4)
  .toArray();

console.log(ergebnis);
```

| Methode | Bedeutung |
| --- | --- |
| `map`, `filter` | wie bei Arrays, aber Wert für Wert |
| `take(n)` | höchstens n Werte, dann Schluss |
| `drop(n)` | die ersten n Werte überspringen |
| `toArray()` | alles Übrige in ein Array sammeln |
| `find`, `some`, `every`, `reduce` | wie bei Arrays |

Ohne `take` würde `toArray()` bei einem unendlichen Generator nie fertig. Die Reihenfolge ist also wichtig: erst begrenzen, dann sammeln.
