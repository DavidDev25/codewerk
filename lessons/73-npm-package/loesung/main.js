const pkg = require("./package.json");

function zahlen(version) {
  return version.split(".").map(Number);
}

function mindestens(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

function passt(version, bereich) {
  if (bereich === "*") return true;
  const zeichen = bereich[0];
  const v = zahlen(version);
  if (zeichen !== "^" && zeichen !== "~") return version === bereich;
  const b = zahlen(bereich.slice(1));
  if (!mindestens(v, b) || v[0] !== b[0]) return false;
  if (zeichen === "~" || b[0] === 0) return v[1] === b[1];
  return true;
}

const installiert = { express: "4.22.3", eslint: "9.18.0" };

console.log(`${pkg.name} v${pkg.version}`);
const alle = { ...pkg.dependencies, ...pkg.devDependencies };
for (const [name, bereich] of Object.entries(alle)) {
  const version = installiert[name];
  console.log(`${name} ${bereich}: installiert ${version} ${passt(version, bereich) ? "passt" : "passt nicht"}`);
}

module.exports = { passt };
