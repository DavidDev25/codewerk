## Aufgabe: Der robuste Datenabruf

Die Hilfsfunktion `nameVon(id)` gibt es schon. Sie liefert den Namen eines Nutzers oder **scheitert** (wirft einen Fehler), wenn es ihn nicht gibt.

1. `namenListe(ids)` holt alle Namen gleichzeitig mit `Promise.allSettled`. Für jede ID steht im Ergebnis-Array der Name oder, wenn sie scheiterte, `"unbekannt"`.
2. `schnellste(zeiten)` bekommt ein Array von Millisekunden, startet für jede Zeit eine Anfrage an `/uebung/langsam?ms=…` und gibt die `ms` der **zuerst erfolgreichen** Antwort zurück (`Promise.any`).
3. `mitZeitlimit(ms, limit)` fragt `/uebung/langsam?ms=…` an und gibt die Antwort (`{ ms }`) zurück. Dauert es länger als `limit` Millisekunden, gibt sie `"zu langsam"` zurück.
4. `abbrechbar(ms)` startet eine Anfrage an `/uebung/langsam?ms=…` und gibt **sofort** ein Objekt `{ ergebnis, abbrechen }` zurück: `ergebnis` ist das Promise der Antwort-Daten, `abbrechen()` bricht die Anfrage ab.
