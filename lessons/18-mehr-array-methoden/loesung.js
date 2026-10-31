const noten = [2, 1, 3, 2, 5, 1, 10];
const zeile = "Lea, Tom, Ben";

const alleBestanden = noten.every((n) => n <= 4);
const einserDabei = noten.some((n) => n === 1);
const sortiert = [...noten].sort((a, b) => a - b);
const positionFuenf = noten.indexOf(5);
const namen = zeile.split(", ");
const liste = namen.join(" und ");
