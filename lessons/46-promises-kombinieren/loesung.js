async function nameVon(id) {
  const antwort = await fetch(`/uebung/nutzer/${id}`);
  if (!antwort.ok) throw new Error(`Nutzer ${id} gibt es nicht`);
  return (await antwort.json()).name;
}

async function namenListe(ids) {
  const ergebnisse = await Promise.allSettled(ids.map((id) => nameVon(id)));
  return ergebnisse.map((e) => (e.status === "fulfilled" ? e.value : "unbekannt"));
}

async function schnellste(zeiten) {
  const antwort = await Promise.any(zeiten.map((ms) => fetch(`/uebung/langsam?ms=${ms}`).then((r) => r.json())));
  return antwort.ms;
}

async function mitZeitlimit(ms, limit) {
  try {
    const antwort = await fetch(`/uebung/langsam?ms=${ms}`, { signal: AbortSignal.timeout(limit) });
    return await antwort.json();
  } catch (fehler) {
    return "zu langsam";
  }
}

function abbrechbar(ms) {
  const controller = new AbortController();
  const ergebnis = fetch(`/uebung/langsam?ms=${ms}`, { signal: controller.signal }).then((r) => r.json());
  return { ergebnis, abbrechen: () => controller.abort() };
}
