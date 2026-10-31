## Aufgabe: Der Zahlenautomat

1. `zaehleBis(n)` ist ein **Generator**, der nacheinander `1, 2, …, n` liefert.
2. `fibonacci()` ist ein **unendlicher** Generator für die Fibonacci-Zahlen `0, 1, 1, 2, 3, 5, 8, …`. Jede Zahl ist die Summe der beiden davor.
3. `erste(gen, n)` nimmt einen Generator und gibt ein Array mit seinen ersten `n` Werten zurück. Das muss auch mit `fibonacci()` klappen, also nicht alles auf einmal abholen.
4. `countdown` ist ein Objekt mit `start: 3`. Mach es mit `*[Symbol.iterator]()` durchlaufbar, sodass `[...countdown]` `[3, 2, 1]` ergibt.
