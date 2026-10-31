const auto = {
  marke: "VW",
  baujahr: 2015,
  farbe: "blau",
};

auto.farbe = "rot";
auto.tueren = 4;

function beschreibe(fahrzeug) {
  return `${fahrzeug.marke}, Baujahr ${fahrzeug.baujahr}, ${fahrzeug.farbe}`;
}

console.log(beschreibe(auto));
