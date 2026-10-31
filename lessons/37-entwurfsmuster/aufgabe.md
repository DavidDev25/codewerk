## Aufgabe: Benachrichtigungen und Tierheim

Du baust beide Muster aus der Erklärung selbst. Zuerst eine Klasse `Ereignisse`, bei der man sich für Ereignisse anmelden kann. Sie kann etwas mehr als das Beispiel: Man kann sich auch wieder abmelden. Danach schreibst du eine Factory für das Tierheim. Die Klassen `Hund` und `Katze` stehen schon im Editor.

### Schritt 1: Anmelden und auslösen

```js
const e = new Ereignisse();
e.on("neu", (a, b) => console.log("Eins:", a, b));
e.on("neu", (a, b) => console.log("Zwei:", a, b));
e.emit("neu", "x", "y"); // gibt 2 Zeilen aus und liefert 2
e.emit("leer");          // 0
```

So gehst du vor:

1. Lege in der Klasse eine private Map an: `#abos = new Map();`.
2. Schreibe `on(name, fn)` wie in der Erklärung.
3. Schreibe `emit(name, ...daten)`. Hole die Liste mit `this.#abos.get(name) ?? []` und rufe jede Funktion mit `fn(...daten)` auf.
4. Gib am Ende zurück, wie viele Funktionen aufgerufen wurden. Das ist die Länge der Liste.

Wichtig: Schreibe `...daten` mit drei Punkten, in der Klammer von `emit` und beim Aufruf von `fn`. Nur so kommen alle Daten an, nicht nur der erste Wert.

### Schritt 2: Abmelden

```js
const eins = () => console.log(1);
const zwei = () => console.log(2);
e.on("x", eins);
e.on("x", zwei);
e.off("x", eins);
e.emit("x"); // gibt nur 2 aus
```

`off(name, fn)` entfernt genau diese eine Funktion aus der Liste. Hole die Liste und speichere mit `set` eine gefilterte Fassung, in der `fn` fehlt: `liste.filter((f) => f !== fn)`.

### Schritt 3: Nur einmal

```js
let n = 0;
e.einmal("start", () => n++);
e.emit("start");
e.emit("start");
n; // 1
```

`einmal(name, fn)` meldet `fn` nur für das nächste `emit` an. So gehst du vor:

1. Lege in `einmal` eine Hilfsfunktion an: `const hilfe = (...daten) => { ... };`.
2. In der Hilfsfunktion meldest du zuerst `hilfe` mit `this.off(name, hilfe)` ab und rufst dann `fn(...daten)` auf.
3. Melde `hilfe` mit `this.on(name, hilfe)` an.

Die Hilfsfunktion muss eine Arrow-Funktion sein. Nur dann zeigt `this` darin auf dein Ereignis-Objekt.

### Schritt 4: Die Factory fürs Tierheim

```js
tierErstellen("hund", "Bello");   // ein Hund namens Bello
tierErstellen("katze", "Minka");  // eine Katze namens Minka
tierErstellen("drache", "Smaug"); // null
```

Schreibe `tierErstellen(art, name)` wie `dateiErstellen` in der Erklärung. Bei `"hund"` gibst du `new Hund(name)` zurück, bei `"katze"` eine neue Katze und sonst `null`.
