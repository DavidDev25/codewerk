## Aufgabe: Benutzer und Bestellungen laden

Im Startcode stehen zwei Funktionen, die so tun, als würden sie Daten von einem Server laden. Beide geben ein Promise zurück:

- `ladeBenutzer(id)` liefert ein Objekt wie `{ name: "Mia" }`. Bei einer unbekannten `id` wird das Promise mit dem Fehler `"Benutzer nicht gefunden"` abgelehnt.
- `ladeBestellungen(name)` liefert ein Array mit den Bestellungen dieser Person.

Ändere diese beiden Funktionen nicht. Schreibe darunter:

1. `async function begruessung(id)`: Lade den Benutzer mit `await` und gib `"Hallo <name>!"` zurück, z. B. `"Hallo Mia!"`.
2. `async function bestellAnzahl(id)`: Lade erst den Benutzer, dann mit seinem Namen die Bestellungen. Gib die **Anzahl** der Bestellungen zurück.
3. `async function sicherBegruessen(id)`: Rufe `begruessung(id)` in einem `try`-Block auf und gib das Ergebnis zurück. Bei einem Fehler gib `"Unbekannter Benutzer"` zurück.
4. `async function start()`: Gib die Begrüßung für Benutzer `1` mit `console.log` aus. Rufe `start()` danach auf.
