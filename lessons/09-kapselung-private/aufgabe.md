## Aufgabe: Das Konto

Baue die Klasse `Konto` mit einem privaten Feld `#saldo`:

1. `#saldo` startet bei `0`.
2. `einzahlen(betrag)` erhöht den Saldo. Beträge von `0` oder weniger werden ignoriert.
3. `abheben(betrag)` verringert den Saldo und gibt `true` zurück. Ist nicht genug Geld da (oder der Betrag ungültig), bleibt der Saldo gleich und die Methode gibt `false` zurück.
4. `kontostand()` gibt den aktuellen Saldo zurück.

Zum Schluss: Erzeuge `const meinKonto = new Konto()` und zahle `100` ein.
