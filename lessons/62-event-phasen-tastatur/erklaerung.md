## Der Weg eines Events

In Lektion 61 hast du gesehen, dass Events nach oben aufsteigen. Genau genommen läuft jedes Event in **drei Abschnitten** durch die Seite:

1. **Capture**, der Hinweg: von `document` hinunter bis zum angeklickten Element
2. **Target**, das Ziel: am angeklickten Element selbst
3. **Bubble**, der Rückweg: vom Element wieder hinauf bis `document`

:::alltag
Ein Brief geht vom Postamt über die Straße und die Hausnummer bis zur Wohnung. Das ist der Hinweg. In der Wohnung wird er geöffnet, das ist das Ziel. Die Antwort geht denselben Weg zurück nach oben. Jede Station auf dem Weg kann mitlesen.
:::

Normale Listener hören auf dem Rückweg. Mit `{ capture: true }` hören sie schon auf dem Hinweg. Im Beispiel hören die Karte und der Knopf darin auf denselben Klick:

```js
const karte = document.querySelector("#karte");
const knopf = document.querySelector("#merken");
karte.addEventListener("click", () => console.log("Karte (bubble)"));
karte.addEventListener("click", () => console.log("Karte (capture)"), { capture: true });
knopf.addEventListener("click", () => console.log("Knopf (target)"));
knopf.click();
```

`knopf.click()` klickt den Knopf per Code an. Ausgegeben werden „Karte (capture)“, „Knopf (target)“ und „Karte (bubble)“. Der Capture-Listener der Karte kommt zuerst dran, obwohl er im Code als zweiter steht. Der Klick kommt auf dem Hinweg eben zuerst an der Karte vorbei.

## Die Weitergabe stoppen

Liegt ein Knopf **in** einem anklickbaren Bereich, löst ein Klick auf den Knopf auch den Bereich aus. Mit `event.stopPropagation()` beendest du die Reise des Events:

```js
document.querySelector("#merken").addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("Nur der Knopf reagiert.");
});
```

Klickst du jetzt auf den Knopf, erscheint „Nur der Knopf reagiert.“. Die Karte bekommt von dem Klick nichts mehr mit.

Verwechsle die beiden nicht: `preventDefault()` verhindert, was der Browser normalerweise tun würde, zum Beispiel ein Formular absenden oder einen Link öffnen. `stopPropagation()` verhindert, dass das Event an andere Elemente weitergereicht wird.

## Barrierefrei bauen

Viele Menschen bedienen Seiten nur mit der **Tastatur** oder lassen sie sich von einem **Screenreader** vorlesen. Ein paar Regeln helfen fast immer:

| Regel | Warum |
| --- | --- |
| Für Aktionen `<button>`, nicht `<div>` | Knöpfe sind mit Tab erreichbar und reagieren auf Enter und Leertaste |
| Zustand mit `aria-expanded` oder `aria-pressed` angeben | Der Screenreader sagt dann zum Beispiel „Menü, eingeklappt“ |
| `Escape` schließt Menüs und Dialoge | So kennt man es, und der Fokus geht zurück zum Auslöser |
| Pfeiltasten in Listen und Menüs | Schneller, als zigmal Tab zu drücken |
| Sichtbarer Fokusrahmen | Man muss sehen, wo man gerade ist |

## Tastatur-Events

Bei jedem Tastendruck kommt ein `keydown`-Event. Im Beispiel löst der Code selbst ein Escape aus:

```js
document.addEventListener("keydown", (event) => {
  console.log(event.key);
});
document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
```

Ausgegeben wird „Escape“. `dispatchEvent` schickt ein selbst gebautes Event los, so als hätte jemand die Taste gedrückt.

`event.key` liefert Namen wie `"Enter"`, `"Escape"`, `"ArrowDown"` oder `"a"`. Mit `element.focus()` setzt du den Fokus auf ein Element. Welches Element gerade den Fokus hat, steht in `document.activeElement`.

`tabindex="0"` macht ein Element mit Tab erreichbar, `tabindex="-1"` nur per Code. In einer Liste mit Pfeiltasten bekommt meistens nur der aktive Eintrag die `0`. So landet man mit Tab einmal in der Liste und bewegt sich darin mit den Pfeilen.
