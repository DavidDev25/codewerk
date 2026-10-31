## Wenn Daten fehlen

Daten aus dem Internet oder aus Formularen sind oft unvollständig. Greifst du auf etwas zu, das es nicht gibt, stürzt dein Programm ab:

```js
const bestellung = { kunde: { name: "Ali" } };
console.log(bestellung.kunde.adresse);
console.log(bestellung.kunde.adresse.stadt);
```

`bestellung.kunde.adresse` ist `undefined`. Und von `undefined` kann man keine `stadt` abfragen.

## Vorsichtig nachsehen mit ?.

:::alltag
Du suchst im Schrank nach dem Karton „Weihnachten“ und darin nach der Lichterkette. Gibt es den Karton nicht, hörst du einfach auf zu suchen, statt ins Leere zu greifen. Genau das macht `?.`.
:::

```js
const bestellung = { kunde: { name: "Ali" } };
console.log(bestellung.kunde?.adresse?.stadt);
console.log(bestellung.artikel?.length);
```

Steht links von `?.` `null` oder `undefined`, bricht die ganze Kette ab und ergibt `undefined`, ohne Fehler.

## Ersatzwerte mit ??

`a ?? b` ergibt `a`, außer `a` ist `null` oder `undefined`. Dann ergibt es `b`:

```js
const bestellung = { kunde: { name: "Ali" } };
const stadt = bestellung.kunde?.adresse?.stadt ?? "unbekannt";
console.log(stadt);
```

## Warum nicht einfach ||?

`||` setzt den Ersatzwert bei **jedem** falschen Wert ein, also auch bei `0` und `""`. Das ist oft nicht gewollt:

```js
const einstellungen = { lautstaerke: 0, name: "" };

console.log(einstellungen.lautstaerke || 50);
console.log(einstellungen.lautstaerke ?? 50);

console.log(einstellungen.name || "Ohne Namen");
console.log(einstellungen.name ?? "Ohne Namen");
```

Lautstärke `0` ist eine echte Einstellung. Mit `||` wäre sie plötzlich `50`.

| Ausdruck | Ersatzwert kommt bei |
| --- | --- |
| `a || b` | `false`, `0`, `""`, `null`, `undefined`, `NaN` |
| `a ?? b` | nur `null` und `undefined` |
