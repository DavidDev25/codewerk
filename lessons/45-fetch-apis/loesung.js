async function nutzerName(id) {
  const antwort = await fetch(`/uebung/nutzer/${id}`);
  if (!antwort.ok) {
    return null;
  }
  const nutzer = await antwort.json();
  return nutzer.name;
}

async function wetterText(stadt) {
  const antwort = await fetch(`/uebung/wetter?stadt=${encodeURIComponent(stadt)}`);
  if (!antwort.ok) {
    return `Keine Daten für ${stadt}`;
  }
  const { grad, himmel } = await antwort.json();
  return `${stadt}: ${grad} Grad, ${himmel}`;
}

async function notizSpeichern(text) {
  const antwort = await fetch("/uebung/notizen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const notiz = await antwort.json();
  return notiz.id;
}

async function staedte(ids) {
  const antworten = await Promise.all(ids.map((id) => fetch(`/uebung/nutzer/${id}`)));
  const nutzer = await Promise.all(antworten.map((antwort) => antwort.json()));
  return nutzer.map((n) => n.stadt);
}
