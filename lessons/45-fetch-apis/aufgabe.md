## Aufgabe: Die Wetter-App

Du schreibst vier `async`-Funktionen für eine kleine Wetter-App. Alle arbeiten mit der Übungs-API aus der Tabelle am Ende der Erklärung.

### Schritt 1: Den Namen holen

```js
await nutzerName(2);  // "Ali"
await nutzerName(99); // null
```

So gehst du vor:

1. Hole mit `await fetch(...)` die Antwort von der Adresse `/uebung/nutzer/${id}`. Schreibe die Adresse als Template-String.
2. Ist `antwort.ok` falsch, gib `null` zurück.
3. Sonst lies die Daten mit `await antwort.json()` und gib den `name` zurück.

### Schritt 2: Das Wetter als Text

```js
await wetterText("Erlangen"); // "Erlangen: 11 Grad, Regen"
await wetterText("Nürnberg"); // "Nürnberg: 12 Grad, bewölkt"
await wetterText("Atlantis"); // "Keine Daten für Atlantis"
```

So gehst du vor:

1. Hole die Antwort von `/uebung/wetter?stadt=…`. Verpacke die Stadt dabei mit `encodeURIComponent(stadt)`.
2. Ist `antwort.ok` falsch, gib den Text „Keine Daten für …“ mit der Stadt zurück.
3. Sonst lies die Daten und baue mit einem Template-String den Text aus `stadt`, `grad` und `himmel`.

Wichtig: Ohne `encodeURIComponent` scheitert Nürnberg am Umlaut.

### Schritt 3: Eine Notiz speichern

`notizSpeichern(text)` schickt die Notiz an den Server und gibt ihre `id` zurück:

```js
await notizSpeichern("Schirm mitnehmen"); // zum Beispiel 1
await notizSpeichern("Jacke");            // eine neue id, zum Beispiel 2
```

So gehst du vor:

1. Rufe `fetch("/uebung/notizen", { ... })` mit drei Angaben auf: `method: "POST"`, den Header `"Content-Type": "application/json"` und `body: JSON.stringify({ text })`.
2. Lies die Antwort mit `await antwort.json()` und gib deren `id` zurück.

Genau so sieht `notieren` in der Erklärung aus.

### Schritt 4: Mehrere Städte gleichzeitig

`staedte(ids)` bekommt eine Liste von Nutzernummern und gibt deren Städte zurück:

```js
await staedte([1, 2]); // ["Nürnberg", "Erlangen"]
```

So gehst du vor:

1. Starte mit `ids.map(...)` für jede Nummer ein `fetch` und warte mit `await Promise.all(...)` auf alle Antworten.
2. Lies alle Antworten genauso mit `Promise.all` und `json()`.
3. Mache mit `map` aus jedem Nutzer seine `stadt`.

Wichtig: Nimm `Promise.all` und keine Schleife mit `await`. Sonst wartest du auf jede Anfrage einzeln.
