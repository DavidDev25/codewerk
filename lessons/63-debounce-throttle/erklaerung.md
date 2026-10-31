## Zu viele Events

Manche Events kommen in Massen. `input` kommt bei jedem Tastendruck, `scroll` und `mousemove` dutzende Male pro Sekunde. Löst jedes davon eine aufwendige Aktion aus, etwa eine Suche auf dem Server, wird die Seite langsam und der Server überlastet. Dagegen gibt es zwei Techniken.

:::alltag
**Debounce** ist wie ein Aufzug. Er fährt erst los, wenn eine Weile niemand mehr eingestiegen ist. Jeder neue Fahrgast setzt die Wartezeit zurück.

**Throttle** ist wie ein Drehkreuz. Es lässt höchstens eine Person pro Sekunde durch, egal wie viele drängeln.
:::

## Debounce: warten, bis Ruhe ist

Im Beispiel tippt jemand schnell „A“, „Ap“ und „Apf“. Gesucht werden soll aber nur einmal:

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

Ausgegeben wird nur „Suche nach: Apf“, und zwar 200 Millisekunden nach dem **letzten** Aufruf. Jeder neue Aufruf löscht mit `clearTimeout` den alten Timer und plant einen neuen. Erst wenn 200 Millisekunden lang nichts mehr kommt, läuft der Timer ab.

Das ist ideal für Suchfelder, automatisches Speichern und das Prüfen von Eingaben.

Die Funktion benutzt viel von dem, was du gelernt hast. Sie merkt sich `id` zwischen den Aufrufen wie in Lektion 16. `...werte` sammelt alle Werte ein, wie in Lektion 13. Und `setTimeout` plant einen Task ein, wie in Lektion 43.

## Throttle: höchstens einmal pro Zeitspanne

Im Beispiel kommen 50 Scroll-Meldungen direkt hintereinander:

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

Ausgegeben wird nur „Scroll: 0“. Der erste Aufruf kommt sofort durch und merkt sich die Uhrzeit. Alle anderen kommen innerhalb der nächsten 100 Millisekunden und werden deshalb ignoriert. Kämen weitere Aufrufe später, ließe `throttle` wieder einen durch.

Das ist ideal für Scrollen und Mausbewegungen, bei denen man laufend, aber nicht ständig reagieren will.

| Technik | reagiert … | typisch für |
| --- | --- | --- |
| debounce | **nach** der letzten Aktion | Suche, Speichern, Fenstergröße |
| throttle | **während** der Aktionen, aber gedrosselt | Scrollen, Mausbewegung, Spiele |
