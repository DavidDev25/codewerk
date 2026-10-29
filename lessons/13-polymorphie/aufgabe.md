## Aufgabe: Formen

`Form` ist vorgegeben. Ihre Methode `beschreibe()` ruft `this.flaeche()` auf.

1. `Kreis extends Form`: Der `constructor(radius)` ruft `super()` auf und speichert `this.radius`. `flaeche()` gibt `Math.PI * radius * radius` zurück.
2. `Rechteck extends Form`: Der `constructor(breite, hoehe)` ruft `super()` auf und speichert beide Werte. `flaeche()` gibt `breite * hoehe` zurück.
3. `gesamtFlaeche(formen)` addiert die Flächen aller Formen in einem Array. Nutze **kein** `instanceof` und kein `typeof`. Rufe bei jeder Form einfach `flaeche()` auf.
