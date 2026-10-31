## Aufgabe: Der Mini-Router

1. `parameter(adresse)` gibt die Suchparameter einer Adresse als Objekt zurück: `parameter("https://shop.de/?q=tee&seite=2")` ergibt `{ q: "tee", seite: "2" }`.
2. `suchLink(basis, werte)` baut aus einer Basisadresse und einem Objekt eine vollständige Adresse: `suchLink("https://shop.de/suche", { q: "rote schuhe", seite: 2 })` ergibt `"https://shop.de/suche?q=rote+schuhe&seite=2"`.
3. **Router:** Das Objekt `seiten` gibt es schon. `zeigen()` liest `location.hash` (leer zählt als `"#/"`) und
   - schreibt den passenden Text aus `seiten` in `#inhalt`, bei unbekannten Adressen `"Seite nicht gefunden"`,
   - setzt bei dem Link in der Navigation, dessen `href` passt, `aria-current="page"` und entfernt es bei allen anderen.

   Rufe `zeigen()` beim Start auf und bei jedem `hashchange`.
