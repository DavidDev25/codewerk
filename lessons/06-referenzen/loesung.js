const original = { name: "Mara", punkte: 5 };

const kopie = { ...original };

kopie.punkte = 100;

function plusEins(obj) {
  obj.punkte = obj.punkte + 1;
}

function plusEinsKopie(obj) {
  const neu = { ...obj };
  neu.punkte = neu.punkte + 1;
  return neu;
}
