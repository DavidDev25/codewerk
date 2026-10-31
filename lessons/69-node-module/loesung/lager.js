const lager = new Map();

function einlagern(name, menge) {
  const neu = (lager.get(name) ?? 0) + menge;
  lager.set(name, neu);
  return neu;
}

function bestand(name) {
  return lager.get(name) ?? 0;
}

module.exports = { einlagern, bestand };
