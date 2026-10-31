'use strict';
// Prüft den nachgebildeten Node.js-Teil (public/js/node-runtime.js): Er läuft komplett
// im Browser-Worker, auf dem Server wird nie Nutzer-Code ausgeführt.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const sources = [read('node_modules/acorn/dist/acorn.js'), read('public/js/core.js'), read('public/js/node-runtime.js')];

async function run(files, tests, node) {
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL });
  sources.forEach((s) => vm.runInContext(s, ctx));
  ctx.__input = JSON.stringify({ files, entry: 'main.js', tests: tests || null, node: node || {} });
  return JSON.parse(await vm.runInContext('CW.runLesson(JSON.parse(__input)).then(JSON.stringify)', ctx));
}

const logs = (r) => r.logs.map((l) => l.text);

test('CommonJS: require, module.exports, exports.x, JSON, index.js, require.main', async () => {
  const r = await run({
    'main.js': 'const rechner = require("./rechner");\nconst { gruss } = require("./lib");\nconst daten = require("./daten.json");\nconsole.log(rechner.plus(1, 2), gruss(), daten.name, require.main === module, typeof __dirname);',
    'rechner.js': 'module.exports = { plus: (a, b) => a + b };',
    'lib/index.js': 'exports.gruss = () => "hallo";',
    'daten.json': '{ "name": "Codewerk" }',
  });
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['3 hallo Codewerk true string']);
});

test('Eingebaute Module per require und import, mit und ohne node:', async () => {
  const cjs = await run({ 'main.js': 'const path = require("node:path");\nconst { EventEmitter } = require("events");\nconsole.log(path.join("a", "../b", "c.txt"), typeof EventEmitter);' });
  assert.deepEqual(logs(cjs), ['b/c.txt function']);
  const esm = await run({ 'main.js': 'import fs from "node:fs";\nimport { join } from "path";\nimport EventEmitter, { once } from "node:events";\nconsole.log(typeof fs.readFileSync, join("/x", "y"), typeof EventEmitter, typeof once);' });
  assert.equal(esm.error, null);
  assert.deepEqual(logs(esm), ['function /x/y function function']);
  const falsch = await run({ 'main.js': 'import { gibtsNicht } from "node:fs";' });
  assert.match(falsch.syntaxError.message, /exportiert nichts mit dem Namen „gibtsNicht“/);
});

test('Modulart wie in Node: Erkennung, "type" in package.json, .mjs/.cjs, ESM importiert CommonJS', async () => {
  const gemischt = await run({
    'main.js': 'import rechner, { plus } from "./rechner.cjs";\nimport { mal } from "./mal.mjs";\nconsole.log(plus(1, 1), rechner.plus(2, 2), mal(2, 3));',
    'rechner.cjs': 'exports.plus = (a, b) => a + b;',
    'mal.mjs': 'export const mal = (a, b) => a * b;',
  });
  assert.equal(gemischt.error, null);
  assert.deepEqual(logs(gemischt), ['2 4 6']);
  const commonjs = await run({ 'main.js': 'import x from "./x.js";', 'x.js': 'module.exports = 1;', 'package.json': '{ "type": "commonjs" }' });
  assert.match(commonjs.syntaxError.message, /CommonJS-Datei/);
  const kaputt = await run({ 'main.js': 'console.log(1);', 'package.json': '{ "name": "x", }' });
  assert.equal(kaputt.syntaxError.file, 'package.json');
  const shebang = await run({ 'main.js': '#!/usr/bin/env node\nconsole.log("los");' });
  assert.deepEqual(logs(shebang), ['los']);
});

