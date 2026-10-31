const preis = 4.5;
const anzahl = 3;
const eingabe = "2";

const gesamt = preis * anzahl;
const istGerade = anzahl % 2 === 0;
const trinkgeld = Number(eingabe);
const bezahlt = gesamt + trinkgeld;
const typVonEingabe = typeof eingabe;
console.log(bezahlt);
