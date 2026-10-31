## Objekte auf Reisen

Ein Objekt lebt im Speicher deines Programms. Willst du es speichern oder übers Internet verschicken, musst du es vorher in **Text** verwandeln.

:::alltag
Ein Schrank passt nicht durch den Briefschlitz. Also baust du ihn ab und legst eine Bauanleitung dazu. Am Ziel wird er wieder aufgebaut. Mit Objekten machst du es genauso.
:::

Das Textformat, das dafür fast überall benutzt wird, heißt **JSON**. Der Name kürzt „JavaScript Object Notation“ ab, auf Deutsch „JavaScript-Objekt-Schreibweise“. Das Beispiel verwandelt ein Objekt in Text und wieder zurück:

```js
const profil = { name: "Mara", alter: 31, hobbys: ["Klettern", "Lesen"] };

const text = JSON.stringify(profil);
console.log(text);
console.log(typeof text);

const zurueck = JSON.parse(text);
console.log(zurueck.hobbys[0]);
```

Die erste Zeile zeigt das Objekt als Text: `{"name":"Mara","alter":31,"hobbys":["Klettern","Lesen"]}`. `typeof` bestätigt, dass es wirklich ein `string` ist. Danach baut `JSON.parse` aus dem Text wieder ein echtes Objekt. Deshalb liefert `zurueck.hobbys[0]` das Wort „Klettern“.

- `JSON.stringify(wert)` macht aus einem Objekt oder Array einen Text.
- `JSON.parse(text)` baut aus dem Text wieder ein Objekt.

## So sieht JSON aus

JSON sieht fast aus wie ein JavaScript-Objekt. Es ist aber strenger:

- Schlüssel stehen **immer** in doppelten Anführungszeichen: `{"name": "Mara"}`.
- Texte stehen nur in `"`, nie in `'`.
- Nach dem letzten Eintrag steht kein Komma.

Ohne Leerzeichen ist JSON schwer zu lesen. Gibst du `JSON.stringify` einen dritten Wert mit, wird der Text eingerückt. Die Zahl sagt, wie viele Leerzeichen pro Ebene:

```js
const profil = { name: "Mara", hobbys: ["Klettern", "Lesen"] };
console.log(JSON.stringify(profil, null, 2));
```

Jetzt steht jeder Eintrag in einer eigenen Zeile. Die Hobbys sind noch einmal um zwei Leerzeichen weiter eingerückt, weil sie eine Ebene tiefer liegen. Den zweiten Wert `null` brauchst du hier nicht. Er steht nur da, damit die 2 an der dritten Stelle landet.

## Was beim Umwandeln verloren geht

JSON kennt nur Texte, Zahlen, `true` und `false`, `null`, Arrays und Objekte. Alles andere geht unterwegs verloren oder wird umgewandelt. Das Beispiel enthält eine Funktion, `undefined` und ein Datum:

```js
const objekt = {
  gruss() { return "Hallo"; },
  leer: undefined,
  datum: new Date(2026, 0, 1),
};
console.log(JSON.stringify(objekt));
```

Übrig bleibt nur das Datum, und zwar als Text mit Datum und Uhrzeit, etwa `{"datum":"2025-12-31T23:00:00.000Z"}`. Die Uhrzeit wird dabei in Weltzeit umgerechnet. Deshalb kann je nach Zeitzone sogar der 31. Dezember darin stehen. Die Funktion `gruss` und der Eintrag `leer` sind verschwunden. Holst du das Objekt mit `JSON.parse` zurück, ist `datum` außerdem kein echtes Datum mehr, sondern ein Text.

## Einstellungen speichern

Der Browser kann mit `localStorage` Daten speichern, aber nur Text. Deshalb legt man dort fast immer JSON ab. Ist noch nichts gespeichert, bekommst du `null` zurück. Für diesen Fall brauchst du Standardwerte:

```js
function laden(text) {
  if (!text) {
    return { thema: "hell" };
  }
  return JSON.parse(text);
}

console.log(laden(null));
console.log(laden('{"thema":"dunkel"}'));
```

Beim ersten Aufruf gibt es keinen Text. `laden` liefert deshalb den Standard `{ thema: "hell" }`. Beim zweiten Aufruf liegt ein JSON-Text vor, und `laden` gibt `{ thema: "dunkel" }` zurück. `!text` ist übrigens auch bei einem leeren Text `""` wahr. Den fängt die Funktion also gleich mit ab.
