function* zahlenAb(start) {
  let n = start;
  while (true) {
    yield n;
    n++;
  }
}

async function* alleNutzer() {
  let id = 1;
  while (true) {
    const antwort = await fetch(`/uebung/nutzer/${id}`);
    if (!antwort.ok) return;
    yield await antwort.json();
    id++;
  }
}

async function namenSammeln() {
  const namen = [];
  for await (const nutzer of alleNutzer()) {
    namen.push(nutzer.name);
  }
  return namen;
}

async function anzahlNutzer() {
  return (await Array.fromAsync(alleNutzer())).length;
}

const geradeQuadrate = zahlenAb(1)
  .filter((n) => n % 2 === 0)
  .map((n) => n * n)
  .take(3)
  .toArray();
