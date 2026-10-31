## Aufgabe: Die Textwerkstatt

Du baust drei Tags, die Werte auf ihre eigene Art in einen Text einsetzen. Jeder Tag bekommt `(teile, ...werte)` und gibt den fertigen Text zurück. Das Muster dafür kennst du aus der Erklärung: erst `teile[0]`, dann für jeden Wert den Wert und das nächste Textstück.

### Schritt 1: Hervorheben

`hervorheben` setzt jeden Wert zwischen zwei Sternchen:

```js
const name = "Mara";
hervorheben`Hallo ${name}!`; // "Hallo *Mara*!"
hervorheben`Nur Text`;       // "Nur Text"
```

### Schritt 2: Sicher einsetzen

`sicher` entschärft gefährliche Zeichen in den Werten. Die festen Textstücke bleiben, wie sie sind:

```js
const eingabe = "<b>Tom & Jerry</b>";
sicher`<p>${eingabe}</p>`;
// "<p>&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;</p>"
```

So gehst du vor:

1. Ersetze in jedem Wert zuerst `&` durch `&amp;`.
2. Dann `<` durch `&lt;`.
3. Dann `>` durch `&gt;`.

Wichtig: Fang mit `&` an. Sonst würdest du das `&` in `&lt;` noch einmal ersetzen.

### Schritt 3: Euro-Beträge

`euro` setzt Zahlen als Geldbetrag ein, mit zwei Nachkommastellen, Komma und Euro-Zeichen:

```js
euro`Summe: ${12.5}`;          // "Summe: 12,50 €"
euro`${3} plus ${0.5}`;        // "3,00 € plus 0,50 €"
```

Das kennst du aus Lektion 6: `toFixed(2)`, dann den Punkt gegen ein Komma tauschen.

### Schritt 4: Ein Windows-Pfad

Lege `const pfad` an. Darin steht `C:\neu\daten` mit echten Backslashes. Nimm dafür `String.raw`.
