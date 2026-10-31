const lager = { aepfel: 12, birnen: 0, kirschen: 7, pflaumen: 0 };

const sorten = Object.keys(lager);
const gesamt = Object.values(lager).reduce((summe, menge) => summe + menge, 0);
const ausverkauft = Object.entries(lager)
  .filter(([, menge]) => menge === 0)
  .map(([sorte]) => sorte);

function verdoppeln(obj) {
  return Object.fromEntries(Object.entries(obj).map(([sorte, menge]) => [sorte, menge * 2]));
}
