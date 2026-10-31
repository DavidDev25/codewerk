## Datum und Uhrzeit

Für Datum und Uhrzeit gibt es in JavaScript das Objekt `Date`. Im Beispiel liest du das heutige Datum aus und legst ein festes Datum an:

```js
const jetzt = new Date();
console.log(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());

const heiligabend = new Date("2026-12-24");
console.log(heiligabend.toISOString());
```

Die erste Zeile zeigt Jahr, Monat und Tag von heute. Die zweite zeigt Heiligabend in einer festen Schreibweise: `2026-12-24T00:00:00.000Z`. Das Z am Ende steht für Weltzeit.

Zwei Fallen solltest du gleich kennen:

1. **Monate zählen ab 0.** Januar ist `0`, Dezember ist `11`. Am 31. Oktober liefert `getMonth()` also 9. Und `new Date(2026, 11, 24)` ist der 24. Dezember.
2. **Zeitzonen.** `new Date("2026-12-24")` ist Mitternacht in **Weltzeit**, auf Englisch UTC. In Deutschland ist es da schon 1 Uhr. Wer das vergisst, zeigt schnell den falschen Tag an.

## Mit Daten rechnen

Intern ist ein Datum eine Zahl: die Millisekunden seit dem 1. Januar 1970. Ziehst du zwei Daten voneinander ab, bekommst du den Abstand in Millisekunden. Im Beispiel rechnest du aus, wie viele Tage es noch bis Heiligabend sind:

```js
const start = new Date("2026-10-31");
const ziel = new Date("2026-12-24");
const MS_PRO_TAG = 24 * 60 * 60 * 1000;
console.log((ziel - start) / MS_PRO_TAG);
```

Heraus kommt 54. Ein Tag hat 24 Stunden mit je 60 Minuten mit je 60 Sekunden mit je 1000 Millisekunden. Teilst du den Abstand durch diese Zahl, bekommst du Tage.

:::alltag
Stell dir einen Zollstock vor, auf dem jede Millisekunde seit 1970 einen Strich hat. Zwei Daten sind zwei Striche. Ihr Abstand ist eine ganz normale Subtraktion.
:::

## Schön anzeigen mit Intl

Jedes Land schreibt Daten und Zahlen anders. In den USA steht `12/24/2026`, in Deutschland `24.12.2026`. Das eingebaute `Intl` kennt diese Regeln. Im Beispiel zeigst du dasselbe Datum auf drei Arten:

```js
const datum = new Date("2026-12-24");
const format = new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "UTC" });
console.log(format.format(datum));

const kurz = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
console.log(kurz.format(datum));

const tag = new Intl.DateTimeFormat("de-DE", { weekday: "long", timeZone: "UTC" });
console.log(tag.format(datum));
```

Ausgegeben werden „24. Dezember 2026“, „24.12.2026“ und „Donnerstag“. `"de-DE"` steht für Deutsch, wie es in Deutschland geschrieben wird. Mit `timeZone: "UTC"` zeigst du genau den Tag an, der im Text stand, egal wo der Computer steht.

Auch Zahlen und Preise kann `Intl` schreiben:

```js
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
console.log(euro.format(1234.5));

console.log(new Intl.NumberFormat("de-DE").format(1234567.891));
console.log(new Intl.NumberFormat("en-US").format(1234567.891));
```

Der Preis erscheint als „1.234,50 €“. Die große Zahl steht auf Deutsch als „1.234.567,891“ und auf Englisch als „1,234,567.891“. Punkt und Komma sind also genau vertauscht. Tausenderpunkte, Komma und Euro-Zeichen musst du nicht mehr von Hand bauen.

Zwischen Betrag und `€` steht übrigens ein **geschütztes** Leerzeichen. Es sorgt dafür, dass beides nie auf zwei Zeilen landet.

## „Vor 3 Tagen“

Für Angaben wie „gestern“ oder „in 2 Wochen“ gibt es `Intl.RelativeTimeFormat`:

```js
const relativ = new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" });
console.log(relativ.format(-1, "day"));
console.log(relativ.format(-3, "day"));
console.log(relativ.format(2, "week"));
```

Ausgegeben werden „gestern“, „vor 3 Tagen“ und „in 2 Wochen“. Negative Zahlen liegen in der Vergangenheit, positive in der Zukunft. Mit `numeric: "auto"` schreibt `Intl` „gestern“ statt „vor 1 Tag“.
