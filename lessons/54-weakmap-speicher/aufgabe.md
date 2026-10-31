## Aufgabe: Ordentlich mit Speicher umgehen

Du merkst dir Dinge zu Objekten, ohne sie im Speicher festzuhalten. Zum Schluss stopfst du ein echtes Speicherleck in der Klasse `Uhr`.

### Schritt 1: Besuche zählen

```js
const lea = { name: "Lea" };
besuchZaehlen(lea);            // 1
besuchZaehlen(lea);            // 2
besuchZaehlen({ name: "Lea" }); // 1
```

Das dritte Objekt sieht genauso aus, ist aber ein **anderes** Objekt. Deshalb fängt es wieder bei 1 an.

So gehst du vor:

1. Lege `const besuche = new WeakMap();` an.
2. Erhöhe in `besuchZaehlen(nutzer)` den Zähler: `besuche.set(nutzer, (besuche.get(nutzer) ?? 0) + 1)`.
3. Gib den neuen Stand mit `besuche.get(nutzer)` zurück.

### Schritt 2: Nutzer sperren

```js
const ben = { name: "Ben" };
istGesperrt(ben); // false
sperren(ben);
istGesperrt(ben); // true
```

So gehst du vor:

1. Lege `const gesperrt = new WeakSet();` an.
2. `sperren(nutzer)` ruft `gesperrt.add(nutzer)` auf.
3. `istGesperrt(nutzer)` gibt `gesperrt.has(nutzer)` zurück.

### Schritt 3: Ein Zwischenspeicher pro Objekt

`objektCache(fn)` gibt eine Funktion zurück, die für jedes Objekt nur einmal rechnet. Das kennst du von `merken` aus Lektion 25, nur mit einer WeakMap:

```js
let aufrufe = 0;
const laenge = objektCache((o) => { aufrufe++; return o.name.length; });
const mia = { name: "Mia" };
laenge(mia); // 3
laenge(mia); // 3, diesmal aus dem Speicher
aufrufe;     // 1
```

So gehst du vor:

1. Lege in `objektCache` eine `new WeakMap()` an.
2. Gib eine Funktion zurück, die ein `obj` bekommt.
3. Steht `obj` schon in der WeakMap, gib das gespeicherte Ergebnis zurück.
4. Sonst rechne `fn(obj)` aus, speichere es und gib es zurück.

### Schritt 4: Die Uhr stoppen

Die Klasse `Uhr` startet mit `setInterval` einen Takt, aber man kann ihn nie stoppen. Das ist ein Speicherleck.

```js
const uhr = new Uhr(() => console.log("tick"));
uhr.start(); // tick, tick, tick …
uhr.stop();  // Ruhe
```

So gehst du vor:

1. Merke dir in `start()` die Nummer, die `setInterval` zurückgibt: `this.id = setInterval(...)`.
2. Schreibe eine Methode `stop()`. Sie ruft `clearInterval(this.id)` auf.
