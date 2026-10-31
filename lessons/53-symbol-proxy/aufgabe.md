## Aufgabe: Die Objekt-Werkstatt

Du baust einen versteckten Schlüssel und drei verschiedene Wächter für Objekte.

### Schritt 1: Ein versteckter Wert

```js
const obj = verstecken({ name: "Lea" }, 42);
obj[GEHEIM];         // 42
Object.keys(obj);    // ["name"]
JSON.stringify(obj); // '{"name":"Lea"}'
```

So gehst du vor:

1. Lege `const GEHEIM = Symbol("geheim");` an.
2. Schreibe `verstecken(obj, wert)`. Speichere darin `obj[GEHEIM] = wert;` und gib `obj` zurück.

### Schritt 2: Standardwerte

`mitStandard(obj, standard)` gibt einen Proxy zurück. Fehlt eine Eigenschaft, kommt `standard` heraus:

```js
const p = mitStandard({ a: 1, b: 0 }, "fehlt");
p.a; // 1
p.b; // 0
p.c; // "fehlt"
```

So gehst du vor:

1. Gib `new Proxy(obj, { get(ziel, name, empfaenger) { ... } })` zurück.
2. Prüfe in der `get`-Falle mit `name in ziel`, ob es die Eigenschaft gibt.
3. Wenn ja, gib `Reflect.get(ziel, name, empfaenger)` zurück. Sonst gib `standard` zurück.

Wichtig: Nimm `in` und nicht `||`. Sonst würde aus der echten 0 bei `b` fälschlich „fehlt“.

### Schritt 3: Nur Zahlen erlaubt

`nurZahlen(obj)` gibt einen Proxy zurück, der beim Setzen prüft:

```js
const z = nurZahlen({});
z.alter = 30;
z.alter;        // 30
z.alter = "30"; // TypeError
```

Schreibe eine `set`-Falle wie beim Konto in der Erklärung. Ist `typeof wert` nicht `"number"`, wirf einen `TypeError`. Sonst gib `Reflect.set(ziel, name, wert, empfaenger)` zurück.

### Schritt 4: Alles mitschreiben

`protokolliert(obj, log)` schreibt bei jedem Setzen eine Zeile in das Array `log`:

```js
const log = [];
const p = protokolliert({}, log);
p.farbe = "rot";
p.zahl = 3;
log; // ["farbe=rot", "zahl=3"]
```

So gehst du vor:

1. Schreibe wieder eine `set`-Falle.
2. Lege darin mit `log.push(...)` einen Text aus Name, Gleichheitszeichen und Wert ab. Schreibe den Namen als `String(name)`.
3. Gib am Ende `Reflect.set(ziel, name, wert, empfaenger)` zurück, damit der Wert wirklich gespeichert wird.
