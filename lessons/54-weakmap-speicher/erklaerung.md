## Wer räumt den Speicher auf?

Jedes Objekt belegt Speicher. Du gibst ihn nie selbst frei. Das erledigt der **Garbage Collector** (Müllabfuhr) von JavaScript: Ein Objekt wird entfernt, sobald es **nicht mehr erreichbar** ist, also keine Variable und kein anderes erreichbares Objekt mehr darauf zeigt.

:::alltag
Ein Fundbüro: Solange irgendwer noch einen Abholschein für einen Gegenstand hat, bleibt er im Regal. Gibt es keinen Schein mehr, wird er irgendwann entsorgt. Ein **Speicherleck** ist ein vergessener Abholschein: Niemand braucht den Gegenstand mehr, aber er bleibt für immer liegen.
:::

## Typische Speicherlecks

| Ursache | Lösung |
| --- | --- |
| `setInterval`, das nie gestoppt wird | `clearInterval` aufrufen |
| Event-Listener, die nie entfernt werden | `removeEventListener` oder `{ once: true }` |
| Caches und Maps, die nur wachsen | Größe begrenzen oder `WeakMap` nutzen |
| Versehentliche globale Variablen | `let`/`const` und „strict mode“ |

In einem Programm, das tagelang läuft (ein Server oder eine geöffnete Web-App), lassen solche Lecks den Speicher immer weiter wachsen, bis alles langsam wird oder abstürzt.

## WeakMap: Notizen an Objekten

Eine normale `Map` hält ihre Schlüssel fest: Solange ein Objekt Schlüssel in der Map ist, kann es nie aufgeräumt werden. Eine **WeakMap** hält ihre Schlüssel nur **schwach**: Wird das Objekt sonst nirgends mehr gebraucht, verschwindet es samt Eintrag.

```js
const zusatz = new WeakMap();

let nutzer = { name: "Lea" };
zusatz.set(nutzer, { letzterLogin: "heute" });
console.log(zusatz.get(nutzer));
console.log(zusatz.has(nutzer));

nutzer = null;
```

Nach `nutzer = null` ist das Objekt nicht mehr erreichbar, und die WeakMap hindert die Müllabfuhr nicht am Aufräumen.

- Schlüssel müssen **Objekte** sein, keine Texte oder Zahlen.
- Man kann eine WeakMap **nicht durchlaufen** und hat kein `size`, denn ihr Inhalt kann jederzeit schrumpfen.
- `WeakSet` ist das Gegenstück zum Set: Es merkt sich Objekte, ohne sie festzuhalten.

Typische Einsätze: private Zusatzdaten zu Objekten, die einem nicht gehören (z. B. DOM-Elemente), und Caches, die automatisch mitaufgeräumt werden.

## WeakRef

`new WeakRef(obj)` ist ein schwacher Verweis. `ref.deref()` liefert das Objekt oder `undefined`, falls es schon aufgeräumt wurde. **Wann** die Müllabfuhr kommt, ist nicht vorhersagbar. Programme dürfen sich deshalb nie darauf verlassen, dass ein Objekt zu einem bestimmten Zeitpunkt verschwunden ist.
