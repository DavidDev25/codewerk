## Der Code nimmt eine Abzweigung

:::alltag
Morgens vor der Tür: **Wenn** es regnet, nimmst du den Schirm. **Sonst wenn** die Sonne scheint, die Sonnenbrille. **Sonst** gehst du einfach los. Genau so entscheidet Code mit `if`, `else if` und `else`.
:::

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

- In den runden Klammern steht eine **Bedingung**. Sie ergibt `true` oder `false`.
- JavaScript prüft von oben nach unten. Der **erste** passende Zweig läuft, die anderen werden übersprungen.
- `else if` und `else` sind freiwillig.

## Bedingungen verknüpfen

| Zeichen | Bedeutung | Beispiel |
| --- | --- | --- |
| `&&` | und: beide müssen stimmen | `alter >= 18 && hatTicket` |
| `||` | oder: eine reicht | `istWochenende || hatUrlaub` |
| `!` | nicht: dreht um | `!istMuede` |

```js
const alter = 17;
const hatTicket = true;
console.log(alter >= 18 && hatTicket);
console.log(alter >= 18 || hatTicket);
console.log(!hatTicket);
```

## Wahr und falsch, auch ohne true und false

`if` akzeptiert jeden Wert. Diese Werte zählen als **falsch** („falsy“): `false`, `0`, `""` (leerer Text), `null`, `undefined` und `NaN`. Alles andere zählt als wahr.

```js
const name = "";
if (name) {
  console.log("Hallo " + name);
} else {
  console.log("Kein Name eingegeben");
}
```

## Kurzform mit ? :

Für ein einfaches Entweder-oder gibt es den **Bedingungsoperator**: `bedingung ? wennJa : wennNein`.

```js
const punkte = 72;
const ergebnis = punkte >= 50 ? "bestanden" : "nicht bestanden";
console.log(ergebnis);
```

## Viele feste Fälle mit switch

Vergleichst du einen Wert mit vielen festen Möglichkeiten, ist `switch` übersichtlicher. Vergiss das `break` nicht, sonst läuft der Code in den nächsten Fall weiter.

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
