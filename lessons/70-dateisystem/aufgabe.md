## Aufgabe: Wörter zählen und Ergebnisse speichern

1. Schreibe `woerterZaehlen(pfad)`. Sie liest die Datei als Text und gibt die Anzahl der Wörter zurück (Wörter sind durch Leerzeichen oder Zeilenumbrüche getrennt, leere Teile zählen nicht). Gibt es die Datei nicht, gibt sie `0` zurück. Andere Fehler wirft sie weiter.
2. Schreibe `notieren(text)`. Sie hängt `text` als **neue Zeile** an `notizen.txt` an. Die Datei endet schon mit einem Zeilenumbruch, also schreibst du `text + "\n"`.
3. Schreibe `statistikSpeichern(daten)`. Sie legt den Ordner `ausgabe` an (falls nötig) und speichert `daten` als JSON in `ausgabe/statistik.json`. Nutze `JSON.stringify(daten, null, 2)`.
4. Im Hauptprogramm: Zähle die Wörter in `texte/gedicht.txt`, notiere `"Gedicht gezählt"` und speichere `{ datei: "gedicht.txt", woerter: … }`. Gib aus: `Das Gedicht hat 13 Wörter.`

Baue die Pfade mit `path.join(__dirname, …)`. Unter **Ausgabe** siehst du nach dem Lauf, welche Dateien sich geändert haben.
