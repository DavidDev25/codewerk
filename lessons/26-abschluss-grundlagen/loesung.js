const klasse = [
  { name: "Lea", noten: [1, 2, 2] },
  { name: "Tom", noten: [3, 4, 3, 2] },
  { name: "Ben", noten: [5, 4, 5] },
  { name: "Mia", noten: [1, 1, 2, 1] },
];

function durchschnitt(noten) {
  const summe = noten.reduce((bisher, note) => bisher + note, 0);
  return Math.round((summe / noten.length) * 10) / 10;
}

function bewertung(schnitt) {
  if (schnitt <= 1.5) {
    return "sehr gut";
  } else if (schnitt <= 2.5) {
    return "gut";
  } else if (schnitt <= 3.5) {
    return "befriedigend";
  } else if (schnitt <= 4.5) {
    return "ausreichend";
  }
  return "nicht bestanden";
}

function zeugnis(klasse) {
  return klasse.map(({ name, noten }) => {
    const schnitt = durchschnitt(noten);
    return `${name}: ${schnitt} (${bewertung(schnitt)})`;
  });
}

function bester(klasse) {
  const sortiert = [...klasse].sort((a, b) => durchschnitt(a.noten) - durchschnitt(b.noten));
  return sortiert[0].name;
}

function notenSpiegel(klasse) {
  const spiegel = {};
  for (const { noten } of klasse) {
    for (const note of noten) {
      spiegel[note] = (spiegel[note] ?? 0) + 1;
    }
  }
  return spiegel;
}
