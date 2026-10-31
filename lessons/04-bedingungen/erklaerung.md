## Der Code nimmt eine Abzweigung

Bisher lief dein Code immer Zeile für Zeile von oben nach unten. Oft soll ein Programm aber je nach Lage etwas anderes tun. Dafür gibt es **Bedingungen**.

:::alltag
Morgens vor der Tür: Wenn es regnet, nimmst du den Schirm. Wenn stattdessen die Sonne scheint, die Sonnenbrille. Sonst gehst du einfach los. Genau so entscheidet Code mit `if`, `else if` und `else`.
:::

## if, else if und else

```js
function wetterTipp(wetter) {
  if (wetter === "Regen") {
    return "Schirm mitnehmen";
  } else if (wetter === "Sonne") {
    return "Sonnenbrille auf";
  } else {
    return "Einfach los";
  }
}

console.log(wetterTipp("Regen"));
console.log(wetterTipp("Nebel"));
```

Die Ausgabe ist `Schirm mitnehmen` und dann `Einfach los`. Bei „Nebel“ passt keine der beiden Bedingungen, deshalb läuft der `else`-Zweig.

So funktioniert das:

- In den runden Klammern hinter `if` steht eine Bedingung. Sie ergibt `true` oder `false`.
- JavaScript prüft die Bedingungen von oben nach unten. Nur der **erste** Zweig, der passt, läuft. Alle anderen werden übersprungen.
- `else if` und `else` darfst du auch weglassen.

## Bedingungen verknüpfen

Manchmal müssen mehrere Dinge gleichzeitig stimmen, manchmal reicht eins davon. Dafür gibt es drei Zeichen:

| Zeichen | Bedeutung | Beispiel |
| --- | --- | --- |
| `&&` | und: beide müssen stimmen | `alter >= 18 && hatTicket` |
| `||` | oder: eins reicht | `istWochenende || hatUrlaub` |
| `!` | nicht: dreht um | `!istMuede` |

```js
const alter = 17;
const hatTicket = true;
console.log(alter >= 18 && hatTicket);
console.log(alter >= 18 || hatTicket);
console.log(!hatTicket);
```

Die Ausgabe ist `false`, `true` und `false`. Mit `&&` müssen beide Teile stimmen, aber 17 ist nicht mindestens 18. Mit `||` reicht das Ticket. Und `!` dreht `true` zu `false`.

## Wahr und falsch ohne true und false

Hinter `if` darf jeder Wert stehen, nicht nur `true` oder `false`. Diese Werte zählen als falsch: `false`, `0`, `""` (ein leerer Text), `null`, `undefined` und `NaN`. Alles andere zählt als wahr.

```js
const name = "";
if (name) {
  console.log("Hallo " + name);
} else {
  console.log("Kein Name eingegeben");
}
```

Die Ausgabe ist `Kein Name eingegeben`, weil ein leerer Text als falsch zählt. So prüfst du schnell, ob überhaupt etwas eingegeben wurde.

## Die Kurzform mit ? und :

Für ein einfaches Entweder-oder gibt es eine Kurzform in einer Zeile. Vor dem Fragezeichen steht die Bedingung, dahinter der Wert für „ja“, nach dem Doppelpunkt der Wert für „nein“:

```js
const punkte = 72;
const ergebnis = punkte >= 50 ? "bestanden" : "nicht bestanden";
console.log(ergebnis);
```

Die Ausgabe ist `bestanden`, weil 72 mindestens 50 ist.

## Viele feste Fälle mit switch

Vergleichst du einen Wert mit vielen festen Möglichkeiten, ist `switch` übersichtlicher als viele `else if`:

```js
const tag = 6;
switch (tag) {
  case 6:
  case 7:
    console.log("Wochenende");
    break;
  default:
    console.log("Arbeitstag");
}
```

Die Ausgabe ist `Wochenende`. Tag 6 und 7 teilen sich hier denselben Code. `default` fängt alles andere auf. Vergiss das `break` nicht. Ohne `break` läuft der Code einfach in den nächsten Fall weiter.
