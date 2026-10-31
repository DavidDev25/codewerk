const pkg = require("./package.json");

// 4. Passt die Version zum Bereich? z. B. passt("4.22.3", "^4.21.2") === true
function passt(version, bereich) {
  return false;
}

// 5. Hauptprogramm (fertig): So sähe es nach npm install aus
const installiert = { express: "4.22.3", eslint: "9.18.0" };

console.log(`${pkg.name} v${pkg.version}`);
const alle = { ...pkg.dependencies, ...pkg.devDependencies };
for (const [name, bereich] of Object.entries(alle)) {
  const version = installiert[name];
  console.log(`${name} ${bereich}: installiert ${version} ${passt(version, bereich) ? "passt" : "passt nicht"}`);
}

module.exports = { passt };
