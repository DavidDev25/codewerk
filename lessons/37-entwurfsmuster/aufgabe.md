## Aufgabe: Benachrichtigungen und Tierheim

1. Baue die Klasse `Ereignisse` (Observer):
   - `on(name, fn)` meldet `fn` für das Ereignis `name` an.
   - `off(name, fn)` meldet genau diese Funktion wieder ab.
   - `emit(name, ...daten)` ruft alle angemeldeten Funktionen mit den Daten auf und gibt zurück, **wie viele** aufgerufen wurden.
   - `einmal(name, fn)` meldet `fn` so an, dass sie nur beim **nächsten** `emit` aufgerufen wird.
2. Die Klassen `Hund` und `Katze` gibt es schon. Schreibe die Factory `tierErstellen(art, name)`: Bei `"hund"` ein `Hund`, bei `"katze"` eine `Katze` mit diesem Namen, sonst `null`.
