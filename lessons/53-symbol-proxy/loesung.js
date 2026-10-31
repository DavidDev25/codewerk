const GEHEIM = Symbol("geheim");

function verstecken(obj, wert) {
  obj[GEHEIM] = wert;
  return obj;
}

function mitStandard(obj, standard) {
  return new Proxy(obj, {
    get(ziel, name, empfaenger) {
      return name in ziel ? Reflect.get(ziel, name, empfaenger) : standard;
    },
  });
}

function nurZahlen(obj) {
  return new Proxy(obj, {
    set(ziel, name, wert, empfaenger) {
      if (typeof wert !== "number") {
        throw new TypeError(`${String(name)} muss eine Zahl sein`);
      }
      return Reflect.set(ziel, name, wert, empfaenger);
    },
  });
}

function protokolliert(obj, log) {
  return new Proxy(obj, {
    set(ziel, name, wert, empfaenger) {
      log.push(`${String(name)}=${wert}`);
      return Reflect.set(ziel, name, wert, empfaenger);
    },
  });
}
