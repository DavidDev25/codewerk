## Aufgabe: Der robuste Datenabruf

Du baust vier Funktionen, die mit langsamen oder fehlenden Antworten zurechtkommen. Im Editor steht schon die Hilfsfunktion `nameVon(id)`. Sie liefert den Namen eines Nutzers. Gibt es den Nutzer nicht, scheitert sie mit einem Fehler.

### Schritt 1: Alle Namen, auch wenn einer fehlt

```js
await namenListe([1, 99, 2]); // ["Mara", "unbekannt", "Ali"]
```

So gehst du vor:

1. Starte mit `ids.map((id) => nameVon(id))` alle Abfragen.
2. Warte mit `await Promise.allSettled(...)` auf alle Berichte.
3. Mache mit `map` aus jedem Bericht `e` den Namen: `e.status === "fulfilled" ? e.value : "unbekannt"`.

Wichtig: Mit `Promise.all` würde die fehlende 99 alles scheitern lassen.

### Schritt 2: Die schnellste Antwort

`schnellste(zeiten)` startet für jede Zeit eine Anfrage an `/uebung/langsam?ms=…` und gibt die `ms` der ersten erfolgreichen Antwort zurück:

```js
await schnellste([300, 40, 200]); // 40
```

So gehst du vor:

1. Mache mit `zeiten.map(...)` aus jeder Zeit ein `fetch` an die passende Adresse und hänge `.then((r) => r.json())` an.
2. Warte mit `await Promise.any(...)` auf die erste Antwort.
3. Gib deren `ms` zurück.

### Schritt 3: Mit Zeitlimit

`mitZeitlimit(ms, limit)` fragt `/uebung/langsam?ms=…` an. Ist der Server schneller als das Limit, gibt sie die Antwort zurück. Sonst gibt sie `"zu langsam"` zurück:

```js
await mitZeitlimit(50, 500);  // { ms: 50 }
await mitZeitlimit(800, 100); // "zu langsam"
```

So gehst du vor:

1. Rufe im `try`-Block `fetch` mit `{ signal: AbortSignal.timeout(limit) }` auf.
2. Gib `await antwort.json()` zurück.
3. Gib im `catch`-Block `"zu langsam"` zurück.

### Schritt 4: Abbrechen auf Knopfdruck

`abbrechbar(ms)` startet eine Anfrage und gibt **sofort** ein Objekt mit zwei Teilen zurück: `ergebnis` ist das Promise der Antwortdaten, und `abbrechen()` bricht die Anfrage ab:

```js
const auftrag = abbrechbar(1000);
auftrag.abbrechen();
await auftrag.ergebnis; // scheitert mit einem AbortError
```

So gehst du vor:

1. Schreibe `function abbrechbar(ms)` ohne `async`. Die Funktion soll ja sofort antworten.
2. Lege einen `new AbortController()` an.
3. Starte `fetch` mit `{ signal: controller.signal }` und hänge `.then((r) => r.json())` an. Das ist `ergebnis`.
4. Gib `{ ergebnis, abbrechen: () => controller.abort() }` zurück.
