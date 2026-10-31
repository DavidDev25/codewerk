## Aufgabe: Der Ausflugs-Helfer

Du baust drei kleine Helfer für einen Ausflug. Jede Funktion trifft eine Entscheidung und gibt das Ergebnis mit `return` zurück.

### Schritt 1: Was ziehe ich an?

Schreibe `kleidung(grad)`. So soll sie antworten:

```js
kleidung(5);  // "Jacke"
kleidung(15); // "Pulli"
kleidung(25); // "T-Shirt"
```

So gehst du vor:

1. Unter 10 Grad gibt es die `"Jacke"`.
2. Sonst, unter 20 Grad, den `"Pulli"`.
3. Sonst das `"T-Shirt"`.

Wichtig: Prüfe in genau dieser Reihenfolge. Bei 5 Grad stimmt auch „unter 20“. Weil aber „unter 10“ zuerst geprüft wird, gewinnt die Jacke.

### Schritt 2: Darf ich rein?

Schreibe `darfRein(alter, mitEltern)`. Rein darf, wer mindestens 18 ist. Oder wer mindestens 16 ist **und** mit Eltern kommt.

```js
darfRein(18, false); // true
darfRein(16, true);  // true
darfRein(17, false); // false
darfRein(15, true);  // false
```

Du brauchst dafür `||` (oder) und `&&` (und). Gib das Ergebnis des Vergleichs direkt mit `return` zurück.

### Schritt 3: Die Begrüßung

Schreibe `anrede(name)`. Mit Namen grüßt sie persönlich, ohne Namen den Gast:

```js
anrede("Mara"); // "Hallo Mara!"
anrede("");     // "Hallo Gast!"
```

Nimm dafür die Kurzform mit `? :`. Ein leerer Text zählt als falsch, deshalb reicht `name` als Bedingung.
