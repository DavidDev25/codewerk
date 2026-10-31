## Zu viele Events

Manche Events kommen in Massen: `input` bei jedem Tastendruck, `scroll` und `mousemove` dutzende Male pro Sekunde. Löst jedes davon eine teure Aktion aus, etwa eine Suche auf dem Server, wird die Seite langsam und der Server überlastet.

:::alltag
**Debounce** ist wie ein Aufzug: Er fährt erst los, wenn eine Weile niemand mehr eingestiegen ist. Jeder neue Fahrgast setzt die Wartezeit zurück.
**Throttle** ist wie ein Drehkreuz: Es lässt höchstens eine Person pro Sekunde durch, egal wie viele drängeln.
:::

## Debounce: warten, bis Ruhe ist

```js
function debounce(fn, ms) {
  let id;
  return (...werte) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...werte), ms);
  };
}

const melden = debounce((text) => console.log("Suche nach:", text), 200);
melden("A");
melden("Ap");
melden("Apf");
```

Nur `"Apf"` wird gesucht, 200 ms nach dem **letzten** Aufruf. Das ist ideal für Suchfelder, automatisches Speichern und das Prüfen von Eingaben.

Die Funktion nutzt fast alles, was du gelernt hast: eine **Closure** merkt sich `id` (Lektion 16), **Rest-Parameter** sammeln die Werte (Lektion 13), und `setTimeout` plant einen Task ein (Lektion 43).

## Throttle: höchstens einmal pro Zeitspanne

```js
function throttle(fn, ms) {
  let zuletzt = -Infinity;
  return (...werte) => {
    const jetzt = Date.now();
    if (jetzt - zuletzt >= ms) {
      zuletzt = jetzt;
      fn(...werte);
    }
  };
}

const position = throttle((y) => console.log("Scroll:", y), 100);
for (let y = 0; y < 50; y++) position(y);
```

Von 50 schnellen Aufrufen kommt nur der **erste** durch, die übrigen fallen in die Sperrzeit. Ideal für Scroll- und Mausbewegungen, bei denen man laufend, aber nicht ständig reagieren will.

| Technik | reagiert … | typisch für |
| --- | --- | --- |
| debounce | **nach** der letzten Aktion | Suche, Speichern, Fenstergröße |
| throttle | **während** der Aktionen, gedrosselt | Scrollen, Mausbewegung, Spiele |
