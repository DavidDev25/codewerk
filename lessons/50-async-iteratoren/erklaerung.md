## Generatoren, die warten können

In Lektion 49 haben Generatoren Werte auf Abruf geliefert, aber immer sofort. Manchmal muss jeder Wert aber erst aus dem Netz geholt werden. Dann kombinierst du `async` und `function*`. Im Beispiel holt ein Generator drei Nutzer, einen nach dem anderen:

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

Ausgegeben werden „Mara“, „Ali“ und „Lea“. Jeder Name erscheint, sobald seine Antwort da ist.

- `async function*` darf `await` **und** `yield` benutzen.
- `for await (… of …)` wartet bei jedem Durchlauf, bis der nächste Wert da ist.

:::alltag
Denk an eine Fernsehserie, die jede Woche eine neue Folge bekommt. Du schaust Folge für Folge, sobald sie erscheint, statt auf die ganze Staffel zu warten.
:::

Typischer Einsatz ist das **seitenweise Laden**. Viele Server liefern Daten in Häppchen. Der Generator holt so lange die nächste Seite, bis keine mehr kommt. Der Code, der die Daten benutzt, merkt davon nichts. Er sieht nur eine Schleife.

Alle Werte auf einmal sammelt `Array.fromAsync`:

```js
async function* drei() {
  yield 1;
  yield 2;
  yield 3;
}

Array.fromAsync(drei()).then((liste) => console.log(liste));
```

Heraus kommt `[1, 2, 3]`. `Array.fromAsync` gibt ein Promise zurück. Deshalb holst du die Liste mit `.then` oder `await` ab.

## Helfer für Iteratoren

Seit 2025 haben Iteratoren eigene Methoden, ähnlich wie Arrays. Sie sind aber **faul**: Sie rechnen nur so viel aus, wie wirklich gebraucht wird. Damit kannst du sogar unendliche Generatoren verarbeiten. Im Beispiel suchst du aus allen Zahlen ab 1 die ersten vier, die durch 3 teilbar sind, und nimmst sie mal 10:

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

Heraus kommt `[30, 60, 90, 120]`. Der Generator hört nie auf. Aber `take(4)` sagt Schluss, sobald vier Werte da sind. Bis dahin hat der Generator nur die Zahlen von 1 bis 12 erzeugt.

| Methode | Bedeutung |
| --- | --- |
| `map`, `filter` | wie bei Arrays, aber Wert für Wert |
| `take(n)` | höchstens n Werte, dann Schluss |
| `drop(n)` | die ersten n Werte überspringen |
| `toArray()` | alles Übrige in einem Array sammeln |
| `find`, `some`, `every`, `reduce` | wie bei Arrays |

Ohne `take` würde `toArray()` bei einem unendlichen Generator nie fertig. Die Reihenfolge ist also wichtig: erst begrenzen, dann sammeln.