test('npm-Pakete und fehlende Module werden erklärt', async () => {
  const paket = await run({ 'main.js': 'const express = require("express");' });
  assert.match(paket.error.message + paket.error.raw, /npm install express/);
  const esm = await run({ 'main.js': 'import express from "express";' });
  assert.match(esm.syntaxError.message, /npm install express/);
  const fehlt = await run({ 'main.js': 'require("./gibtsnicht");' });
  assert.match(fehlt.error.raw, /„\.\/gibtsnicht“ wurde nicht gefunden/);
  assert.equal(fehlt.error.file, 'main.js');
  assert.equal(fehlt.error.line, 1);
});

test('fs: lesen, schreiben, Ordner, Fehlercodes und die Änderungsliste', async () => {
  const r = await run({
    'main.js': [
      'const fs = require("fs");',
      'console.log(fs.readFileSync("notiz.txt", "utf8"));',
      'fs.mkdirSync("daten/alt", { recursive: true });',
      'fs.writeFileSync("daten/neu.json", JSON.stringify({ a: 1 }));',
      'fs.appendFileSync("notiz.txt", " und mehr");',
      'console.log(fs.readdirSync("daten").join(","), fs.existsSync("daten/neu.json"), fs.statSync("daten").isDirectory());',
      'try { fs.readFileSync("weg.txt", "utf8"); } catch (e) { console.log(e.code); }',
      'try { fs.writeFileSync("x.json", { a: 1 }); } catch (e) { console.log(e.name); }',
      'fs.unlinkSync("alt.txt");',
    ].join('\n'),
    'notiz.txt': 'Hallo',
    'alt.txt': 'weg damit',
  });
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['Hallo', 'alt,neu.json true true', 'ENOENT', 'TypeError']);
  assert.deepEqual(r.fsChanges.map((c) => c.path + ':' + c.status), ['notiz.txt:geändert', 'daten/neu.json:neu', 'alt.txt:gelöscht']);
});

test('fs: Callbacks und fs.promises laufen asynchron', async () => {
  const r = await run({
    'main.js': [
      'const fs = require("fs");',
      'const { readFile } = require("fs/promises");',
      'fs.readFile("a.txt", "utf8", (fehler, text) => console.log("callback", text));',
      'readFile("a.txt", "utf8").then((text) => console.log("promise", text));',
      'fs.promises.readFile("fehlt.txt", "utf8").catch((e) => console.log(e.code));',
      'console.log("zuerst");',
    ].join('\n'),
    'a.txt': 'A',
  });
  assert.deepEqual(logs(r), ['zuerst', 'callback A', 'promise A', 'ENOENT']);
});

test('events: on, once, off, emit und unbehandeltes error', async () => {
  const r = await run({
    'main.js': [
      'const EventEmitter = require("events");',
      'class Laden extends EventEmitter {}',
      'const laden = new Laden();',
      'const log = (x) => console.log("bestellt", x);',
      'laden.on("bestellung", log);',
      'laden.once("bestellung", () => console.log("erste!"));',
      'laden.emit("bestellung", "Tee");',
      'laden.emit("bestellung", "Kaffee");',
      'laden.off("bestellung", log);',
      'console.log(laden.emit("bestellung", "Kakao"), laden.listenerCount("bestellung"));',
      'laden.emit("error", new Error("kaputt"));',
    ].join('\n'),
  });
  assert.deepEqual(logs(r), ['bestellt Tee', 'erste!', 'bestellt Kaffee', 'false 0']);
  assert.equal(r.error.line, 11);
});

test('process: argv, env, nextTick, stdout.write, exitCode und exit', async () => {
  const r = await run({
    'main.js': [
      'const [, , name] = process.argv;',
      'process.stdout.write("Hallo ");',
      'process.stdout.write(name + "\\n");',
      'console.log(process.env.PORT, process.env.NODE_ENV, process.cwd(), process.platform);',
      'Promise.resolve().then(() => console.log("promise"));',
      'process.nextTick(() => console.log("tick"));',
      'setImmediate(() => { console.log("immediate"); process.exitCode = 2; });',
    ].join('\n'),
  }, null, { args: ['Mara'], env: { PORT: '8080' } });
  assert.deepEqual(logs(r).slice(0, 5), ['Hallo Mara', '8080 development /projekt linux', 'tick', 'promise', 'immediate']);
  assert.match(logs(r)[5], /Exit-Code 2/);

  const exit = await run({ 'main.js': 'console.log("a");\nprocess.exit(0);\nconsole.log("b");' });
  assert.equal(exit.error, null);
  assert.deepEqual(logs(exit), ['a']);
});

