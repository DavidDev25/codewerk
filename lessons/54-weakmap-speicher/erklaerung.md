## Wer räumt den Speicher auf?

Jedes Objekt belegt Speicher. Du gibst diesen Speicher nie selbst frei. Das erledigt JavaScript für dich mit einer Art Müllabfuhr, auf Englisch **Garbage Collector**. Sie entfernt ein Objekt, sobald es **nicht mehr erreichbar** ist. Das ist der Fall, wenn keine Variable und kein anderes erreichbares Objekt mehr darauf zeigt.

:::alltag
Denk an ein Fundbüro. Solange irgendwer noch einen Abholschein für einen Gegenstand hat, bleibt er im Regal. Gibt es keinen Schein mehr, wird er irgendwann entsorgt. Ein **Speicherleck** ist ein vergessener Abholschein: Niemand braucht den Gegenstand mehr, aber er bleibt für immer liegen.
:::

## Typische Speicherlecks

| Ursache | Lösung |
| --- | --- |
| `setInterval`, das nie gestoppt wird | `clearInterval` aufrufen |
| Event-Listener, die nie entfernt werden | `removeEventListener` oder `{ once: true }` |
| Zwischenspeicher und Maps, die nur wachsen | Größe begrenzen oder `WeakMap` benutzen |
| aus Versehen globale Variablen | immer `let` oder `const` schreiben |

Ein Programm, das tagelang läuft, zum Beispiel ein Server oder eine offene Web-App, wird durch solche Lecks immer größer. Irgendwann wird alles langsam oder stürzt ab.

## WeakMap: Notizen an Objekten

Eine normale `Map` hält ihre Schlüssel fest. Solange ein Objekt Schlüssel in der Map ist, kann die Müllabfuhr es nie entfernen. Eine **WeakMap** hält ihre Schlüssel nur **schwach**. Wird das Objekt sonst nirgends mehr gebraucht, verschwindet es samt Eintrag. Im Beispiel merkst du dir eine Zusatzangabe zu einem Nutzer:

```js
const zusatz = new WeakMap();

let nutzer = { name: "Lea" };
zusatz.set(nutzer, { letzterLogin: "heute" });
console.log(zusatz.get(nutzer));
console.log(zusatz.has(nutzer));

nutzer = null;
```

Ausgegeben werden `{ letzterLogin: "heute" }` und `true`. Danach setzt die letzte Zeile `nutzer` auf `null`. Jetzt zeigt nichts mehr auf das Objekt, und die WeakMap hindert die Müllabfuhr nicht am Aufräumen. Mit einer normalen Map bliebe Lea für immer im Speicher.

- Schlüssel müssen **Objekte** sein, keine Texte oder Zahlen.
- Man kann eine WeakMap **nicht durchlaufen**, und sie hat kein `size`. Ihr Inhalt kann ja jederzeit schrumpfen.
- `WeakSet` ist das Gegenstück zum Set. Es merkt sich Objekte, ohne sie festzuhalten.

Typische Einsätze sind Zusatzdaten zu Objekten, die einem nicht selbst gehören, zum Beispiel Elementen einer Webseite. Und Zwischenspeicher, die automatisch mit aufgeräumt werden.

## WeakRef

`new WeakRef(obj)` ist ein schwacher Verweis auf ein Objekt. `ref.deref()` liefert das Objekt oder `undefined`, wenn es schon aufgeräumt wurde. **Wann** die Müllabfuhr kommt, kann man nicht vorhersagen. Ein Programm darf sich deshalb nie darauf verlassen, dass ein Objekt zu einem bestimmten Zeitpunkt verschwunden ist.
