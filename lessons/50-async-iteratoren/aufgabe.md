## Aufgabe: Nutzer seitenweise und Zahlen auf Abruf

Zuerst holst du alle Nutzer der Übungs-API mit einem Generator, der warten kann. Du weißt dabei vorher nicht, wie viele es sind. Danach verarbeitest du einen unendlichen Generator mit den Iterator-Helfern.

### Schritt 1: Alle Nutzer nacheinander

`alleNutzer()` fragt `/uebung/nutzer/1`, `/uebung/nutzer/2` und so weiter an, bis es keinen Nutzer mehr gibt:

```js
for await (const nutzer of alleNutzer()) {
  console.log(nutzer.name); // Mara, dann Ali, dann Lea
}
```

So gehst du vor:

1. Schreibe `async function* alleNutzer()` und lege `let id = 1` an.
2. Schreibe eine Schleife `while (true)`. Hole darin mit `fetch` die Antwort für die aktuelle `id`.
3. Ist `antwort.ok` falsch, hörst du mit `return` auf.
4. Sonst gibst du `await antwort.json()` mit `yield` heraus und erhöhst `id`.

### Schritt 2: Alle Namen sammeln

```js
await namenSammeln(); // ["Mara", "Ali", "Lea"]
```

Schreibe `async function namenSammeln()`. Gehe mit `for await` durch `alleNutzer()`, lege jeden Namen in eine Liste und gib sie zurück.

### Schritt 3: Nutzer zählen

```js
await anzahlNutzer(); // 3
```

Schreibe `async function anzahlNutzer()`. Sammle mit `await Array.fromAsync(alleNutzer())` alle Nutzer und gib die Länge der Liste zurück.

### Schritt 4: Gerade Quadratzahlen

`zahlenAb(1)` steht schon im Editor. Es liefert 1, 2, 3 und so weiter ohne Ende. `geradeQuadrate` enthält die ersten drei Quadratzahlen von geraden Zahlen:

```js
geradeQuadrate; // [4, 16, 36]
```

Hänge an `zahlenAb(1)` vier Helfer an, so wie im letzten Beispiel der Erklärung:

1. `filter` behält nur gerade Zahlen.
2. `map` nimmt jede Zahl mal sich selbst.
3. `take(3)` hört nach drei Werten auf.
4. `toArray()` sammelt sie in einem Array.

Wichtig: `take` muss **vor** `toArray` stehen. Sonst sammelt `toArray` endlos.
