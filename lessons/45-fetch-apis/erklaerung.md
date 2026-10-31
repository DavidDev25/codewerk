## Daten aus dem Internet

Fast jede App holt Daten von einem Server: das Wetter, neue Nachrichten, deinen Warenkorb. Ein Server bietet dafür feste Adressen an, unter denen man Daten abfragen kann. So ein Angebot heißt **API**. Abgeholt werden die Daten mit `fetch`.

:::alltag
`fetch` ist wie eine Bestellung beim Lieferdienst. Du bekommst sofort eine Bestätigung, das ist das **Promise**. Irgendwann klingelt es, und du hältst eine Tüte in der Hand, das ist die **Antwort**. Erst wenn du die Tüte öffnest, kommt das Essen heraus, das sind die **Daten**. Darum brauchst du zweimal `await`.
:::

Codewerk hat eine eingebaute Übungs-API unter `/uebung/…`. Echte Adressen im Internet sind aus Sicherheitsgründen gesperrt. Im Beispiel holst du den Nutzer mit der Nummer 1:

```js
async function zeigeNutzer() {
  const antwort = await fetch("/uebung/nutzer/1");
  const daten = await antwort.json();
  console.log(antwort.status, daten);
}

zeigeNutzer();
```

Ausgegeben werden `200` und das Objekt `{ id: 1, name: "Mara", stadt: "Nürnberg" }`. Das passiert in zwei Schritten:

1. `await fetch(url)` wartet auf die Antwort des Servers.
2. `await antwort.json()` liest den Inhalt der Antwort und macht aus dem JSON-Text ein Objekt.

## Statuscodes: Hat es geklappt?

Jede Antwort hat einen **Statuscode**. Das ist eine Zahl, die sagt, wie es gelaufen ist. Die wichtigsten:

| Code | Bedeutung |
| --- | --- |
| `200` | OK, hier sind die Daten |
| `201` | Erstellt, dein neuer Eintrag wurde gespeichert |
| `400` | Deine Anfrage ist fehlerhaft |
| `404` | Gibt es nicht |
| `500` | Fehler auf dem Server |

Wichtig: Ein `404` ist für `fetch` **kein** Fehler. Die Antwort kommt ja an, nur eben mit einer schlechten Nachricht. Prüfe deshalb `antwort.ok`. Es ist bei allen Codes von 200 bis 299 `true`. Im Beispiel suchst du zwei Nutzer, von denen es einen nicht gibt:

```js
async function suchen(id) {
  const antwort = await fetch(`/uebung/nutzer/${id}`);
  if (!antwort.ok) {
    return `Nicht gefunden (${antwort.status})`;
  }
  const nutzer = await antwort.json();
  return nutzer.name;
}

suchen(2).then(console.log);
suchen(99).then(console.log);
```

Für die 2 kommt „Ali“ heraus. Die 99 gibt es nicht, also kommt „Nicht gefunden (404)“ heraus.

## Wenn gar nichts ankommt

Ist der Server nicht erreichbar oder die Adresse ungültig, wird das Promise **abgelehnt**. Das fängst du wie in Lektion 39 mit `try` und `catch` ab:

```js
async function versuchen() {
  try {
    await fetch("https://example.com/daten");
  } catch (fehler) {
    console.log("Keine Verbindung:", fehler.message);
  }
}

versuchen();
```

Weil Codewerk echte Adressen sperrt, landest du hier im `catch`. Die Meldung erklärt, dass nur die Übungs-API erreichbar ist.

## Werte in der Adresse

Zusätzliche Angaben hängst du mit `?name=wert` an die Adresse. Umlaute und Leerzeichen müssen dabei mit `encodeURIComponent` verpackt werden, sonst versteht der Server die Adresse falsch:

```js
async function wetter(stadt) {
  const antwort = await fetch(`/uebung/wetter?stadt=${encodeURIComponent(stadt)}`);
  console.log(await antwort.json());
}

wetter("Fürth");
```

Heraus kommt das Wetter für Fürth, zum Beispiel `{ stadt: "Fürth", grad: 13, himmel: "sonnig" }`.

## Daten hinschicken

Zum Speichern schickst du eine Anfrage mit der **Methode** `POST`. Die Daten kommen als JSON-Text in den `body`. Mit dem Header sagst du dem Server, dass es JSON ist:

```js
async function notieren() {
  const antwort = await fetch("/uebung/notizen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Milch kaufen" }),
  });
  console.log(antwort.status, await antwort.json());
}

notieren();
```

Ausgegeben werden `201` und die gespeicherte Notiz mit ihrer neuen `id`, zum Beispiel `{ id: 1, text: "Milch kaufen" }`.

## Mehreres gleichzeitig holen

Statt nacheinander zu warten, startest du alle Anfragen auf einmal. Mit `Promise.all` wartest du dann auf alle zusammen:

```js
async function alle() {
  const antworten = await Promise.all([1, 2, 3].map((id) => fetch(`/uebung/nutzer/${id}`)));
  const nutzer = await Promise.all(antworten.map((a) => a.json()));
  console.log(nutzer.map((n) => n.name));
}

alle();
```

Heraus kommt `["Mara", "Ali", "Lea"]`. `map` startet drei Anfragen gleichzeitig. `Promise.all` macht aus der Liste von Promises ein einziges Promise, das erfüllt ist, sobald alle drei fertig sind. Das geht schneller, als dreimal nacheinander zu warten.

## Die Übungs-API

| Anfrage | Antwort |
| --- | --- |
| `GET /uebung/nutzer` | alle Nutzer |
| `GET /uebung/nutzer/1` | ein Nutzer mit `id`, `name` und `stadt`, sonst 404 |
| `GET /uebung/wetter?stadt=Erlangen` | `stadt`, `grad` und `himmel`, sonst 404 |
| `POST /uebung/notizen` mit `{ text }` | 201 und die neue Notiz mit `id` |
