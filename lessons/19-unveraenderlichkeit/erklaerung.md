## Warum man das Original nicht ändert

In Lektion 12 hast du gesehen, dass zwei Variablen auf **dasselbe** Objekt zeigen können. Ändert eine Stelle das Objekt, ist es überall geändert. Genau so entstehen viele Fehler, nach denen man lange sucht.

:::alltag
Denk an einen Vertrag. Du schreibst nicht im Original herum. Du machst eine Kopie und änderst die. Das Original bleibt als sichere Fassung liegen, und jeder kann sehen, was sich geändert hat.
:::

Viele moderne Programme arbeiten deshalb so: Sie ändern Daten nicht, sondern erzeugen eine geänderte Kopie. Man nennt das **unveränderlich** arbeiten. Auch React, das du später kennenlernst, funktioniert so.

## Listen ändern, ohne sie anzufassen

In Lektion 18 musstest du vor `sort` selbst eine Kopie anlegen. Seit 2023 gibt es Methoden, die das für dich erledigen. Das Beispiel probiert vier davon an derselben Liste aus:

```js
const zahlen = [3, 1, 2];

console.log(zahlen.toSorted((a, b) => a - b));
console.log(zahlen.toReversed());
console.log(zahlen.with(0, 10));
console.log(zahlen.toSpliced(1, 1));
console.log(zahlen);
```

- `toSorted` liefert eine sortierte Kopie: `[1, 2, 3]`.
- `toReversed` liefert eine umgedrehte Kopie: `[2, 1, 3]`.
- `with(0, 10)` ersetzt das Element an Position 0 durch 10: `[10, 1, 2]`.
- `toSpliced(1, 1)` entfernt ab Position 1 ein Element: `[3, 2]`.

Die letzte Zeile zeigt, dass `zahlen` immer noch `[3, 1, 2]` ist. Zu jeder alten Methode gibt es eine neue, die eine Kopie liefert:

| verändert das Original | liefert eine Kopie |
| --- | --- |
| `sort` | `toSorted` |
| `reverse` | `toReversed` |
| `splice` | `toSpliced` |
| `liste[0] = x` | `liste.with(0, x)` |

## Objekte einfrieren

`Object.freeze` friert ein Objekt ein. Danach kann niemand mehr etwas daran ändern. Im Beispiel versucht der Code trotzdem, das Thema zu ändern:

```js
const einstellungen = Object.freeze({ thema: "hell" });
try {
  einstellungen.thema = "dunkel";
} catch (fehler) {
  console.log("Nicht erlaubt:", fehler.message);
}
console.log(einstellungen.thema, Object.isFrozen(einstellungen));
```

Der Versuch löst einen Fehler aus, und `catch` gibt ihn mit „Nicht erlaubt:“ aus. Danach steht `thema` immer noch auf „hell“. `Object.isFrozen` bestätigt mit `true`, dass das Objekt eingefroren ist. In manchen Umgebungen gibt es keinen Fehler, und die Änderung wird still ignoriert. Geändert wird das Objekt aber nie.

Wichtig: `freeze` friert nur die **oberste Ebene** ein. Steckt im Objekt ein weiteres Objekt, lässt sich das weiterhin ändern.

## Flache und tiefe Kopien

Auch `{ ...obj }` kopiert nur die oberste Ebene. Ein Objekt, das darin steckt, wird nicht kopiert. Beide Fassungen teilen es sich. Das Beispiel zeigt den Unterschied zu `structuredClone`:

```js
const kurs = { titel: "JS", ort: { stadt: "Nürnberg" } };

const flach = { ...kurs };
flach.ort.stadt = "Fürth";
console.log(kurs.ort.stadt);

const kurs2 = { titel: "JS", ort: { stadt: "Nürnberg" } };
const tief = structuredClone(kurs2);
tief.ort.stadt = "Fürth";
console.log(kurs2.ort.stadt);
```

Die erste Ausgabe ist „Fürth“. Geändert wurde nur `flach`, trotzdem hat sich auch die Stadt in `kurs` geändert. Der Grund: Beide benutzen dasselbe `ort`-Objekt. Die zweite Ausgabe ist „Nürnberg“. `structuredClone` kopiert **alle Ebenen**, deshalb bleibt `kurs2` unberührt. Nur Funktionen kann `structuredClone` nicht kopieren.

## Eine Änderung als Kopie

Eine Funktion, die Daten „ändert“, gibt in diesem Stil eine neue Fassung zurück. Das alte Objekt lässt sie in Ruhe:

```js
function umbenennen(person, neuerName) {
  return { ...person, name: neuerName };
}

const alt = { name: "Lea", alter: 30 };
const neu = umbenennen(alt, "Mia");
console.log(alt.name, neu.name);
```

Ausgegeben wird „Lea Mia“. `{ ...person, name: neuerName }` kopiert zuerst alle Eigenschaften und überschreibt danach den Namen. `alt` heißt deshalb immer noch Lea.
