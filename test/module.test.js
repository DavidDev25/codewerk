'use strict';
// Prüft die Mehrdatei-Module in core.js: import/export werden im Worker zu einem
// internen Register umgeschrieben (keine blob:-URLs, die CSP bleibt streng).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const acornSource = fs.readFileSync(path.join(ROOT, 'node_modules', 'acorn', 'dist', 'acorn.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(ROOT, 'public', 'js', 'core.js'), 'utf8');

async function run(files, tests, extra) {
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL });
  vm.runInContext(acornSource, ctx);
  vm.runInContext(coreSource, ctx);
  ctx.__input = JSON.stringify(Object.assign({ files, entry: 'main.js', tests: tests || null }, extra));
  return JSON.parse(await vm.runInContext('CW.runLesson(JSON.parse(__input)).then(JSON.stringify)', ctx));
}

const logs = (r) => r.logs.map((l) => l.text);

test('Benannte Exporte, Standard-Export, Umbenennen und Namensraum', async () => {
  const r = await run({
    'main.js': 'import gruss, { verdoppeln, PI as kreis } from "./mathe.js";\nimport * as m from "./mathe.js";\nconsole.log(verdoppeln(2), kreis, gruss("Mara"), Object.keys(m).join(","));',
    'mathe.js': 'const geheim = 2;\nexport function verdoppeln(x) { return x * geheim; }\nexport const PI = 3;\nexport default (name) => "Hallo " + name;',
  });
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['4 3 Hallo Mara PI,default,verdoppeln']);
});

test('Jedes Modul wird genau einmal ausgeführt, Abhängigkeiten zuerst', async () => {
  const r = await run({
    'main.js': 'import "./a.js";\nimport "./b.js";\nconsole.log("main");',
    'a.js': 'import { wert } from "./geteilt.js";\nconsole.log("a", wert);',
    'b.js': 'import { wert } from "./geteilt.js";\nconsole.log("b", wert);',
    'geteilt.js': 'console.log("geteilt");\nexport const wert = 1;',
  });
  assert.deepEqual(logs(r), ['geteilt', 'a 1', 'b 1', 'main']);
});

test('Weiterreichen: export { … } from, export * from, Unterordner', async () => {
  const r = await run({
    'main.js': 'import { plus, mal, Werkzeug } from "./lib/index.js";\nconsole.log(plus(1, 2), mal(2, 3), Werkzeug.name);',
    'lib/index.js': 'export { plus } from "./rechnen.js";\nexport * from "../mehr.js";\nexport { default as Werkzeug } from "./werkzeug.js";',
    'lib/rechnen.js': 'export const plus = (a, b) => a + b;',
    'lib/werkzeug.js': 'export default class Werkzeug {}',
    'mehr.js': 'export const mal = (a, b) => a * b;',
  });
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['3 6 Werkzeug']);
});

test('Live-Bindung über den Namensraum, Importe sind schreibgeschützt', async () => {
  const r = await run({
    'main.js': 'import * as z from "./zaehler.js";\nimport { erhoehen } from "./zaehler.js";\nerhoehen(); erhoehen();\nconsole.log(z.stand);\nz.stand = 5;',
    'zaehler.js': 'export let stand = 0;\nexport function erhoehen() { stand++; }',
  });
  assert.deepEqual(logs(r), ['2']);
  assert.equal(r.error.name, 'TypeError');
  assert.equal(r.error.file, 'main.js');
  assert.equal(r.error.line, 5);
});

test('Fehler nennen Datei, Zeile und Spalte', async () => {
  const r = await run({
    'main.js': 'import { teilen } from "./rechner.js";\nteilen(1, 0);',
    'rechner.js': 'export function teilen(a, b) {\n  if (b === 0) throw new Error("Nicht durch 0");\n  return a / b;\n}',
  });
  assert.equal(r.error.file, 'rechner.js');
  assert.equal(r.error.line, 2);
  assert.equal(r.error.column, 22);
});

