## Aufgabe: Benutzer und Bestellungen laden

Im Editor stehen zwei Funktionen, die so tun, als würden sie Daten von einem Server laden. Ändere sie nicht. Beide geben ein Promise zurück:

- `ladeBenutzer(id)` liefert ein Objekt wie `{ name: "Mia" }`. Gibt es die `id` nicht, wird das Promise mit dem Fehler „Benutzer nicht gefunden“ abgelehnt.
- `ladeBestellungen(name)` liefert eine Liste mit den Bestellungen dieser Person.

Du schreibst darunter vier `async`-Funktionen, die diese Daten mit `await` abholen. Benutze dabei kein `.then(…)`.

### Schritt 1: Die Begrüßung

```js
await begruessung(1); // "Hallo Mia!"
await begruessung(2); // "Hallo Ben!"
```

So gehst du vor:

1. Schreibe `async function begruessung(id)`.
2. Lade den Benutzer: `const person = await ladeBenutzer(id);`.
3. Gib `"Hallo " + person.name + "!"` zurück.

### Schritt 2: Die Bestellungen zählen

```js
await bestellAnzahl(1); // 2
await bestellAnzahl(2); // 0
```

So gehst du vor:

1. Lade wie in Schritt 1 den Benutzer.
2. Lade danach mit seinem Namen die Bestellungen: `await ladeBestellungen(person.name)`.
3. Gib die Länge der Liste zurück.

### Schritt 3: Sicher begrüßen

```js
await sicherBegruessen(1); // "Hallo Mia!"
await sicherBegruessen(9); // "Unbekannter Benutzer"
```

So gehst du vor:

1. Schreibe im `try`-Block `return await begruessung(id);`.
2. Gib im `catch`-Block `"Unbekannter Benutzer"` zurück.

Wichtig: Das `await` hinter `return` brauchst du hier. Ohne `await` verlässt die Funktion den `try`-Block, bevor der Fehler ankommt, und `catch` fängt ihn nicht.

### Schritt 4: Starten

Schreibe `async function start()`. Darin gibst du mit `console.log(await begruessung(1));` die Begrüßung aus. Rufe danach ganz unten `start();` auf. Im Reiter **Ausgabe** erscheint dann „Hallo Mia!“.
