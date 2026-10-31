## Aufgabe: Eine Seite für alle

1. **Karte:** Ein Klick auf `#karte` schaltet die Klasse `offen` um. Ein Klick auf den Knopf `#merken` schreibt `"Gemerkt!"` in `#gemerkt`, darf die Karte aber **nicht** umschalten.
2. **Menü:** Ein Klick auf `#menue-knopf` blendet `#menue` ein oder aus (`hidden`) und setzt `aria-expanded` auf `"true"` bzw. `"false"`.
3. **Escape:** Drückt man irgendwo auf der Seite `Escape` (`keydown` auf `document`), wird das Menü geschlossen, `aria-expanded` wird `"false"`, und der Fokus geht zurück auf `#menue-knopf`.
4. **Pfeiltasten:** In `#auswahl` bewegt `ArrowDown` den Fokus zum nächsten, `ArrowUp` zum vorherigen Eintrag. Am Ende bleibt der Fokus stehen. Nutze **einen** Listener auf `#auswahl`.