test('http: Server, Anfragen aus den Tests und per fetch an localhost', async () => {
  const server = [
    'const http = require("http");',
    'const notizen = [];',
    'const server = http.createServer(async (req, res) => {',
    '  if (req.method === "GET" && req.url === "/notizen") {',
    '    res.writeHead(200, { "Content-Type": "application/json" });',
    '    res.end(JSON.stringify(notizen));',
    '  } else if (req.method === "POST" && req.url === "/notizen") {',
    '    let body = "";',
    '    for await (const teil of req) body += teil;',
    '    notizen.push(JSON.parse(body).text);',
    '    res.statusCode = 201;',
    '    res.end("ok");',
    '  } else {',
    '    res.statusCode = 404;',
    '    res.end("Nicht gefunden");',
    '  }',
    '});',
    'server.listen(3000, () => console.log("läuft auf", server.address().port));',
  ].join('\n');
  const tests = [
    'test("GET", async () => { const a = await node.anfrage("GET", "/notizen"); expect(a.status).toBe(200); expect(a.headers["content-type"]).toBe("application/json"); expect(a.json()).toEqual(["selbst"]); });',
    'test("POST", async () => { const a = await node.anfrage("POST", "/notizen", { text: "Test" }); expect(a.status).toBe(201); expect((await node.anfrage("GET", "http://localhost:3000/notizen")).json()).toEqual(["selbst", "Test"]); });',
    'test("404", async () => { expect((await node.anfrage("GET", "/x")).status).toBe(404); });',
  ].join('\n');
  const client = '\nserver.on("listening", async () => {\n  await fetch("http://localhost:3000/notizen", { method: "POST", body: JSON.stringify({ text: "selbst" }) });\n  const antwort = await fetch("http://localhost:3000/notizen");\n  console.log(antwort.status, await antwort.json());\n});';
  const r = await run({ 'main.js': server + client }, tests);
  assert.equal(r.error, null);
  assert.deepEqual(logs(r), ['läuft auf 3000', '200 ["selbst"]']);
  assert.deepEqual(r.tests.map((t) => t.ok), [true, true, true]);
});

test('http: typische Fehler werden erklärt', async () => {
  const ohneEnd = await run({ 'main.js': 'require("http").createServer((req, res) => { res.write("x"); }).listen(3000);' },
    'test("x", async () => { await node.anfrage("GET", "/"); });');
  assert.match(ohneEnd.tests[0].message, /res\.end/);
  const objekt = await run({ 'main.js': 'require("http").createServer((req, res) => { res.end({ a: 1 }); }).listen(3000);' },
    'test("x", async () => { await node.anfrage("GET", "/"); });');
  assert.equal(objekt.tests[0].ok, false);
  const keinServer = await run({ 'main.js': 'fetch("http://localhost:3000/").catch((e) => console.log(e.message));' });
  assert.match(logs(keinServer)[0], /läuft kein Server/);
});

test('Browser-Lektionen bleiben ohne Node: kein require, kein process', async () => {
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL });
  sources.forEach((s) => vm.runInContext(s, ctx));
  ctx.__input = JSON.stringify({ files: { 'main.js': 'console.log(typeof require, typeof process);' }, entry: 'main.js' });
  const r = JSON.parse(await vm.runInContext('CW.runLesson(JSON.parse(__input)).then(JSON.stringify)', ctx));
  assert.deepEqual(logs(r), ['undefined undefined']);
});
