## Aufgabe: Einstellungen merken

Eine App soll sich merken, wie ihre Nutzer sie eingestellt haben. Im Editor steht das Objekt `einstellungen`. Du verwandelst es in Text, holst es zurück und schreibst zum Schluss eine Funktion, die gespeicherte Einstellungen lädt.

### Schritt 1: Als Text speichern

```js
gespeichert; // '{"thema":"dunkel","schrift":18,"sprachen":["de","en"]}'
```

Nimm `JSON.stringify`.

### Schritt 2: Wieder ein Objekt

```js
geladen.thema;    // "dunkel"
geladen.sprachen; // ["de", "en"]
```

Hole das Objekt mit `JSON.parse` aus `gespeichert` zurück.

Wichtig: Schreibe nicht einfach `const geladen = einstellungen`. Dann zeigen beide Variablen auf dasselbe Objekt. Die Tests wollen eine echte Kopie, die aus dem Text entsteht.

### Schritt 3: Schön eingerückt

`huebsch` ist derselbe Text, aber mit **2** Leerzeichen Einrückung:

```js
console.log(huebsch);
// {
//   "thema": "dunkel",
//   "schrift": 18,
//   "sprachen": [
//     "de",
//     "en"
//   ]
// }
```

Gib `JSON.stringify` drei Werte mit: das Objekt, `null` und die `2`.

### Schritt 4: Die Ladefunktion

`laden(text)` bekommt einen JSON-Text und gibt das Objekt daraus zurück. Ist noch nichts gespeichert, gibt sie Standardwerte zurück:

```js
laden('{"thema":"bunt","schrift":20}'); // { thema: "bunt", schrift: 20 }
laden(null); // { thema: "hell", schrift: 16 }
laden("");   // { thema: "hell", schrift: 16 }
```

So gehst du vor:

1. Prüfe zuerst mit `if (!text)`, ob überhaupt ein Text da ist. Wenn nicht, gib `{ thema: "hell", schrift: 16 }` zurück.
2. Sonst gib `JSON.parse(text)` zurück.

Wichtig: Die Prüfung muss **vor** `JSON.parse` stehen. Einen leeren Text kann `JSON.parse` nicht lesen und bricht mit einem Fehler ab.
