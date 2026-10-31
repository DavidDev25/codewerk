## Objekte auf Reisen

:::alltag
Ein Schrank passt nicht durch den Briefschlitz. Also baust du ihn ab, legst eine Bauanleitung dazu, und am Ziel wird er wieder aufgebaut. Objekte geht es genauso: Um sie zu speichern oder übers Internet zu schicken, werden sie in **Text** verwandelt. Dieses Textformat heißt **JSON** (JavaScript Object Notation).
:::

```js
const profil = { name: "Mara", alter: 31, hobbys: ["Klettern", "Lesen"] };

const text = JSON.stringify(profil);
console.log(text);
console.log(typeof text);

const zurueck = JSON.parse(text);
console.log(zurueck.hobbys[0]);
```

- `JSON.stringify(wert)` macht aus einem Objekt oder Array einen Text.
- `JSON.parse(text)` baut daraus wieder ein echtes Objekt.

## So sieht JSON aus

JSON sieht fast aus wie ein JavaScript-Objekt, ist aber strenger:

- Schlüssel stehen **immer** in doppelten Anführungszeichen: `{"name": "Mara"}`
- Texte nur mit `"`, nie mit `'`
- kein Komma nach dem letzten Eintrag

Für Menschen lesbar wird es mit Einrückung. Der dritte Wert ist die Anzahl Leerzeichen:

```js
const profil = { name: "Mara", hobbys: ["Klettern", "Lesen"] };
console.log(JSON.stringify(profil, null, 2));
```

## Was nicht mitreist

JSON kennt nur Texte, Zahlen, `true`/`false`, `null`, Arrays und Objekte. Alles andere geht unterwegs verloren oder wird umgewandelt:

```js
const objekt = {
  gruss() { return "Hallo"; },
  leer: undefined,
  datum: new Date(2026, 0, 1),
};
console.log(JSON.stringify(objekt));
```

Funktionen und `undefined` verschwinden, ein Datum wird zu einem Text.

## Typischer Einsatz: Einstellungen speichern

Browser-Speicher wie `localStorage` können nur Text speichern. Deshalb wird dort fast immer JSON abgelegt. Ist noch nichts gespeichert, bekommst du `null` zurück. Dafür brauchst du einen Standardwert:

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
