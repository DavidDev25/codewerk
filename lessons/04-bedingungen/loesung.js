function kleidung(grad) {
  if (grad < 10) {
    return "Jacke";
  } else if (grad < 20) {
    return "Pulli";
  } else {
    return "T-Shirt";
  }
}

function darfRein(alter, mitEltern) {
  return alter >= 18 || (alter >= 16 && mitEltern);
}

function anrede(name) {
  return name ? `Hallo ${name}!` : "Hallo Gast!";
}

console.log(kleidung(15));
