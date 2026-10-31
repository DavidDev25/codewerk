## Aufgabe: Wörter zählen und Ergebnisse speichern

Im Editor gibt es drei Dateien: `main.js`, ein Gedicht in `texte/gedicht.txt` und `notizen.txt`. Du zählst die Wörter des Gedichts, schreibst eine Notiz und speicherst eine kleine Statistik. Baue alle Pfade mit `path.join(__dirname, …)`.

Am Ende steht im Reiter **Ausgabe**:

```
Das Gedicht hat 13 Wörter.
```

Darunter siehst du bei „Dateien nach dem Lauf“, was sich geändert hat.

### Schritt 1: Wörter zählen

```js
woerterZaehlen(path.join(__dirname, "texte", "gedicht.txt")); // 13
woerterZaehlen(path.join(__dirname, "fehlt.txt"));             // 0
```

So gehst du vor:

1. Lies die Datei mit `fs.readFileSync(pfad, "utf8")`.
2. Zerlege den Text mit `split(/\s+/)` an allen Leerzeichen und Zeilenumbrüchen.
3. Entferne leere Teile mit `filter(Boolean)` und gib die Länge zurück.
4. Fange Fehler mit `try` und `catch` ab. Hat der Fehler den Code `"ENOENT"`, gib 0 zurück. Jeden anderen Fehler wirfst du weiter.

### Schritt 2: Eine Notiz anhängen

`notieren(text)` hängt `text` als neue Zeile an `notizen.txt` an. Die Datei endet schon mit einem Zeilenumbruch. Hänge deshalb mit `fs.appendFileSync` den Text plus `"\n"` an.

### Schritt 3: Die Statistik speichern

`statistikSpeichern(daten)` speichert `daten` als JSON in `ausgabe/statistik.json`:

```js
statistikSpeichern({ datei: "gedicht.txt", woerter: 13 });
// neue Datei ausgabe/statistik.json mit eingerücktem JSON
```

So gehst du vor:

1. Lege den Ordner `ausgabe` mit `fs.mkdirSync(ordner, { recursive: true })` an.
2. Schreibe mit `fs.writeFileSync` den Text `JSON.stringify(daten, null, 2)` in `statistik.json` in diesem Ordner.

### Schritt 4: Das Hauptprogramm

1. Zähle die Wörter in `texte/gedicht.txt`.
2. Notiere `"Gedicht gezählt"`.
3. Speichere `{ datei: "gedicht.txt", woerter: … }` mit der gezählten Zahl.
4. Gib den Satz mit der Anzahl aus.
