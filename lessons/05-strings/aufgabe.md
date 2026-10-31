## Aufgabe: Das Anmeldeformular

Menschen tippen in Formulare oft unordentlich: mit Leerzeichen, in Großbuchstaben oder viel zu lang. Du schreibst vier Funktionen, die solche Eingaben aufräumen.

### Schritt 1: Die Initialen

Schreibe `initialen(vorname, nachname)`. Sie gibt die beiden Anfangsbuchstaben groß und mit Punkt zurück:

```js
initialen("mara", "schulz"); // "M.S."
initialen("Ali", "Yilmaz");  // "A.Y."
```

So gehst du vor:

1. Hol dir das erste Zeichen mit `vorname[0]` und mach es mit `toUpperCase()` groß.
2. Mach dasselbe mit `nachname`.
3. Setze beides mit den Punkten zu einem Text zusammen.

### Schritt 2: Die E-Mail aufräumen

Schreibe `bereinigen(text)`. Sie entfernt Leerzeichen am Rand und macht alles klein:

```js
bereinigen("  Mara@Beispiel.de "); // "mara@beispiel.de"
```

Du kannst die beiden Methoden direkt hintereinander hängen.

### Schritt 3: Ist das ein Bild?

Schreibe `istBild(dateiname)`. Sie gibt `true` zurück, wenn der Name auf `.png` oder `.jpg` endet:

```js
istBild("urlaub.png");        // true
istBild("FOTO.JPG");          // true
istBild("lebenslauf.pdf");    // false
istBild("png-anleitung.txt"); // false
```

Wichtig: `"FOTO.JPG"` ist groß geschrieben. Mach den Namen deshalb zuerst klein und prüfe dann mit `endsWith`.

### Schritt 4: Zu lange Texte kürzen

Schreibe `kuerzen(text, max)`. Ist der Text höchstens `max` Zeichen lang, bleibt er, wie er ist. Sonst schneidest du ihn nach `max` Zeichen ab und hängst `"…"` an:

```js
kuerzen("Hallo", 10);              // "Hallo"
kuerzen("Hallo", 5);               // "Hallo"
kuerzen("Codewerk ist super", 8);  // "Codewerk…"
```

Das `…` ist ein einzelnes Zeichen, keine drei Punkte. Kopier es am besten aus dieser Aufgabe.
