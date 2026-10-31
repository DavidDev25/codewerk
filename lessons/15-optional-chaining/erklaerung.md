## Wenn Daten fehlen

Daten aus dem Internet oder aus Formularen sind oft unvollständig. Mal fehlt eine Adresse, mal eine Telefonnummer. Greifst du auf etwas zu, das es nicht gibt, stürzt dein Programm ab:

```js
const bestellung = { kunde: { name: "Ali" } };
console.log(bestellung.kunde.adresse);
console.log(bestellung.kunde.adresse.stadt);
```

Die erste Zeile gibt noch `undefined` aus, denn eine Adresse gibt es nicht. Die zweite Zeile stürzt ab. Sie fragt nach der `stadt` von `undefined`, und das geht nicht.

## Vorsichtig nachsehen mit ?.

:::alltag
Du suchst im Schrank nach dem Karton „Weihnachten“ und darin nach der Lichterkette. Gibt es den Karton nicht, hörst du einfach auf zu suchen, statt ins Leere zu greifen.
:::

Genau das macht `?.`, das **Optional Chaining**. Statt eines Punkts schreibst du ein Fragezeichen mit Punkt:

```js
const bestellung = { kunde: { name: "Ali" } };
console.log(bestellung.kunde?.adresse?.stadt);
console.log(bestellung.artikel?.length);
```

Beide Zeilen geben `undefined` aus, ohne Fehler. Ist der Wert links von `?.` gleich `null` oder `undefined`, bricht die ganze Kette sofort ab. Das Ergebnis ist dann einfach `undefined`.

## Ersatzwerte mit ??

Oft willst du statt `undefined` lieber einen sinnvollen Ersatz anzeigen. Dafür gibt es `??`. Es nimmt den linken Wert, außer der ist `null` oder `undefined`. Dann nimmt es den rechten:

```js
const bestellung = { kunde: { name: "Ali" } };
const stadt = bestellung.kunde?.adresse?.stadt ?? "unbekannt";
console.log(stadt);
```

Die Ausgabe ist `unbekannt`. Die Kette mit `?.` ergibt `undefined`, deshalb springt der Ersatzwert ein.

## Warum nicht einfach ||?

Vielleicht kennst du `||` als „oder“. Es setzt auch Ersatzwerte ein, aber bei jedem Wert, der als falsch zählt, also auch bei `0` und `""`. Das ist oft nicht gewollt:

```js
const einstellungen = { lautstaerke: 0, name: "" };

console.log(einstellungen.lautstaerke || 50);
console.log(einstellungen.lautstaerke ?? 50);

console.log(einstellungen.name || "Ohne Namen");
console.log(einstellungen.name ?? "Ohne Namen");
```

Die Ausgabe ist 50, 0, `Ohne Namen` und ein leerer Text. Eine Lautstärke von 0 ist aber eine echte Einstellung: Jemand hat den Ton ausgeschaltet. Mit `||` wäre sie plötzlich 50. `??` lässt die 0 stehen.

| Ausdruck | Der Ersatzwert kommt bei |
| --- | --- |
| `a || b` | `false`, `0`, `""`, `null`, `undefined`, `NaN` |
| `a ?? b` | nur bei `null` und `undefined` |
