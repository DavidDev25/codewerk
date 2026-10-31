## Aufgabe: Die Wetter-App

Schreibe vier `async`-Funktionen, die mit der Übungs-API arbeiten (Tabelle in der Erklärung).

1. `nutzerName(id)` gibt den Namen des Nutzers mit dieser `id` zurück. Gibt es ihn nicht, `null`.
2. `wetterText(stadt)` gibt `"<stadt>: <grad> Grad, <himmel>"` zurück, also zum Beispiel `"Erlangen: 11 Grad, Regen"`. Gibt es keine Daten, `"Keine Daten für <stadt>"`. Vergiss `encodeURIComponent` nicht.
3. `notizSpeichern(text)` schickt die Notiz per `POST` an `/uebung/notizen` und gibt die `id` der gespeicherten Notiz zurück.
4. `staedte(ids)` bekommt ein Array von Nutzer-IDs und gibt ein Array mit deren Städten zurück. Hole alle Nutzer **gleichzeitig** mit `Promise.all`.
