## Aufgabe: Die Einkaufsliste füllen

Das Array `artikel` gibt es schon.

1. `eintragErstellen(text)` erzeugt ein neues `<li>` mit `text` als Inhalt und **gibt es zurück**, ohne es einzufügen.
2. Füge für jeden Artikel einen Eintrag in `#liste` ein. Nutze dafür `eintragErstellen`.
3. Entferne den Absatz `#leer`, weil die Liste jetzt nicht mehr leer ist.
4. `hinzufuegen(text)` erzeugt einen Eintrag mit `eintragErstellen` und hängt ihn an `#liste` an. Sie muss auch mit Texten wie `"<b>fett</b>"` sicher umgehen: Sie erscheinen als Text, nicht als HTML.
