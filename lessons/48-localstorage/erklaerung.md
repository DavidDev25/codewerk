## Ein Gedächtnis für deine Seite

Lädt der Browser eine Seite neu, sind alle Variablen weg. Für Dinge, die bleiben sollen (Einstellungen, ein Entwurf, ein Highscore), hat jeder Browser einen kleinen Speicher: `localStorage`.

:::alltag
Wie ein Schließfach im Schwimmbad: Du legst etwas hinein, schließt ab, gehst schwimmen und holst es später unverändert wieder heraus. Jedes Fach hat eine Nummer (den **Schlüssel**), und hinein passt nur **Text**.
:::

```js
localStorage.setItem("lieblingsfarbe", "grün");
console.log(localStorage.getItem("lieblingsfarbe"));
console.log(localStorage.getItem("gibt-es-nicht"));
localStorage.removeItem("lieblingsfarbe");
```

| Methode | Bedeutung |
| --- | --- |
| `setItem(schluessel, text)` | speichern (überschreibt) |
| `getItem(schluessel)` | lesen, `null`, wenn es nichts gibt |
| `removeItem(schluessel)` | löschen |

## Nur Text

Alles wird als Text gespeichert. Zahlen holst du mit `Number(…)` zurück, und mit `?? 0` hast du einen Startwert:

```js
const alt = Number(localStorage.getItem("punkte") ?? 0);
localStorage.setItem("punkte", alt + 10);
console.log(localStorage.getItem("punkte"), typeof localStorage.getItem("punkte"));
```

Für Objekte und Arrays nimmst du JSON aus Lektion 18:

```js
const einstellungen = { thema: "dunkel", schrift: 18 };
localStorage.setItem("einstellungen", JSON.stringify(einstellungen));

const geladen = JSON.parse(localStorage.getItem("einstellungen"));
console.log(geladen.thema);
```

## In Codewerk ausprobieren

Hier ist der Speicher pro Lektion ein **Übungsspeicher**: Er bleibt erhalten, bis du Codewerk neu lädst. Drücke mehrmals **Ausführen**, dann siehst du, wie sich die Seite an frühere Läufe „erinnert“. Das ist dasselbe, was in einem echten Browser beim Neuladen passiert.

:::alltag
Speichere in `localStorage` nie Passwörter oder andere Geheimnisse. Jedes Skript auf der Seite kann ihn lesen.
:::
