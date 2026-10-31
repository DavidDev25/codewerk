## Aufgabe: Der Funktionsbaukasten

Du baust die drei Werkzeuge aus der Erklärung selbst nach: eine Funktion, die ihre Werte einzeln nimmt, ein Fließband für Funktionen und einen Speicher für Ergebnisse. Zum Schluss rechnest du damit blitzschnell Fibonacci-Zahlen aus.

### Schritt 1: Addieren in zwei Schritten

```js
addiere(2)(3); // 5
plusZehn(5);   // 15
```

So gehst du vor:

1. Schreibe `addiere` wie `multipliziere` aus der Erklärung, nur mit `+` statt `*`.
2. Lege `plusZehn` an, indem du `addiere` mit `10` aufrufst.

### Schritt 2: Das Fließband

`pipe(...funktionen)` gibt eine Funktion zurück. Sie schickt einen Wert der Reihe nach durch alle Funktionen:

```js
const rechnen = pipe((x) => x + 1, (x) => x * 2);
rechnen(4); // 10
pipe()(7);  // 7
```

4 + 1 ergibt 5, mal 2 ergibt 10. Ohne Funktionen kommt der Wert unverändert zurück.

So gehst du vor:

1. Gib aus `pipe` eine Funktion zurück, die einen `wert` bekommt.
2. Lass darin `funktionen.reduce(...)` laufen. Die kleine Funktion bekommt das bisherige Ergebnis und die nächste Funktion `fn`. Sie gibt `fn(bisher)` zurück.
3. Nimm `wert` als Startwert.

Der Startwert sorgt auch dafür, dass `pipe()` ohne Funktionen einfach den Wert zurückgibt.

### Schritt 3: Der Ergebnisspeicher

`merken(fn)` gibt eine Funktion zurück, die jedes Ergebnis von `fn` nur einmal berechnet:

```js
let aufrufe = 0;
const teuer = merken((x) => { aufrufe++; return x * 3; });
teuer(5); // 15
teuer(5); // 15, diesmal aus dem Speicher
teuer(6); // 18
aufrufe;  // 2
```

So gehst du vor:

1. Lege in `merken` eine Map `speicher` an.
2. Gib eine Funktion zurück, die einen `wert` bekommt.
3. Steht `wert` schon im Speicher, gib das gespeicherte Ergebnis zurück.
4. Sonst rechne `fn(wert)` aus, speichere das Ergebnis mit `set` und gib es zurück.

Wichtig: Die Map gehört **in** `merken`, nicht ganz nach oben. Sonst teilen sich alle gemerkten Funktionen einen Speicher und vermischen ihre Ergebnisse.

### Schritt 4: Schnelle Fibonacci-Zahlen

In der Fibonacci-Folge ist jede Zahl die Summe der beiden davor: 0, 1, 1, 2, 3, 5, 8, 13 und so weiter.

```js
fibSchnell(6);  // 8
fibSchnell(10); // 55
fibSchnell(60); // 1548008755920
```

So gehst du vor:

1. Schreibe `const fibSchnell = merken((n) => { ... })`.
2. Der Abbruch: Ist `n` kleiner oder gleich 1, gib `n` zurück.
3. Sonst gib `fibSchnell(n - 1) + fibSchnell(n - 2)` zurück.

Wichtig: Rufe innen `fibSchnell` auf, also die Fassung mit Speicher. Nur dann landen auch alle Zwischenergebnisse im Speicher. Sonst würde `fibSchnell(60)` Stunden dauern.
