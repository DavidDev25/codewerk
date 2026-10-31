## Aufgabe: Der Funktionsbaukasten

1. `addiere` ist gecurryt: `addiere(2)(3)` ergibt `5`.
2. `const plusZehn` ist `addiere` mit fest eingesetzter `10`.
3. `pipe(...funktionen)` gibt eine Funktion zurück, die einen Wert der Reihe nach durch alle Funktionen schickt. Ohne Funktionen kommt der Wert unverändert zurück.
4. `merken(fn)` gibt eine Funktion mit **einem** Wert zurück, die jedes Ergebnis von `fn` nur einmal berechnet und danach aus einer Map holt.
5. `const fibSchnell` berechnet die Fibonacci-Zahlen (0, 1, 1, 2, 3, 5, …) **rekursiv**, aber mit `merken`, sodass auch `fibSchnell(60)` sofort fertig ist.
