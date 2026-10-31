## Mehr als Promise.all

In Lektion 45 hast du mit `Promise.all` mehrere Anfragen gleichzeitig gestartet. `all` hat aber eine harte Regel: Scheitert **eine** Anfrage, scheitert alles. Für andere Fälle gibt es drei weitere Werkzeuge.

| Werkzeug | erfüllt, sobald … | Ergebnis |
| --- | --- | --- |
| `Promise.all` | **alle** erfüllt sind (scheitert bei einem Fehler) | Array der Werte |
| `Promise.allSettled` | alle **fertig** sind, egal ob gut oder schlecht | Array von Berichten |
| `Promise.race` | das **erste** fertig ist, gut oder schlecht | dessen Wert oder Fehler |
| `Promise.any` | das erste **erfolgreich** ist | dessen Wert |

:::alltag
Du fragst drei Freunde, ob sie dir beim Umzug helfen. `all`: Du planst nur, wenn alle zusagen. `allSettled`: Du wartest auf alle Antworten und planst mit denen, die Ja sagen. `any`: Die erste Zusage reicht dir. `race`: Die erste Antwort entscheidet, auch wenn sie Nein ist.
:::

```js
async function bericht() {
  const ergebnisse = await Promise.allSettled([
    fetch("/uebung/nutzer/1").then((r) => r.json()),
    fetch("https://example.com"),
  ]);
  for (const e of ergebnisse) {
    console.log(e.status, e.status === "fulfilled" ? e.value.name : e.reason.message.slice(0, 30));
  }
}

bericht();
```

`allSettled` liefert für jedes Promise ein Objekt: `{ status: "fulfilled", value }` oder `{ status: "rejected", reason }`.

```js
async function schnellsteAntwort() {
  const r = await Promise.any([
    fetch("/uebung/langsam?ms=300").then((a) => a.json()),
    fetch("/uebung/langsam?ms=50").then((a) => a.json()),
  ]);
  console.log("Zuerst geantwortet hat", r.ms, "ms");
}

schnellsteAntwort();
```

## Anfragen abbrechen

Manchmal braucht man eine Antwort nicht mehr, etwa weil jemand schon weitergetippt hat. Mit einem `AbortController` brichst du eine laufende Anfrage ab:

```js
async function abbrechenDemo() {
  const controller = new AbortController();
  const anfrage = fetch("/uebung/langsam?ms=1000", { signal: controller.signal });
  setTimeout(() => controller.abort(), 100);
  try {
    await anfrage;
  } catch (fehler) {
    console.log("Abgebrochen:", fehler.name);
  }
}

abbrechenDemo();
```

## Zeitlimits

Ein Server kann hängen. Damit dein Programm nicht ewig wartet, gibt es ein fertiges Signal mit Zeitlimit:

```js
async function mitLimit() {
  try {
    await fetch("/uebung/langsam?ms=800", { signal: AbortSignal.timeout(200) });
  } catch (fehler) {
    console.log("Zu langsam:", fehler.name);
  }
}

mitLimit();
```

Der Fehler heißt dann `TimeoutError`, bei einem manuellen Abbruch `AbortError`. Die Übungs-API antwortet unter `/uebung/langsam?ms=…` absichtlich verzögert, höchstens 1,5 Sekunden.
