const firma = {
  name: "Chefin",
  team: [
    { name: "Ali", team: [] },
    { name: "Lea", team: [
      { name: "Tom", team: [] },
      { name: "Ben", team: [
        { name: "Mia", team: [] },
      ] },
    ] },
  ],
};

function fakultaet(n) {
  if (n <= 1) {
    return 1;
  }
  return n * fakultaet(n - 1);
}

function tiefeSumme(liste) {
  let summe = 0;
  for (const eintrag of liste) {
    summe += Array.isArray(eintrag) ? tiefeSumme(eintrag) : eintrag;
  }
  return summe;
}

function zaehleMitarbeiter(person) {
  let anzahl = 1;
  for (const kollege of person.team) {
    anzahl += zaehleMitarbeiter(kollege);
  }
  return anzahl;
}
