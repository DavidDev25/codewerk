import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";

export function laden(datei) {
  try {
    return JSON.parse(readFileSync(datei, "utf8"));
  } catch (fehler) {
    if (fehler.code === "ENOENT") return [];
    throw fehler;
  }
}

export class Speicher extends EventEmitter {
  #datei;
  #notizen;

  constructor(datei) {
    super();
    this.#datei = datei;
    this.#notizen = laden(datei);
  }

  alle() {
    return this.#notizen;
  }

  finden(id) {
    return this.#notizen.find((n) => n.id === id) ?? null;
  }

  hinzufuegen(text) {
    const id = Math.max(0, ...this.#notizen.map((n) => n.id)) + 1;
    const notiz = { id, text, erledigt: false };
    this.#notizen.push(notiz);
    this.#sichern();
    return notiz;
  }

  aendern(id, felder) {
    const notiz = this.finden(id);
    if (!notiz) return null;
    if (typeof felder.text === "string" && felder.text.trim()) notiz.text = felder.text;
    if (typeof felder.erledigt === "boolean") notiz.erledigt = felder.erledigt;
    this.#sichern();
    return notiz;
  }

  loeschen(id) {
    const vorher = this.#notizen.length;
    this.#notizen = this.#notizen.filter((n) => n.id !== id);
    if (this.#notizen.length === vorher) return false;
    this.#sichern();
    return true;
  }

  #sichern() {
    mkdirSync(path.dirname(this.#datei), { recursive: true });
    writeFileSync(this.#datei, JSON.stringify(this.#notizen, null, 2));
    this.emit("gespeichert", this.#notizen.length);
  }
}
