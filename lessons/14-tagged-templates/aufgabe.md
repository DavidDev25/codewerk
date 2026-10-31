## Aufgabe: Die Textwerkstatt

Schreibe drei Tag-Funktionen. Jede bekommt `(teile, ...werte)` und gibt einen fertigen Text zurück.

1. `hervorheben` setzt jeden Wert zwischen Sternchen: ``hervorheben`Hallo ${"Mara"}!` `` ergibt `"Hallo *Mara*!"`.
2. `sicher` ersetzt in den **Werten** (nicht in den festen Textteilen) die Zeichen `&`, `<` und `>` durch `&amp;`, `&lt;` und `&gt;`. Ersetze `&` zuerst.
3. `euro` setzt Zahlen als Betrag mit zwei Nachkommastellen, Komma und ` €` ein: ``euro`Summe: ${12.5}` `` ergibt `"Summe: 12,50 €"`.
4. `const pfad` ist der Text `C:\neu\daten` mit echten Backslashes. Nutze `String.raw`.
