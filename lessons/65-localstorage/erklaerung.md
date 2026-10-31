## Ein Gedächtnis für deine Seite

Lädt der Browser eine Seite neu, sind alle Variablen weg. Manche Dinge sollen aber bleiben, zum Beispiel Einstellungen, ein Entwurf oder ein Punktestand. Dafür hat jeder Browser einen kleinen Speicher: `localStorage`.

:::alltag
Denk an ein Schließfach im Schwimmbad. Du legst etwas hinein, schließt ab, gehst schwimmen und holst es später unverändert wieder heraus. Jedes Fach hat eine Nummer, das ist der **Schlüssel**. Und hinein passt nur **Text**.
:::

Im Beispiel speicherst du eine Lieblingsfarbe, liest sie wieder und löschst sie:

```js
localStorage.setItem("lieblingsfarbe", "grün");
console.log(localStorage.getItem("lieblingsfarbe"));
console.log(localStorage.getItem("gibt-es-nicht"));
localStorage.removeItem("lieblingsfarbe");
```

Ausgegeben werden „grün“ und `null`. Unter dem Schlüssel „gibt-es-nicht“ liegt nichts, deshalb liefert `getItem` dort `null`.

| Methode | Bedeutung |
| --- | --- |
| `setItem(schluessel, text)` | speichern, ein alter Wert wird überschrieben |
| `getItem(schluessel)` | lesen, `null`, wenn es nichts gibt |
| `removeItem(schluessel)` | löschen |

## Nur Text

Alles wird als Text gespeichert, auch Zahlen. Im Beispiel wird ein Punktestand um 10 erhöht:

```js
const alt = Number(localStorage.getItem("punkte") ?? 0);
localStorage.setItem("punkte", alt + 10);
console.log(localStorage.getItem("punkte"), typeof localStorage.getItem("punkte"));
```

Beim ersten Lauf erscheint „10 string“. Gespeichert hast du die Zahl 10, zurück kommt aber der Text „10“. Deshalb wandelt `Number(…)` den gelesenen Wert vor dem Rechnen in eine Zahl um. Und `?? 0` sorgt beim allerersten Mal für einen Startwert, weil dann noch `null` zurückkommt. Führst du das Beispiel öfter aus, wächst der Stand auf 20, 30 und so weiter.

Für Objekte und Arrays nimmst du JSON aus Lektion 21:

```js
const einstellungen = { thema: "dunkel", schrift: 18 };
localStorage.setItem("einstellungen", JSON.stringify(einstellungen));

const geladen = JSON.parse(localStorage.getItem("einstellungen"));
console.log(geladen.thema);
```

Ausgegeben wird „dunkel“. `JSON.stringify` macht aus dem Objekt einen Text zum Speichern, und `JSON.parse` baut daraus wieder ein Objekt.

## In Codewerk ausprobieren

In Codewerk hat jede Lektion einen eigenen **Übungsspeicher**. Er bleibt erhalten, bis du Codewerk neu lädst. Drücke mehrmals **Ausführen**, dann siehst du, wie sich die Seite an frühere Läufe erinnert. Genau das passiert in einem echten Browser beim Neuladen einer Seite.

:::achtung
Speichere in `localStorage` nie Passwörter oder andere Geheimnisse. Jedes Skript auf der Seite kann ihn lesen.
:::
