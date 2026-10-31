## Aufgabe: Das Klassenbuch

Die Liste `klasse` gibt es schon. Jeder Eintrag hat einen `name` und ein Array `noten`.

1. `durchschnitt(noten)` gibt den Durchschnitt zurück, gerundet auf **eine** Nachkommastelle. `durchschnitt([1, 2, 2])` ergibt `1.7`.
2. `bewertung(schnitt)` gibt das Wort zur Durchschnittsnote zurück:
   - bis 1.5: `"sehr gut"`
   - bis 2.5: `"gut"`
   - bis 3.5: `"befriedigend"`
   - bis 4.5: `"ausreichend"`
   - darüber: `"nicht bestanden"`
3. `zeugnis(klasse)` gibt ein Array von Texten zurück, einer pro Person, im Format `"Lea: 1.7 (gut)"`.
4. `bester(klasse)` gibt den **Namen** der Person mit dem besten (kleinsten) Durchschnitt zurück.
5. `notenSpiegel(klasse)` zählt alle einzelnen Noten der ganzen Klasse und gibt ein Objekt zurück, z. B. `{ 1: 3, 2: 4, … }`. Noten, die nie vorkommen, fehlen im Objekt.
