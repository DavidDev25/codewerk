## Der Weg eines Events

In Lektion 61 hast du gesehen, dass Events nach oben „blubbern“. Genau genommen läuft jedes Event in **drei Phasen** durch die Seite:

1. **Capture:** von `document` hinunter bis zum Ziel-Element
2. **Target:** am angeklickten Element selbst
3. **Bubble:** vom Ziel wieder hinauf bis `document`

:::alltag
Ein Brief geht vom Postamt über die Hauptstraße und die Hausnummer bis zur Wohnung (Capture). Dort wird er geöffnet (Target). Die Antwort geht denselben Weg zurück nach oben (Bubble). Jede Station auf dem Weg kann mitlesen.
:::

Normale Listener hören in der Bubble-Phase. Mit `{ capture: true }` hören sie schon auf dem Hinweg:

```js
const karte = document.querySelector("#karte");
const knopf = document.querySelector("#merken");
karte.addEventListener("click", () => console.log("Karte (bubble)"));
karte.addEventListener("click", () => console.log("Karte (capture)"), { capture: true });
knopf.addEventListener("click", () => console.log("Knopf (target)"));
knopf.click();
```

## Weiterleitung stoppen

Liegt ein Knopf **in** einem anklickbaren Bereich, löst ein Klick auf den Knopf auch den Bereich aus. `event.stopPropagation()` beendet die Reise des Events:

```js
document.querySelector("#merken").addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("Nur der Knopf reagiert.");
});
```

Nicht verwechseln: `preventDefault()` verhindert die **Standardaktion** des Browsers (Formular absenden, Link öffnen), `stopPropagation()` die **Weitergabe** an andere Elemente.

## Barrierefrei bauen

Viele Menschen bedienen Seiten nur mit der **Tastatur** oder hören sie mit einem **Screenreader**. Ein paar Regeln helfen fast immer:

| Regel | Warum |
| --- | --- |
| Für Aktionen `<button>`, nicht `<div>` | Buttons sind fokussierbar und reagieren auf Enter und Leertaste |
| Zustand mit `aria-expanded`, `aria-pressed` angeben | Screenreader sagen „Menü, eingeklappt“ |
| `Escape` schließt Menüs und Dialoge | Gewohntes Verhalten, Fokus geht zurück zum Auslöser |
| Pfeiltasten in Listen und Menüs | Schneller als zigmal Tab drücken |
| Sichtbarer Fokusrahmen | Man muss sehen, wo man gerade ist |

## Tastatur-Events

```js
document.addEventListener("keydown", (event) => {
  console.log(event.key);
});
document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
```

`event.key` liefert Namen wie `"Enter"`, `"Escape"`, `"ArrowDown"` oder `"a"`. Ein Element wird mit `element.focus()` fokussiert, das aktuell fokussierte findest du in `document.activeElement`.

`tabindex="0"` macht ein Element mit Tab erreichbar, `tabindex="-1"` nur per Code. In einer Liste mit Pfeiltasten bekommt meist nur der aktive Eintrag `0` („Roving Tabindex“).
