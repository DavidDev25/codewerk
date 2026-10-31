## Daten aus dem Internet

Fast jede App holt Daten von einem Server: das Wetter, neue Nachrichten, deinen Warenkorb. Die Adresse, unter der ein Server Daten anbietet, heißt **API**. Abgeholt wird mit `fetch`.

:::alltag
`fetch` ist wie eine Bestellung beim Lieferdienst. Du bekommst sofort eine Bestätigung (ein **Promise**). Irgendwann klingelt es, und du hältst eine Tüte in der Hand (die **Antwort**). Erst wenn du die Tüte öffnest, kommt das Essen heraus (die **Daten**). Darum brauchst du zwei Mal `await`.
:::

Codewerk hat eine eingebaute **Übungs-API** unter `/uebung/…`. Echte Adressen im Internet sind aus Sicherheitsgründen gesperrt. Probier es aus:

```js
async function zeigeNutzer() {
  const antwort = await fetch("/uebung/nutzer/1");
  const daten = await antwort.json();
  console.log(antwort.status, daten);
}

zeigeNutzer();
```

1. `await fetch(url)` wartet auf die Antwort des Servers.
2. `await antwort.json()` liest den Inhalt und wandelt das JSON in ein Objekt um.

## Statuscodes: Hat es geklappt?

Jede Antwort hat einen **Statuscode**. Die wichtigsten:

| Code | Bedeutung |
| --- | --- |
| `200` | OK, hier sind die Daten |
| `201` | Erstellt, dein neuer Eintrag wurde gespeichert |
| `400` | Deine Anfrage ist fehlerhaft |
| `404` | Gibt es nicht |
| `500` | Fehler auf dem Server |

Wichtig: Ein `404` ist für `fetch` **kein** Fehler. Die Antwort kommt ja an, nur eben mit schlechter Nachricht. Prüfe deshalb `antwort.ok`. Es ist `true` bei allen Codes von 200 bis 299.

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

## Wenn gar nichts ankommt

Ist der Server nicht erreichbar oder die Adresse ungültig, wird das Promise **abgelehnt**. Das fängst du wie in Lektion 33 mit `try … catch`:

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

## Werte in der Adresse

Zusätzliche Angaben hängst du mit `?name=wert` an. Umlaute und Leerzeichen musst du dabei mit `encodeURIComponent` verpacken:

```js
async function wetter(stadt) {
  const antwort = await fetch(`/uebung/wetter?stadt=${encodeURIComponent(stadt)}`);
  console.log(await antwort.json());
}

wetter("Fürth");
```

## Daten hinschicken

Zum Speichern schickst du eine Anfrage mit der **Methode** `POST`. Die Daten kommen als JSON in den `body`:

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

## Mehreres gleichzeitig holen

Statt nacheinander zu warten, startest du alle Anfragen auf einmal und wartest mit `Promise.all` auf alle zusammen:

```js
async function alle() {
  const antworten = await Promise.all([1, 2, 3].map((id) => fetch(`/uebung/nutzer/${id}`)));
  const nutzer = await Promise.all(antworten.map((a) => a.json()));
  console.log(nutzer.map((n) => n.name));
}

alle();
```

## Die Übungs-API

| Anfrage | Antwort |
| --- | --- |
| `GET /uebung/nutzer` | alle Nutzer |
| `GET /uebung/nutzer/1` | ein Nutzer (`id`, `name`, `stadt`), sonst 404 |
| `GET /uebung/wetter?stadt=Erlangen` | `stadt`, `grad`, `himmel`, sonst 404 |
| `POST /uebung/notizen` mit `{ text }` | 201 und die neue Notiz mit `id` |
