(function (root) {
  'use strict';

  const CW = {};

  const STRICT_PREFIX = "'use strict';";
  const SOURCE_NAME = 'user.js';
  const MAX_LOG_LINES = 300;

  function cut(text, max) {
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }

  function className(value) {
    try {
      const proto = Object.getPrototypeOf(value);
      if (proto && Object.prototype.hasOwnProperty.call(proto, 'constructor')) {
        return proto.constructor.name || '';
      }
    } catch (e) { }
    return '';
  }

  function isClassFunction(fn) {
    try {
      return /^class[\s{]/.test(Function.prototype.toString.call(fn));
    } catch (e) {
      return false;
    }
  }

  function show(value, depth, seen) {
    depth = depth || 0;
    seen = seen || [];
    const type = typeof value;
    if (value === null) return 'null';
    if (type === 'undefined') return 'undefined';
    if (type === 'string') return JSON.stringify(cut(value, 80));
    if (type === 'number') return Object.is(value, -0) ? '-0' : String(value);
    if (type === 'bigint') return value + 'n';
    if (type === 'boolean') return String(value);
    if (type === 'symbol') return value.toString();
    if (type === 'function') {
      return (isClassFunction(value) ? '[Klasse ' : '[Funktion ') + (value.name || 'anonym') + ']';
    }
    if (seen.indexOf(value) !== -1) return '[Zirkulär]';
    const tag = Object.prototype.toString.call(value);
    if (tag === '[object Date]') return isNaN(value) ? 'Invalid Date' : value.toISOString();
    if (tag === '[object RegExp]') return String(value);
    if (tag === '[object Error]') return value.name + ': ' + value.message;
    if (depth > 3) return Array.isArray(value) ? '[…]' : '{…}';
    seen = seen.concat([value]);

    if (Array.isArray(value)) {
      const items = value.slice(0, 10).map(function (v) { return show(v, depth + 1, seen); });
      if (value.length > 10) items.push('… +' + (value.length - 10));
      return '[' + items.join(', ') + ']';
    }
    if (tag === '[object Map]') {
      const parts = [];
      value.forEach(function (v, k) { if (parts.length < 6) parts.push(show(k, depth + 1, seen) + ' => ' + show(v, depth + 1, seen)); });
      return 'Map(' + value.size + ') {' + parts.join(', ') + '}';
    }
    if (tag === '[object Set]') {
      const parts = [];
      value.forEach(function (v) { if (parts.length < 6) parts.push(show(v, depth + 1, seen)); });
      return 'Set(' + value.size + ') {' + parts.join(', ') + '}';
    }
    const keys = Object.keys(value);
    const name = className(value);
    const prefix = name && name !== 'Object' ? name + ' ' : '';
    if (keys.length === 0) return prefix + '{}';
    const props = keys.slice(0, 8).map(function (k) { return k + ': ' + show(value[k], depth + 1, seen); });
    if (keys.length > 8) props.push('…');
    return prefix + '{ ' + props.join(', ') + ' }';
  }
  CW.show = show;

  function formatLog(args) {
    return args.map(function (a) { return typeof a === 'string' ? a : show(a); }).join(' ');
  }

  function equals(a, b, seen) {
    if (Object.is(a, b) || a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    seen = seen || [];
    for (let i = 0; i < seen.length; i++) if (seen[i][0] === a && seen[i][1] === b) return true;
    seen = seen.concat([[a, b]]);
    const tagA = Object.prototype.toString.call(a);
    if (tagA !== Object.prototype.toString.call(b)) return false;
    if (tagA === '[object Date]') return a.getTime() === b.getTime();
    if (tagA === '[object Map]') {
      if (a.size !== b.size) return false;
      let same = true;
      a.forEach(function (v, k) { if (!b.has(k) || !equals(v, b.get(k), seen)) same = false; });
      return same;
    }
    if (tagA === '[object Set]') {
      if (a.size !== b.size) return false;
      let same = true;
      a.forEach(function (v) { if (!b.has(v)) same = false; });
      return same;
    }
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i], seen)) return false;
      return true;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i++) {
      const k = keysA[i];
      if (!Object.prototype.hasOwnProperty.call(b, k) || !equals(a[k], b[k], seen)) return false;
    }
    return true;
  }

  const NOT_IN_WORKER = {
    alert: 'Es gibt hier kein Pop-up. Gib Text mit console.log(...) aus.',
    prompt: 'Es gibt hier keine Eingabe-Abfrage. Lege den Wert einfach als Variable fest.',
    confirm: 'Es gibt hier keine Ja/Nein-Abfrage. Nutze eine Variable und if.',
    document: 'Der Code läuft ohne Webseite – es gibt kein document. Gib Text mit console.log(...) aus.',
    window: 'Der Code läuft ohne Webseite – es gibt kein window. Nutze console.log(...).',
    localStorage: 'Im Übungs-Editor gibt es keinen Browser-Speicher. Dein Code wird ohnehin automatisch gespeichert.',
  };

  function translateError(name, message) {
    message = String(message || '');
    let m;
    if ((m = message.match(/^(\S+) is not defined$/))) {
      if (NOT_IN_WORKER[m[1]]) return '„' + m[1] + '“ gibt es hier nicht. ' + NOT_IN_WORKER[m[1]];
      return '„' + m[1] + '“ ist nicht definiert. Tippfehler? Oder noch nicht angelegt? (Groß- und Kleinschreibung zählt.)';
    }
    if ((m = message.match(/^Cannot access '(.+)' before initialization$/))) {
      return 'Du benutzt „' + m[1] + '“, bevor es angelegt wurde. Schiebe die Zeile mit let/const/class weiter nach oben.';
    }
    if (/^Assignment to constant variable/.test(message)) {
      return 'Eine Konstante (const) lässt sich nicht neu zuweisen. Nimm let, wenn sich der Wert ändern soll.';
    }
    if ((m = message.match(/^Cannot read properties of (undefined|null) \(reading '(.+)'\)$/))) {
      return 'Du willst „' + m[2] + '“ von etwas lesen, das ' + (m[1] === 'null' ? 'null (bewusst leer)' : 'undefined (nicht vorhanden)') + ' ist. Meist fehlt ein Wert, oder ein Name ist falsch geschrieben.';
    }
    if ((m = message.match(/^Cannot set properties of (undefined|null) \(setting '(.+)'\)$/))) {
      return 'Du willst „' + m[2] + '“ setzen, aber das Objekt davor ist ' + m[1] + '. Gibt es das Objekt wirklich?';
    }
    if ((m = message.match(/^Class constructor (\S+) cannot be invoked without 'new'$/))) {
      return 'Eine Klasse erzeugst du mit new: new ' + m[1] + '(…).';
    }
    if (/^Must call super constructor/.test(message)) {
      return 'In einer Kindklasse musst du super(…) aufrufen, bevor du this benutzt.';
    }
    if (/^Super constructor may only be called once/.test(message)) {
      return 'super(…) darf nur ein einziges Mal aufgerufen werden.';
    }
    if ((m = message.match(/^Class extends value (.+) is not a constructor or null$/))) {
      return 'Nach extends muss eine bereits vorhandene Klasse stehen, nicht „' + m[1] + '“. Steht die Elternklasse weiter oben?';
    }
    if ((m = message.match(/^Cannot read private member (#\S+) from an object whose class did not declare it$/))) {
      return m[1] + ' ist privat und nur innerhalb der Klasse lesbar.';
    }
    if ((m = message.match(/^Cannot set property (\S+) of #<(\S+)> which has only a getter$/))) {
      return '„' + m[1] + '“ hat nur einen Getter (zum Lesen). Von außen kannst du den Wert nicht direkt setzen.';
    }
    if ((m = message.match(/^Cannot assign to read only property '(.+)' of object/))) {
      return '„' + m[1] + '“ ist schreibgeschützt und lässt sich nicht ändern.';
    }
    if (/^Cannot add property .*, object is not extensible/.test(message)) {
      return 'Dem Objekt lassen sich keine neuen Eigenschaften hinzufügen (es ist eingefroren oder versiegelt).';
    }
    if ((m = message.match(/^(.+) is not a constructor$/))) {
      return '„' + m[1] + '“ ist keine Klasse – new funktioniert nur mit Klassen.';
    }
    if ((m = message.match(/^(.+) is not a function$/))) {
      return '„' + m[1] + '“ ist keine Funktion. Falsch geschrieben, oder ist es ein Wert ohne ( )?';
    }
    if ((m = message.match(/^(.+) is not iterable$/))) {
      return '„' + m[1] + '“ lässt sich nicht durchlaufen. Für for…of braucht es zum Beispiel ein Array.';
    }
    if (/^Maximum call stack size exceeded/.test(message)) {
      return 'Zu viele verschachtelte Aufrufe: Eine Funktion ruft sich endlos selbst auf.';
    }
    if (/^Invalid array length/.test(message)) {
      return 'Ungültige Array-Länge. Die Länge muss eine ganze Zahl ≥ 0 sein.';
    }
    if (/^Script execution timed out/.test(message)) {
      return 'Der Code lief zu lange. Gibt es eine Schleife, die nie endet?';
    }
    return (name || 'Fehler') + ': ' + message;
  }
  CW.translateError = translateError;

  function translateSyntax(message) {
    message = String(message || '').replace(/\s*\(\d+:\d+\)\s*$/, '');
    let m;
    if (/^Unterminated string constant/.test(message)) return 'Ein Text wurde nicht mit einem Anführungszeichen beendet.';
    if (/^Unterminated template/.test(message)) return 'Ein Text mit Backticks ( ` ) wurde nicht beendet.';
    if (/^Unterminated comment/.test(message)) return 'Ein Kommentar mit /* wurde nicht mit */ beendet.';
    if ((m = message.match(/^Identifier '(.+)' has already been declared/))) {
      return '„' + m[1] + '“ wurde schon angelegt. Mit let/const darf jeder Name nur einmal vorkommen.';
    }
    if (/^Missing initializer in const declaration/.test(message)) return 'Eine const-Variable braucht sofort einen Wert, z. B. const x = 5;';
    if (/^'return' outside of function/.test(message)) return 'return gibt es nur innerhalb einer Funktion.';
    if ((m = message.match(/^The keyword '(.+)' is reserved/))) return '„' + m[1] + '“ ist ein reserviertes Wort und kann kein Name sein.';
    if ((m = message.match(/^Private field '(.+)' must be declared in an enclosing class/))) {
      return m[1] + ' ist nicht in der Klasse angelegt. Private Felder müssen oben in der Klasse stehen, z. B. ' + m[1] + ' = 0;';
    }
    if (/^Unexpected character/.test(message)) return 'Hier steht ein Zeichen, das nicht erlaubt ist.';
    if (/^Unexpected token/.test(message)) return 'Unerwartetes Zeichen. Oft fehlt kurz davor etwas: eine Klammer, ein Komma oder ein Anführungszeichen.';
    if (/^Unexpected reserved word/.test(message)) return 'Hier steht ein reserviertes Wort an der falschen Stelle.';
    return 'Schreibfehler im Code: ' + message;
  }
  CW.translateSyntax = translateSyntax;

  function TestFailure(message, hint) {
    this.message = message;
    this.hint = hint || '';
    this.isTestFailure = true;
  }

  function makeExpect() {
    const matchers = {
      toBe: function (a, e) { return { pass: Object.is(a, e) || (a === e), expected: show(e) }; },
      toEqual: function (a, e) { return { pass: equals(a, e), expected: show(e) }; },
      toBeTruthy: function (a) { return { pass: !!a, expected: 'ein „wahrer“ Wert' }; },
      toBeFalsy: function (a) { return { pass: !a, expected: 'ein „falscher“ Wert (false, 0, "", null, undefined)' }; },
      toBeUndefined: function (a) { return { pass: a === undefined, expected: 'undefined' }; },
      toBeDefined: function (a) { return { pass: a !== undefined, expected: 'irgendein Wert (nicht undefined)' }; },
      toBeNull: function (a) { return { pass: a === null, expected: 'null' }; },
      toBeGreaterThan: function (a, e) { return { pass: a > e, expected: 'größer als ' + show(e) }; },
      toBeLessThan: function (a, e) { return { pass: a < e, expected: 'kleiner als ' + show(e) }; },
      toBeCloseTo: function (a, e, digits) {
        digits = digits === undefined ? 2 : digits;
        return { pass: typeof a === 'number' && Math.abs(a - e) < Math.pow(10, -digits) / 2, expected: 'ungefähr ' + show(e) };
      },
      toBeInstanceOf: function (a, C) {
        let pass = false;
        try { pass = a instanceof C; } catch (e) { }
        return { pass: pass, expected: 'ein Objekt der Klasse ' + (C && C.name ? C.name : '?') };
      },
      toContain: function (a, e) {
        let pass = false;
        if (typeof a === 'string') pass = a.indexOf(e) !== -1;
        else if (Array.isArray(a)) pass = a.some(function (x) { return equals(x, e); });
        else if (a && typeof a.has === 'function') pass = a.has(e);
        return { pass: pass, expected: 'enthält ' + show(e) };
      },
      toHaveLength: function (a, n) {
        const len = a == null ? undefined : a.length;
        return { pass: len === n, expected: 'Länge ' + n, actualText: 'Länge ' + show(len) };
      },
      toMatch: function (a, re) { return { pass: typeof a === 'string' && re.test(a), expected: 'passt auf ' + String(re) }; },
      toHaveProperty: function (a, key) {
        return { pass: a != null && Object.prototype.hasOwnProperty.call(Object(a), key), expected: 'hat die Eigenschaft „' + key + '“' };
      },
    };

    function expect(actual, hint) {
      function build(negate) {
        const api = {};
        Object.keys(matchers).forEach(function (name) {
          api[name] = function () {
            const args = [actual].concat([].slice.call(arguments));
            const r = matchers[name].apply(null, args);
            if (r.pass === negate) {
              const got = r.actualText || show(actual);
              throw new TestFailure('Erwartet: ' + (negate ? 'nicht ' : '') + r.expected + '  ·  Bekommen: ' + got, hint);
            }
          };
        });
        api.toThrow = function (pattern) {
          let threw = false;
          let error;
          try { actual(); } catch (e) { threw = true; error = e; }
          let pass = threw;
          if (threw && pattern instanceof RegExp) pass = pattern.test(String(error && error.message));
          if (pass === negate) {
            throw new TestFailure(
              negate ? 'Es sollte KEIN Fehler ausgelöst werden – aber es kam einer: ' + String(error && error.message)
                     : (threw ? 'Der Fehler hatte eine andere Meldung als erwartet: ' + String(error && error.message)
                              : 'Erwartet: Es wird ein Fehler ausgelöst  ·  Bekommen: es lief ohne Fehler durch'),
              hint
            );
          }
        };
        return api;
      }
      const result = build(false);
      result.not = build(true);
      return result;
    }
    return expect;
  }

  const MAX_NODES = 60;
  const MAX_ROWS = 12;

  const classInfoCache = new Map();

  function classInfo(ctor) {
    if (classInfoCache.has(ctor)) return classInfoCache.get(ctor);
    const info = { privateFields: [], privateMethods: [] };
    try {
      const src = Function.prototype.toString.call(ctor);
      if (/^class[\s{]/.test(src)) {
        const ast = root.acorn.parse('(' + src + ')', { ecmaVersion: 'latest' });
        const body = ast.body[0].expression.body.body;
        body.forEach(function (el) {
          if (!el.key || el.key.type !== 'PrivateIdentifier' || el.static) return;
          if (el.type === 'PropertyDefinition') info.privateFields.push('#' + el.key.name);
          if (el.type === 'MethodDefinition' && el.kind === 'method') info.privateMethods.push('#' + el.key.name);
        });
      }
    } catch (e) { }
    classInfoCache.set(ctor, info);
    return info;
  }

  function functionLabel(fn) {
    let params = '';
    try {
      const src = Function.prototype.toString.call(fn);
      const m = src.match(/^(?:async\s*)?(?:function\b[^(]*|[\w$*]*\s*)?\(([^)]*)\)/) || src.match(/^(?:async\s*)?([\w$]+)\s*=>/);
      if (m) params = m[1].replace(/\s+/g, ' ').trim();
    } catch (e) { }
    return 'ƒ ' + (fn.name || 'anonym') + '(' + params + ')';
  }

  function buildSnapshot(entries) {
    const ids = new Map();
    const nodes = {};
    const order = [];
    let truncated = false;
    const prim = function (type, text) { return { t: 'prim', type: type, text: text }; };

    function hasConstructorShape(fn) {
      try {
        const p = fn.prototype;
        return !!p && Object.getOwnPropertyNames(p).some(function (n) { return n !== 'constructor'; });
      } catch (e) { return false; }
    }

    function valueOf(v) {
      const type = typeof v;
      if (v === null) return prim('null', 'null');
      if (type === 'undefined') return prim('undefined', 'undefined');
      if (type === 'string') return prim('string', JSON.stringify(cut(v, 40)));
      if (type === 'number' || type === 'boolean') return prim(type, show(v));
      if (type === 'bigint') return prim('number', v + 'n');
      if (type === 'symbol') return prim('symbol', v.toString());
      if (type === 'function') {
        if (isClassFunction(v) || hasConstructorShape(v)) {
          const cid = classNode(v);
          return cid ? { t: 'ref', id: cid } : prim('more', '…');
        }
        return { t: 'fn', text: functionLabel(v) };
      }
      const id = objectNode(v);
      return id ? { t: 'ref', id: id } : prim('more', '…');
    }

    function register(obj) {
      if (ids.has(obj)) return { id: ids.get(obj), fresh: false };
      if (order.length >= MAX_NODES) { truncated = true; return null; }
      const id = 'n' + order.length;
      ids.set(obj, id);
      order.push(id);
      return { id: id, fresh: true };
    }

    function classNode(ctor) {
      const reg = register(ctor);
      if (!reg) return null;
      if (!reg.fresh) return reg.id;
      const node = { id: reg.id, kind: 'class', title: ctor.name || 'anonym', rows: [], methods: [], getters: [], statics: [], privates: [] };
      nodes[reg.id] = node;

      const proto = ctor.prototype;
      if (proto) {
        Object.getOwnPropertyNames(proto).forEach(function (name) {
          if (name === 'constructor') return;
          const d = Object.getOwnPropertyDescriptor(proto, name);
          if (d.get || d.set) node.getters.push(name + (d.get && d.set ? ' (lesen/setzen)' : d.get ? ' (lesen)' : ' (setzen)'));
          else if (typeof d.value === 'function') node.methods.push(name + '()');
        });
      }
      Object.getOwnPropertyNames(ctor).forEach(function (name) {
        if (['length', 'name', 'prototype', 'caller', 'arguments'].indexOf(name) !== -1) return;
        const d = Object.getOwnPropertyDescriptor(ctor, name);
        node.statics.push('static ' + name + (typeof d.value === 'function' ? '()' : ''));
      });
      const info = classInfo(ctor);
      info.privateFields.forEach(function (n) { node.privates.push(n); });
      info.privateMethods.forEach(function (n) { node.privates.push(n + '()'); });

      const parent = Object.getPrototypeOf(ctor);
      if (typeof parent === 'function' && parent !== Function.prototype) {
        if (isClassFunction(parent) || hasConstructorShape(parent)) node.parentId = classNode(parent) || undefined;
        else node.parentName = parent.name;
      }
      return reg.id;
    }

    function privateFieldsOf(ctor) {
      const out = [];
      let c = ctor;
      let guard = 0;
      while (typeof c === 'function' && c !== Function.prototype && guard++ < 20) {
        classInfo(c).privateFields.forEach(function (n) { if (out.indexOf(n) === -1) out.push(n); });
        c = Object.getPrototypeOf(c);
      }
      return out;
    }

    function objectNode(obj) {
      const reg = register(obj);
      if (!reg) return null;
      if (!reg.fresh) return reg.id;
      const node = { id: reg.id, kind: 'object', title: 'Objekt', rows: [], methods: [], getters: [], statics: [], privates: [] };
      nodes[reg.id] = node;
      const tag = Object.prototype.toString.call(obj);

      if (Array.isArray(obj)) {
        node.kind = 'array';
        node.title = 'Array (' + obj.length + ')';
        for (let i = 0; i < Math.min(obj.length, MAX_ROWS); i++) node.rows.push({ key: String(i), value: valueOf(obj[i]) });
        if (obj.length > MAX_ROWS) node.more = obj.length - MAX_ROWS;
        return reg.id;
      }
      if (tag === '[object Map]') {
        node.kind = 'map';
        node.title = 'Map (' + obj.size + ')';
        obj.forEach(function (v, k) {
          if (node.rows.length < MAX_ROWS) node.rows.push({ key: typeof k === 'object' ? show(k) : String(k), value: valueOf(v) });
        });
        return reg.id;
      }
      if (tag === '[object Set]') {
        node.kind = 'set';
        node.title = 'Set (' + obj.size + ')';
        let i = 0;
        obj.forEach(function (v) { if (node.rows.length < MAX_ROWS) node.rows.push({ key: String(i++), value: valueOf(v) }); });
        return reg.id;
      }
      if (['[object Date]', '[object RegExp]', '[object Error]', '[object Promise]'].indexOf(tag) !== -1) {
        node.kind = 'other';
        node.title = className(obj) || tag.slice(8, -1);
        node.rows.push({ key: '', value: { t: 'prim', type: 'string', text: show(obj) } });
        return reg.id;
      }

      const proto = Object.getPrototypeOf(obj);
      if (proto === null) {
        node.title = 'Objekt (ohne Prototyp)';
      } else if (proto === Object.prototype) {
        node.title = 'Objekt';
      } else if (Object.prototype.hasOwnProperty.call(proto, 'constructor') && typeof proto.constructor === 'function') {
        node.kind = 'instance';
        node.title = proto.constructor.name || 'Objekt';
        node.classId = classNode(proto.constructor) || undefined;
        privateFieldsOf(proto.constructor).forEach(function (n) { node.privates.push(n); });
      } else {
        node.protoId = objectNode(proto) || undefined;
      }

      const keys = Object.keys(obj);
      keys.slice(0, MAX_ROWS).forEach(function (k) {
        let v;
        try { v = obj[k]; } catch (e) { v = undefined; }
        node.rows.push({ key: k, value: valueOf(v) });
      });
      if (keys.length > MAX_ROWS) node.more = keys.length - MAX_ROWS;
      return reg.id;
    }

    const variables = [];
    const classRoots = [];
    entries.forEach(function (entry) {
      let v;
      try { v = entry.get(); } catch (e) { v = undefined; }
      if (entry.kind === 'class' && typeof v === 'function') {
        const id = classNode(v);
        if (id) classRoots.push(id);
        return;
      }
      variables.push({ name: entry.name, kind: entry.kind, value: valueOf(v) });
    });

    return { variables: variables, nodes: nodes, order: order, classRoots: classRoots, truncated: truncated };
  }

  function collectNames(pattern, kind, out) {
    if (!pattern) return;
    switch (pattern.type) {
      case 'Identifier': out.push({ name: pattern.name, kind: kind }); break;
      case 'ObjectPattern':
        pattern.properties.forEach(function (p) { collectNames(p.type === 'RestElement' ? p.argument : p.value, kind, out); });
        break;
      case 'ArrayPattern': pattern.elements.forEach(function (e) { collectNames(e, kind, out); }); break;
      case 'RestElement': collectNames(pattern.argument, kind, out); break;
      case 'AssignmentPattern': collectNames(pattern.left, kind, out); break;
      default: break;
    }
  }

  function topLevelDeclarations(ast) {
    const out = [];
    ast.body.forEach(function (node) {
      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(function (d) { collectNames(d.id, node.kind, out); });
      } else if (node.type === 'FunctionDeclaration' && node.id) {
        out.push({ name: node.id.name, kind: 'function' });
      } else if (node.type === 'ClassDeclaration' && node.id) {
        out.push({ name: node.id.name, kind: 'class' });
      }
    });
    const seen = {};
    return out.filter(function (d) { if (seen[d.name]) return false; seen[d.name] = true; return true; });
  }

  function locateError(error, userLineCount) {
    const stack = String((error && error.stack) || '');
    const lines = stack.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/user\.js:(\d+):(\d+)/) || lines[i].match(/> eval:(\d+):(\d+)/);
      if (m) {
        const line = Number(m[1]);
        let column = Number(m[2]);
        if (line === 1) column = Math.max(1, column - STRICT_PREFIX.length);
        if (line >= 1 && line <= userLineCount) return { line: line, column: column };
        return null;
      }
    }
    return null;
  }

  const SETTLE_LIMIT_MS = 2000;
  const TEST_TIMEOUT_MS = 1000;

  function watchTimers(g, onError) {
    const bind = function (fn) { return typeof fn === 'function' ? fn.bind(g) : fn; };
    const real = { setTimeout: bind(g.setTimeout), clearTimeout: bind(g.clearTimeout), setInterval: bind(g.setInterval), clearInterval: bind(g.clearInterval) };
    const pending = new Map();
    const guard = function (fn, args) {
      if (typeof fn !== 'function') return;
      try { fn.apply(null, args); } catch (e) { onError(e); }
    };
    if (typeof real.setTimeout !== 'function') {
      return { real: real, pending: function () { return 0; }, intervals: function () { return 0; }, clearAll: function () {} };
    }
    g.setTimeout = function (fn, ms) {
      const args = [].slice.call(arguments, 2);
      const id = real.setTimeout(function () { pending.delete(id); guard(fn, args); }, ms);
      pending.set(id, 'timeout');
      return id;
    };
    g.clearTimeout = function (id) { pending.delete(id); real.clearTimeout(id); };
    g.setInterval = function (fn, ms) {
      const args = [].slice.call(arguments, 2);
      const id = real.setInterval(function () { guard(fn, args); }, ms);
      pending.set(id, 'interval');
      return id;
    };
    g.clearInterval = function (id) { pending.delete(id); real.clearInterval(id); };
    return {
      real: real,
      pending: function () { return pending.size; },
      intervals: function () { let n = 0; pending.forEach(function (k) { if (k === 'interval') n++; }); return n; },
      clearAll: function () {
        pending.forEach(function (kind, id) { (kind === 'interval' ? real.clearInterval : real.clearTimeout)(id); });
        pending.clear();
      },
    };
  }

  async function settle(timers, limitMs) {
    const sleep = function (ms) {
      return new Promise(function (resolve) { (timers.real.setTimeout || setTimeout)(resolve, ms); });
    };
    if (typeof timers.real.setTimeout !== 'function') { await Promise.resolve(); return true; }
    const start = Date.now();
    for (;;) {
      await sleep(5);
      if (timers.pending() === 0) {
        await sleep(0);
        if (timers.pending() === 0) return true;
      }
      if (Date.now() - start > limitMs) return false;
    }
  }

  const PRACTICE_DELAY = 40;
  const STATUS_TEXT = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed' };

  function practiceResponse(status, body) {
    const text = JSON.stringify(body);
    return {
      ok: status >= 200 && status < 300,
      status: status,
      statusText: STATUS_TEXT[status] || '',
      headers: { get: function (name) { return String(name).toLowerCase() === 'content-type' ? 'application/json' : null; } },
      json: function () { return Promise.resolve(JSON.parse(text)); },
      text: function () { return Promise.resolve(text); },
    };
  }

  function parseQuery(query) {
    const params = {};
    query.split('&').filter(Boolean).forEach(function (pair) {
      const i = pair.indexOf('=');
      const key = decodeURIComponent(i < 0 ? pair : pair.slice(0, i));
      params[key] = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
    });
    return params;
  }

  function practiceApi() {
    const users = [
      { id: 1, name: 'Mara', stadt: 'Nürnberg' },
      { id: 2, name: 'Ali', stadt: 'Erlangen' },
      { id: 3, name: 'Lea', stadt: 'Fürth' },
    ];
    const weather = {
      'nürnberg': { stadt: 'Nürnberg', grad: 12, himmel: 'bewölkt' },
      'erlangen': { stadt: 'Erlangen', grad: 11, himmel: 'Regen' },
      'fürth': { stadt: 'Fürth', grad: 13, himmel: 'sonnig' },
    };
    const notes = [];
    return function (method, path, params, body) {
      let match;
      if (path === '/uebung/nutzer') {
        return method === 'GET' ? [200, users] : [405, { fehler: 'Hier geht nur GET.' }];
      }
      if ((match = /^\/uebung\/nutzer\/([^/]+)$/.exec(path))) {
        const user = users.find(function (u) { return String(u.id) === match[1]; });
        return user ? [200, user] : [404, { fehler: 'Nutzer ' + match[1] + ' gibt es nicht.' }];
      }
      if (path === '/uebung/wetter') {
        const entry = weather[String(params.stadt || '').toLowerCase()];
        return entry ? [200, entry] : [404, { fehler: 'Für „' + (params.stadt || '') + '“ gibt es keine Wetterdaten.' }];
      }
      if (path === '/uebung/notizen') {
        if (method === 'GET') return [200, notes];
        if (method !== 'POST') return [405, { fehler: 'Hier gehen nur GET und POST.' }];
        let data = null;
        try { data = JSON.parse(body); } catch (e) { return [400, { fehler: 'Der Body ist kein gültiges JSON. Nutze JSON.stringify(…).' }]; }
        if (!data || typeof data.text !== 'string' || !data.text.trim()) return [400, { fehler: 'Eine Notiz braucht ein Feld „text“.' }];
        const note = { id: notes.length + 1, text: data.text };
        notes.push(note);
        return [201, note];
      }
      return [404, { fehler: 'Diese Adresse gibt es in der Übungs-API nicht.' }];
    };
  }

  function practiceFetch(g) {
    const handle = practiceApi();
    return function fetch(input, init) {
      const url = String(input && input.url ? input.url : input);
      const options = init || {};
      const method = String(options.method || 'GET').toUpperCase();
      return new Promise(function (resolve, reject) {
        g.setTimeout(function () {
          const q = url.indexOf('?');
          const path = q < 0 ? url : url.slice(0, q);
          if (!/^\/uebung(\/|$)/.test(path)) {
            reject(new TypeError('Failed to fetch: In Codewerk erreicht dein Code nur die Übungs-API unter /uebung/…, nicht „' + url + '“.'));
            return;
          }
          const answer = handle(method, path, parseQuery(q < 0 ? '' : url.slice(q + 1)), options.body);
          resolve(practiceResponse(answer[0], answer[1]));
        }, PRACTICE_DELAY);
      });
    };
  }

  let currentAsyncError = null;
  CW.asyncError = function (reason) { if (currentAsyncError) currentAsyncError(reason); };

  CW.runLesson = async function runLesson(options) {
    const code = String(options.code || '');
    const testsSource = options.tests ? String(options.tests) : null;
    const g = root;

    const result = {
      logs: [],
      syntaxError: null,
      error: null,
      tests: null,
      testsBroken: null,
      snapshot: null,
    };

    let declarations = [];
    try {
      const ast = g.acorn.parse(STRICT_PREFIX + code, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
      declarations = topLevelDeclarations(ast);
    } catch (e) {
      if (e && e.loc) {
        const line = e.loc.line;
        const column = line === 1 ? Math.max(1, e.loc.column + 1 - STRICT_PREFIX.length) : e.loc.column + 1;
        let message = translateSyntax(e.message);
        if (typeof e.pos === 'number' && /\bawait\s*$/.test((STRICT_PREFIX + code).slice(0, e.pos))) {
          message = 'await geht nur innerhalb einer async-Funktion. Schreibe async davor, z. B. async function laden() { … } – und rufe sie dann auf.';
        }
        result.syntaxError = { line: line, column: column, message: message, raw: String(e.message) };
      } else {
        result.syntaxError = { line: 1, column: 1, message: translateSyntax(e && e.message), raw: String(e && e.message) };
      }
      return result;
    }

    let capturing = true;
    let capture = null;
    let overflow = false;
    function push(type, args) {
      const text = formatLog(args);
      if (capture) capture.push(text);
      if (!capturing) return;
      if (result.logs.length >= MAX_LOG_LINES) {
        if (!overflow) { overflow = true; result.logs.push({ type: 'warn', text: '… (weitere Ausgaben abgeschnitten)' }); }
        return;
      }
      result.logs.push({ type: type, text: text });
    }
    const noop = function () {};
    g.console = {
      log: function () { push('log', [].slice.call(arguments)); },
      info: function () { push('log', [].slice.call(arguments)); },
      debug: function () { push('log', [].slice.call(arguments)); },
      warn: function () { push('warn', [].slice.call(arguments)); },
      error: function () { push('error', [].slice.call(arguments)); },
      table: function (data) { push('log', [data]); },
      assert: function (cond) { if (!cond) push('error', ['Assertion fehlgeschlagen'].concat([].slice.call(arguments, 1))); },
      clear: noop, group: noop, groupEnd: noop, time: noop, timeEnd: noop,
    };

    const registered = [];
    let entriesFn = null;
    function takeSnapshot() {
      if (!entriesFn) return;
      try { result.snapshot = buildSnapshot(entriesFn()); result.snapshotError = undefined; } catch (e) { result.snapshotError = String(e && e.message); }
    }
    g.__cw = {
      phase: 'user',
      snapshot: function (entries) {
        entriesFn = entries;
        takeSnapshot();
        capturing = false;
      },
      api: {
        test: function (name, fn) { registered.push({ name: name, fn: fn }); },
        expect: makeExpect(),
        output: function () { return result.logs.map(function (l) { return l.text; }); },
        source: function () { return code; },
        capture: function (fn) {
          const buffer = [];
          capture = buffer;
          let value;
          try { value = fn(); } catch (e) { capture = null; throw e; }
          if (value && typeof value.then === 'function') {
            return value.then(function () { capture = null; return buffer; }, function (e) { capture = null; throw e; });
          }
          capture = null;
          return buffer;
        },
        wait: function (ms) {
          return new Promise(function (resolve) { setTimeout(resolve, ms); });
        },
      },
    };

    const getters = declarations.map(function (d) {
      return '{name:' + JSON.stringify(d.name) + ',kind:' + JSON.stringify(d.kind) + ',get:function(){return ' + d.name + ';}}';
    }).join(',');
    const userLineCount = code.split('\n').length;

    let program = STRICT_PREFIX + code + '\n;__cw.snapshot(function(){return [' + getters + '];});\n';
    if (testsSource) {
      program += ';__cw.phase="tests";\n;(function(){ const { test, expect, output, source, capture, wait } = __cw.api;\n' +
        testsSource + '\n})();\n';
    }
    program += '//# sourceURL=' + SOURCE_NAME;

    function userError(e) {
      const isObject = e !== null && typeof e === 'object';
      const name = isObject ? String(e.name || 'Error') : 'Error';
      const message = isObject ? String(e.message) : String(e);
      const loc = isObject ? locateError(e, userLineCount) : null;
      return {
        name: name,
        message: isObject ? translateError(name, message) : 'Dein Code hat etwas „geworfen“ (throw): ' + show(e),
        raw: isObject ? name + ': ' + message : String(e),
        line: loc ? loc.line : null,
        column: loc ? loc.column : null,
      };
    }

    let testAsyncError = null;
    function onAsyncError(e) {
      if (g.__cw.phase === 'running-tests') { if (!testAsyncError) testAsyncError = e; return; }
      if (!result.error) result.error = userError(e);
    }
    currentAsyncError = onAsyncError;
    const timers = watchTimers(g, onAsyncError);
    g.fetch = practiceFetch(g);

    try {
      (0, g.eval)(program);
    } catch (e) {
      if (g.__cw.phase === 'tests') {
        const message = e !== null && typeof e === 'object' ? String(e.message) : String(e);
        result.testsBroken = 'Die Tests dieser Lektion enthalten einen Fehler: ' + message;
      } else {
        result.error = userError(e);
      }
    }

    if (!result.syntaxError && !result.testsBroken) {
      g.__cw.phase = 'user-async';
      capturing = true;
      const done = await settle(timers, SETTLE_LIMIT_MS);
      if (!done) {
        const intervals = timers.intervals();
        timers.clearAll();
        result.logs.push({
          type: 'warn',
          text: intervals
            ? 'Hinweis: Ein setInterval lief nach ' + SETTLE_LIMIT_MS / 1000 + ' Sekunden noch und wurde angehalten. Vergiss clearInterval nicht.'
            : 'Hinweis: Ein Timer war nach ' + SETTLE_LIMIT_MS / 1000 + ' Sekunden noch nicht fertig und wurde angehalten. Nutze kürzere Wartezeiten.',
        });
      }
      capturing = false;
      takeSnapshot();
    }

    if (testsSource && !result.error && !result.testsBroken) {
      g.__cw.phase = 'running-tests';
      const sleep = function (ms) {
        return new Promise(function (resolve) { (timers.real.setTimeout || setTimeout)(resolve, ms); });
      };
      const timeoutFailure = {
        isTestFailure: true,
        message: 'Der Test hat länger als ' + TEST_TIMEOUT_MS / 1000 + ' Sekunde auf ein Ergebnis gewartet.',
        hint: 'Wird dein Promise erfüllt (resolve) und gibt deine async-Funktion etwas zurück? Hast du await vergessen?',
      };
      result.tests = [];
      for (let i = 0; i < registered.length; i++) {
        const t = registered[i];
        testAsyncError = null;
        try {
          const value = t.fn();
          if (value && typeof value.then === 'function') {
            await Promise.race([value, sleep(TEST_TIMEOUT_MS).then(function () { throw timeoutFailure; })]);
          }
          if (testAsyncError) throw testAsyncError;
          result.tests.push({ name: t.name, ok: true });
        } catch (e) {
          if (e && e.isTestFailure) { result.tests.push({ name: t.name, ok: false, message: e.message, hint: e.hint }); continue; }
          const name = e && e.name ? String(e.name) : 'Error';
          const message = e && e.message !== undefined ? String(e.message) : String(e);
          result.tests.push({ name: t.name, ok: false, message: translateError(name, message), hint: '' });
        }
      }
      timers.clearAll();
    }
    currentAsyncError = null;
    return result;
  };

  root.CW = CW;
  if (typeof module !== 'undefined' && module.exports) module.exports = CW;
})(typeof self !== 'undefined' ? self : globalThis);
