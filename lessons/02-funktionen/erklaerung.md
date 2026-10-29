## Eine Funktion ist eine kleine Maschine

:::alltag
Ein Mixer: Du wirfst Obst hinein (Eingabe), drückst den Knopf und bekommst einen Saft heraus (Ergebnis). Du musst nicht jedes Mal neu überlegen, wie Mixen geht.
:::

```js
function verdoppeln(zahl) {
  return zahl * 2;
}

console.log(verdoppeln(4));
```

- `zahl` ist die **Eingabe** (Parameter).
- `return` gibt das **Ergebnis** zurück.
- Mit `verdoppeln(4)` **rufst** du die Funktion auf.

Eine Funktion ohne `return` gibt `undefined` zurück:

```js
function vergesslich(zahl) {
  zahl * 2;
}

console.log(vergesslich(4));
```

Auch mehrere Eingaben sind möglich: `function addiere(a, b) { return a + b; }`
