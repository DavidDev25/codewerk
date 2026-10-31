## Aufgabe: Die gedrosselte Obstsuche

Auf der Seite gibt es ein Suchfeld und eine Liste mit Obst. Du baust beide Techniken aus der Erklärung selbst nach. Mit `debounce` machst du daraus eine Suche, die erst filtert, wenn man kurz mit dem Tippen aufhört.

### Schritt 1: debounce

```js
const melden = debounce((text) => console.log(text), 100);
melden("A");
melden("Ap");
// nach 100 ms erscheint nur: Ap
```

So gehst du vor:

1. Lege in `debounce` eine Variable `let id;` an.
2. Gib eine Funktion `(...werte) => { ... }` zurück.
3. Lösche darin mit `clearTimeout(id)` den alten Timer.
4. Plane mit `id = setTimeout(() => fn(...werte), ms)` einen neuen.

### Schritt 2: throttle

```js
const drossel = throttle((x) => console.log(x), 100);
drossel(1); // erscheint sofort
drossel(2); // wird ignoriert
// nach 100 ms
drossel(3); // erscheint wieder
```

So gehst du vor:

1. Lege in `throttle` die Variable `let zuletzt = -Infinity;` an.
2. Gib eine Funktion zurück, die mit `Date.now()` die aktuelle Zeit holt.
3. Ist seit `zuletzt` mindestens `ms` vergangen, merkst du dir die neue Zeit und rufst `fn(...werte)` auf.
4. Sonst passiert nichts.

### Schritt 3: Die Suche

Tippt jemand in `#suche`, werden 150 Millisekunden nach dem letzten Tastendruck alle Einträge ausgeblendet, die den Suchtext nicht enthalten. Dabei ist Groß- und Kleinschreibung egal. Jede Suche, die wirklich stattfindet, erhöht `#anzahl` um 1.

```js
// jemand tippt schnell „b“, „bi“, „bir“ und hört dann auf
// nach 150 ms: nur „Birne“ ist noch sichtbar
document.querySelector("#anzahl").textContent; // "1"
```

So gehst du vor:

1. Schreibe eine Funktion `suchen(text)`. Sie macht den Text mit `toLowerCase()` klein.
2. Gehe darin durch alle `<li>` in `#liste`. Setze bei jedem `li.hidden` auf `true`, wenn sein kleingeschriebener Text den Suchtext nicht enthält. Sonst setze es auf `false`.
3. Erhöhe in `suchen` einen Zähler und schreibe ihn in `#anzahl`.
4. Mache mit `const gedrosselt = debounce(suchen, 150);` eine gedrosselte Fassung.
5. Hänge an `#suche` einen `input`-Listener. Er ruft `gedrosselt(event.target.value)` auf.

Ein leerer Suchtext ist in jedem Text enthalten. Deshalb ist dann automatisch wieder alles sichtbar.