test('Fehler in Zeile 1 eines Moduls haben die richtige Spalte', async () => {
  const r = await run({ 'main.js': 'import "./a.js";', 'a.js': 'export const x = 1; nichtDa();' });
  assert.equal(r.error.file, 'a.js');
  assert.equal(r.error.line, 1);
  assert.equal(r.error.column, 21);
});

test('Syntaxfehler zeigen auf die richtige Datei', async () => {
  const r = await run({ 'main.js': 'import "./a.js";', 'a.js': 'const x = ;' });
  assert.equal(r.syntaxError.file, 'a.js');
  assert.equal(r.syntaxError.line, 1);
});

test('Falsche Importe werden vor dem Start erklärt', async () => {
  const fehlt = await run({ 'main.js': 'import { minus } from "./mathe.js";', 'mathe.js': 'export const plus = 1;' });
  assert.equal(fehlt.syntaxError.file, 'main.js');
  assert.match(fehlt.syntaxError.message, /mathe\.js exportiert nichts mit dem Namen „minus“\. Vorhanden: plus/);

  const ohneDefault = await run({ 'main.js': 'import mathe from "./mathe.js";', 'mathe.js': 'export const plus = 1;' });
  assert.match(ohneDefault.syntaxError.message, /keinen Standard-Export/);

  const endung = await run({ 'main.js': 'import { plus } from "./mathe";', 'mathe.js': 'export const plus = 1;' });
  assert.match(endung.syntaxError.message, /Endung \.js/);

  const nackt = await run({ 'main.js': 'import { plus } from "mathe.js";', 'mathe.js': 'export const plus = 1;' });
  assert.match(nackt.syntaxError.message, /mit \.\/ davor/);

  const datei = await run({ 'main.js': 'import { plus } from "./mahte.js";', 'mathe.js': 'export const plus = 1;' });
  assert.match(datei.syntaxError.message, /gibt es nicht.*Vorhanden: main\.js, mathe\.js/);
});

test('Top-Level-await und dynamisches import()', async () => {
  const r = await run({
    'main.js': 'import { daten } from "./laden.js";\nconsole.log("main", daten.length);\nconst extra = await import("./extra.js");\nconsole.log(extra.default());\nconsole.log(import.meta.url);',
    'laden.js': 'const antwort = await fetch("/uebung/nutzer");\nexport const daten = await antwort.json();\nconsole.log("geladen");',
    'extra.js': 'export default () => "extra";',
  }, 'test("x", () => { expect(modul("laden.js").daten.length).toBe(3); });');
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['geladen', 'main 3', 'extra', 'file:///main.js']);
  assert.deepEqual(r.tests.map((t) => t.ok), [true]);
});

test('Tests erreichen Module über modul() und Quelltext über source(datei)', async () => {
  const r = await run({
    'main.js': 'import { addiere } from "./rechner.js";\nconst summe = addiere(2, 3);',
    'rechner.js': 'const verlauf = [];\nexport function addiere(a, b) { verlauf.push(a + b); return a + b; }',
  }, [
    'test("modul", () => { expect(modul("./rechner.js").addiere(1, 1)).toBe(2); expect(modul("rechner.js").verlauf).toBeUndefined(); });',
    'test("quelle", () => { expect(source("rechner.js")).toMatch(/export function/); expect(source()).toMatch(/import/); });',
    'test("fehlt", () => { expect(() => modul("gibtsnicht.js")).toThrow(); });',
  ].join('\n'));
  assert.deepEqual(r.tests.map((t) => t.ok), [true, true, true]);
  assert.deepEqual(r.snapshot.variables.map((v) => v.name + ':' + v.kind), ['addiere:import', 'summe:const']);
});

test('Schleifenschutz greift auch in Modulen', async () => {
  const r = await run({ 'main.js': 'import "./endlos.js";', 'endlos.js': 'export let n = 0;\nwhile (true) { n++; }' }, null, { loopGuard: true });
  assert.equal(r.error.file, 'endlos.js');
  assert.match(r.error.message, /Schleife/);
});
