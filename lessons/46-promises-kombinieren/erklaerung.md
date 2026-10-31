## Mehr als Promise.all

In Lektion 45 hast du mit `Promise.all` mehrere Anfragen gleichzeitig gestartet. `all` hat aber eine harte Regel: Scheitert **eine** Anfrage, scheitert alles. Für andere Fälle gibt es drei weitere Werkzeuge.

| Werkzeug | erfüllt, sobald … | Ergebnis |
| --- | --- | --- |
| `Promise.all` | **alle** erfüllt sind, scheitert beim ersten Fehler | Liste der Werte |
| `Promise.allSettled` | alle **fertig** sind, egal ob gut oder schlecht | Liste von Berichten |
| `Promise.race` | das **erste** fertig ist, gut oder schlecht | dessen Wert oder Fehler |
| `Promise.any` | das erste **erfolgreich** ist | dessen Wert |

:::alltag
Du fragst drei Freunde, ob sie dir beim Umzug helfen. Bei `all` planst du nur, wenn alle zusagen. Bei `allSettled` wartest du auf alle Antworten und planst mit denen, die Ja sagen. Bei `any` reicht dir die erste Zusage. Bei `race` entscheidet die erste Antwort, auch wenn sie Nein ist.
:::

## Alle Antworten abwarten

Im Beispiel klappt eine Anfrage, die andere scheitert, weil echte Adressen gesperrt sind. Mit `allSettled` bekommst du trotzdem beide Ergebnisse:

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

Die erste Zeile zeigt „fulfilled Mara“, die zweite „rejected“ und den Anfang der Fehlermeldung. `allSettled` liefert für jedes Promise einen Bericht. Hat es geklappt, sieht er so aus: `{ status: "fulfilled", value }`. Ist es gescheitert, so: `{ status: "rejected", reason }`. In `reason` steckt dann der Fehler.

## Die erste erfolgreiche Antwort

`any` wartet nur, bis ein Promise erfolgreich ist. Im Beispiel antwortet ein Server nach 300 Millisekunden, der andere nach 50:

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

Ausgegeben wird „Zuerst geantwortet hat 50 ms“. Die langsamere Antwort interessiert `any` nicht mehr.

## Anfragen abbrechen

Manchmal braucht man eine Antwort nicht mehr, etwa weil jemand schon weitergetippt hat. Mit einem `AbortController` brichst du eine laufende Anfrage ab. Im Beispiel dauert die Anfrage eine Sekunde, wird aber nach 100 Millisekunden abgebrochen:

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

Ausgegeben wird „Abgebrochen: AbortError“. Der Controller hat zwei Teile: Sein `signal` gibst du an `fetch` mit, und mit `controller.abort()` löst du den Abbruch aus. Die Anfrage scheitert dann mit einem `AbortError`.

## Zeitlimits

Ein Server kann hängen bleiben. Damit dein Programm nicht ewig wartet, gibt es ein fertiges Signal mit Zeitlimit. Im Beispiel braucht der Server 800 Millisekunden, das Limit ist 200:

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

Ausgegeben wird „Zu langsam: TimeoutError“. Bei einem Zeitlimit heißt der Fehler `TimeoutError`, bei einem Abbruch von Hand `AbortError`. Die Übungs-API antwortet unter `/uebung/langsam?ms=…` absichtlich verzögert, höchstens 1,5 Sekunden.
