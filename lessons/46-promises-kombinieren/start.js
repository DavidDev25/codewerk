// Lektion 46 – Promises kombinieren & abbrechen
async function nameVon(id) {
  const antwort = await fetch(`/uebung/nutzer/${id}`);
  if (!antwort.ok) throw new Error(`Nutzer ${id} gibt es nicht`);
  return (await antwort.json()).name;
}

// 1. async function namenListe(ids) { ... }


// 2. async function schnellste(zeiten) { ... }


// 3. async function mitZeitlimit(ms, limit) { ... }


// 4. function abbrechbar(ms) { ... }
