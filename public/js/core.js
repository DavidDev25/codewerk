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

  function isDomNode(value) {
    return value !== null && typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.nodeName === 'string';
  }

  function domLabel(node) {
    if (node.nodeType === 3) return '#text ' + JSON.stringify(cut(String(node.textContent), 30));
    if (node.nodeType === 9) return '#document';
    if (node.nodeType !== 1) return String(node.nodeName);
    let label = '<' + String(node.nodeName).toLowerCase();
    if (node.id) label += '#' + node.id;
    if (typeof node.className === 'string' && node.className.trim()) label += '.' + node.className.trim().split(/\s+/).join('.');
    return label + '>';
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
    if (isDomNode(value)) return domLabel(value);
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
    if (/^'import' and 'export' may appear only/.test(message)) {
      return 'import und export gibt es nur in Lektionen mit mehreren Dateien. Hier steht dein ganzes Programm in einer Datei.';
    }
    if ((m = message.match(/^Duplicate export '(.+)'/))) return '„' + m[1] + '“ wird zweimal exportiert. Jeder Exportname darf nur einmal vorkommen.';
    if ((m = message.match(/^Export '(.+)' is not defined/))) return '„' + m[1] + '“ wird exportiert, ist in dieser Datei aber nirgends angelegt.';
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
      if (isDomNode(v)) return prim('symbol', domLabel(v));
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
      if ((node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') && node.declaration) node = node.declaration;
      if (node.type === 'ImportDeclaration') {
        node.specifiers.forEach(function (s) { out.push({ name: s.local.name, kind: 'import' }); });
      } else if (node.type === 'VariableDeclaration') {
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
      const signal = options.signal;
      const abortReason = function () {
        if (signal.reason !== undefined) return signal.reason;
        const e = new Error('Die Anfrage wurde abgebrochen.');
        e.name = 'AbortError';
        return e;
      };
      return new Promise(function (resolve, reject) {
        if (signal && signal.aborted) { reject(abortReason()); return; }
        const q = url.indexOf('?');
        const path = q < 0 ? url : url.slice(0, q);
        const params = parseQuery(q < 0 ? '' : url.slice(q + 1));
        const delay = path === '/uebung/langsam' ? Math.min(Math.max(Number(params.ms) || 0, 0), 1500) : PRACTICE_DELAY;
        const timer = g.setTimeout(function () {
          if (signal) signal.removeEventListener('abort', onAbort);
          if (!/^\/uebung(\/|$)/.test(path)) {
            reject(new TypeError('Failed to fetch: In Codewerk erreicht dein Code nur die Übungs-API unter /uebung/…, nicht „' + url + '“.'));
            return;
          }
          const answer = path === '/uebung/langsam' ? [200, { ms: delay }] : handle(method, path, params, options.body);
          resolve(practiceResponse(answer[0], answer[1]));
        }, delay);
        function onAbort() {
          g.clearTimeout(timer);
          reject(abortReason());
        }
        if (signal) signal.addEventListener('abort', onAbort, { once: true });
      });
    };
  }

  const LOOP_LIMIT_MS = 3000;
  const LOOP_TYPES = ['ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement'];
  const LOOP_MESSAGE = 'Diese Schleife lief länger als ' + (LOOP_LIMIT_MS / 1000) + ' Sekunden und wurde angehalten. Wird ihre Bedingung irgendwann falsch?';

  function applyEdits(source, edits) {
    edits.forEach(function (e, i) { e.i = i; });
    edits.sort(function (a, b) { return b.at - a.at || b.i - a.i; });
    let out = source;
    edits.forEach(function (e) { out = out.slice(0, e.at) + e.text + out.slice(e.end === undefined ? e.at : e.end); });
    return out;
  }

  function guardLoops(source, ast) {
    return applyEdits(source, loopEdits(ast));
  }

  function loopEdits(ast) {
    const edits = [];
    let count = 0;
    function walk(node, parent) {
      if (!node || typeof node.type !== 'string') return;
      if (LOOP_TYPES.indexOf(node.type) !== -1) {
        const name = '__cwL' + (count++);
        const outer = parent && parent.type === 'LabeledStatement' ? parent : node;
        edits.push({ at: outer.start, text: '{const ' + name + '=Date.now();' });
        edits.push({ at: outer.end, text: '}' });
        if (node.body.type === 'BlockStatement') {
          edits.push({ at: node.body.start + 1, text: '__cw.loop(' + name + ');' });
        } else {
          edits.push({ at: node.body.start, text: '{__cw.loop(' + name + ');' });
          edits.push({ at: node.body.end, text: '}' });
        }
      }
      Object.keys(node).forEach(function (key) {
        const child = node[key];
        if (Array.isArray(child)) child.forEach(function (c) { if (c && typeof c.type === 'string') walk(c, node); });
        else if (child && typeof child.type === 'string') walk(child, node);
      });
    }
    walk(ast, null);
    return edits;
  }
  CW.guardLoops = guardLoops;

  const MODULE_URL = 'cw-datei/';
  const FUNCTION_TYPES = ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'];

  function walkAll(node, visit) {
    if (!node || typeof node.type !== 'string') return;
    if (visit(node) === false) return;
    Object.keys(node).forEach(function (key) {
      const child = node[key];
      if (Array.isArray(child)) child.forEach(function (c) { if (c && typeof c.type === 'string') walkAll(c, visit); });
      else if (child && typeof child.type === 'string') walkAll(child, visit);
    });
  }

  function hasTopLevelAwait(ast) {
    let found = false;
    walkAll(ast, function (node) {
      if (found || FUNCTION_TYPES.indexOf(node.type) !== -1) return false;
      if (node.type === 'AwaitExpression' || (node.type === 'ForOfStatement' && node.await)) found = true;
    });
    return found;
  }

  function exportName(node) { return node.type === 'Literal' ? String(node.value) : node.name; }

  function blank(text) { return text.replace(/[^\n]/g, ' '); }

  function linkError(file, node, message) {
    const e = new Error(message);
    e.cwLink = { file: file, line: node.loc.start.line, column: node.loc.start.column + 1 };
    return e;
  }

  const PROJECT_DIR = '/projekt/';

  function projectPath(from, spec) {
    const parts = spec.indexOf(PROJECT_DIR) === 0 ? [] : from.split('/');
    if (spec.indexOf(PROJECT_DIR) === 0) spec = spec.slice(PROJECT_DIR.length);
    else parts.pop();
    spec.split('/').forEach(function (p) {
      if (p === '..') parts.pop();
      else if (p !== '.' && p !== '') parts.push(p);
    });
    return parts.join('/');
  }

  function resolveModule(from, spec, files) {
    spec = String(spec);
    if (!/^\.\.?\//.test(spec)) {
      throw new Error('„' + spec + '“ ist kein Pfad zu einer Datei. Eigene Dateien importierst du mit ./ davor, z. B. „./' + spec.replace(/^\/+/, '') + '“.');
    }
    const name = projectPath(from, spec);
    if (Object.prototype.hasOwnProperty.call(files, name)) return name;
    if (Object.prototype.hasOwnProperty.call(files, name + '.js')) {
      throw new Error('Bei import braucht der Pfad die Endung .js: Schreibe „' + spec + '.js“ statt „' + spec + '“.');
    }
    throw new Error('Die Datei „' + spec + '“ gibt es nicht (gesucht von ' + from + ' aus). Vorhanden: ' + Object.keys(files).join(', ') + '.');
  }

  function packageMessage(spec) {
    const name = String(spec).split('/').slice(0, String(spec).charAt(0) === '@' ? 2 : 1).join('/');
    return 'Das Paket „' + name + '“ müsste erst mit npm installiert werden (npm install ' + name + '). Das geht in Codewerk nicht. ' +
      'Eingebaut sind: fs, path, events, http, process, util. Eigene Dateien lädst du mit ./ davor.';
  }

  function stripHashbang(source, edits) {
    if (source.indexOf('#!') !== 0) return;
    const end = source.indexOf('\n') === -1 ? source.length : source.indexOf('\n');
    edits.push({ at: 0, end: end, text: blank(source.slice(0, end)) });
  }

  function compileCommonJs(name, source, options) {
    const ast = root.acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowReturnOutsideFunction: true, locations: true });
    const edits = options.loopGuard ? loopEdits(ast) : [];
    stripHashbang(source, edits);
    return {
      name: name, kind: 'cjs', ast: ast, body: applyEdits(source, edits),
      exports: [], requests: [], imports: [], stars: [], lines: source.split('\n').length, async: false,
    };
  }

  function looksLikeEsm(source) {
    try {
      const ast = root.acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
      let meta = false;
      walkAll(ast, function (node) { if (node.type === 'MetaProperty' && node.meta.name === 'import') meta = true; });
      return meta || hasTopLevelAwait(ast) || ast.body.some(function (node) { return /^(Import|Export)/.test(node.type); });
    } catch (e) {
      return /^\s*(import\s*[\w{*'"]|export\s)/m.test(source);
    }
  }

  function compileModule(name, source, files, options) {
    const ast = root.acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
    const edits = options.loopGuard ? loopEdits(ast) : [];
    stripHashbang(source, edits);
    const exports = [];
    const requests = [];
    const imports = [];
    const stars = [];
    let counter = 0;
    const request = function (node) {
      let target;
      const spec = String(node.source.value);
      if (options.node && options.node.isBuiltin(spec)) target = 'node:' + options.node.canonical(spec);
      else if (options.node && !/^\.\.?\//.test(spec)) throw linkError(name, node.source, packageMessage(spec));
      else try { target = resolveModule(name, spec, files); } catch (e) { throw linkError(name, node.source, e.message); }
      const local = '__cwM' + (counter++);
      requests.push({ local: local, target: target });
      return { local: local, target: target };
    };

    ast.body.forEach(function (node) {
      if (node.type === 'ImportDeclaration') {
        const req = request(node);
        const names = [];
        node.specifiers.forEach(function (s) {
          if (s.type === 'ImportNamespaceSpecifier') {
            requests.push({ alias: s.local.name, local: req.local });
            imports.push({ local: s.local.name, namespace: true });
          } else {
            const imported = s.type === 'ImportDefaultSpecifier' ? 'default' : exportName(s.imported);
            names.push(JSON.stringify(imported) + ':' + s.local.name);
            imports.push({ name: imported, local: s.local.name, target: req.target, node: s });
          }
        });
        if (names.length) requests.push({ destructure: '{' + names.join(',') + '}', local: req.local });
        edits.push({ at: node.start, end: node.end, text: blank(source.slice(node.start, node.end)) });
      } else if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration) {
          const decl = node.declaration;
          const names = [];
          if (decl.type === 'VariableDeclaration') decl.declarations.forEach(function (d) { collectNames(d.id, decl.kind, names); });
          else names.push({ name: decl.id.name });
          names.forEach(function (n) { exports.push({ name: n.name, get: n.name }); });
          edits.push({ at: node.start, end: decl.start, text: blank(source.slice(node.start, decl.start)) });
        } else {
          const req = node.source ? request(node) : null;
          node.specifiers.forEach(function (s) {
            const local = exportName(s.local);
            exports.push({ name: exportName(s.exported), get: req ? req.local + '[' + JSON.stringify(local) + ']' : local, from: req && req.target, imported: local, node: s });
          });
          edits.push({ at: node.start, end: node.end, text: blank(source.slice(node.start, node.end)) });
        }
      } else if (node.type === 'ExportDefaultDeclaration') {
        const decl = node.declaration;
        const named = (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') && decl.id;
        if (named) {
          exports.push({ name: 'default', get: decl.id.name });
          edits.push({ at: node.start, end: decl.start, text: blank(source.slice(node.start, decl.start)) });
        } else {
          exports.push({ name: 'default', get: '__cwDefault' });
          edits.push({ at: node.start, end: decl.start, text: 'const __cwDefault=' });
          if (source[node.end - 1] !== ';') edits.push({ at: node.end, text: ';' });
        }
      } else if (node.type === 'ExportAllDeclaration') {
        const req = request(node);
        if (node.exported) exports.push({ name: exportName(node.exported), get: req.local });
        else stars.push({ local: req.local, target: req.target });
        edits.push({ at: node.start, end: node.end, text: blank(source.slice(node.start, node.end)) });
      }
    });

    walkAll(ast, function (node) {
      if (node.type === 'ImportExpression') edits.push({ at: node.start, end: node.source.start, text: '__cwDyn(' });
      else if (node.type === 'MetaProperty' && node.meta.name === 'import') edits.push({ at: node.start, end: node.end, text: '__cwMeta' });
    });

    return {
      name: name,
      kind: 'esm',
      ast: ast,
      body: applyEdits(source, edits),
      exports: exports,
      requests: requests,
      imports: imports,
      stars: stars,
      lines: source.split('\n').length,
      async: hasTopLevelAwait(ast),
    };
  }

  function exportedNames(modules, name, seen) {
    const m = modules[name];
    if (!m || seen.indexOf(name) !== -1) return [];
    seen = seen.concat(name);
    const names = m.exports.map(function (e) { return e.name; });
    m.stars.forEach(function (s) {
      exportedNames(modules, s.target, seen).forEach(function (n) { if (n !== 'default' && names.indexOf(n) === -1) names.push(n); });
    });
    return names;
  }

  function checkLinks(modules, options) {
    Object.keys(modules).forEach(function (name) {
      const m = modules[name];
      const check = function (target, wanted, node) {
        const builtin = target.indexOf('node:') === 0;
        if (!builtin && !modules[target]) throw linkError(name, node, target + ' ist keine JavaScript-Datei und lässt sich nicht importieren.');
        if (!builtin && modules[target].kind === 'cjs') return;
        const available = builtin ? options.node.builtinNames(target) : exportedNames(modules, target, []);
        if (available.indexOf(wanted) !== -1) return;
        let message = target + ' exportiert nichts mit dem Namen „' + wanted + '“.';
        if (wanted === 'default') message = target + ' hat keinen Standard-Export (export default). Benannte Exporte importierst du mit geschweiften Klammern: import { … } from …';
        else if (available.length) message += ' Vorhanden: ' + available.join(', ') + '.';
        else message += ' Die Datei exportiert noch gar nichts. Hast du export vergessen?';
        throw linkError(name, node, message);
      };
      m.imports.forEach(function (i) { if (!i.namespace) check(i.target, i.name, i.node); });
      m.exports.forEach(function (e) { if (e.from) check(e.from, e.imported, e.node); });
    });
  }

  function moduleSource(m, isAsync, snapshot) {
    if (m.kind === 'cjs') {
      const wrapper = '(function (exports, require, module, __filename, __dirname) {';
      return { prefix: wrapper, code: wrapper + m.body + '\n;' + (snapshot || '') + '\n})\n//# sourceURL=' + MODULE_URL + m.name };
    }
    const getters = m.exports.map(function (e) {
      return JSON.stringify(e.name) + ':function(){return ' + e.get + ';}';
    }).join(',');
    let prefix = '(' + (isAsync ? 'async ' : '') + 'function(__cwReq,__cwExp,__cwDyn,__cwMeta){\'use strict\';__cwExp({' + getters + '});';
    m.requests.forEach(function (r) {
      if (r.target) prefix += 'const ' + r.local + '=' + (isAsync ? 'await ' : '') + '__cwReq(' + JSON.stringify(r.target) + ');';
      else if (r.alias) prefix += 'const ' + r.alias + '=' + r.local + ';';
      else prefix += 'const ' + r.destructure + '=' + r.local + ';';
    });
    return { prefix: prefix, code: prefix + m.body + '\n;' + (snapshot || '') + '\n})\n//# sourceURL=' + MODULE_URL + m.name };
  }

  CW.compileModules = function compileModules(files, entry, options) {
    options = options || {};
    const node = options.node;
    const modules = {};
    const names = Object.keys(files).filter(function (n) { return node ? /\.(m?js|cjs)$/.test(n) : /\.m?js$/.test(n); });
    if (!Object.prototype.hasOwnProperty.call(files, entry)) {
      return { syntaxError: { file: entry, line: 1, column: 1, message: 'Die Startdatei „' + entry + '“ fehlt.', raw: 'missing entry ' + entry } };
    }
    let packageType = null;
    if (node && typeof files['package.json'] === 'string') {
      try {
        const pkg = JSON.parse(files['package.json']);
        packageType = pkg && typeof pkg.type === 'string' ? pkg.type : null;
      } catch (e) {
        const message = 'package.json ist kein gültiges JSON: ' + e.message + '. Häufig: ein Komma zu viel am Ende oder Text ohne "Anführungszeichen".';
        return { syntaxError: { file: 'package.json', line: 1, column: 1, message: message, raw: String(e.message) } };
      }
    }
    const kindOf = function (name) {
      if (!node || /\.mjs$/.test(name)) return 'esm';
      if (/\.cjs$/.test(name)) return 'cjs';
      if (packageType === 'module') return 'esm';
      if (packageType === 'commonjs') return 'cjs';
      return looksLikeEsm(String(files[name])) ? 'esm' : 'cjs';
    };
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const kind = kindOf(name);
      try {
        modules[name] = kind === 'cjs' ? compileCommonJs(name, String(files[name]), options) : compileModule(name, String(files[name]), files, options);
      } catch (e) {
        if (e && e.cwLink) return { syntaxError: { file: e.cwLink.file, line: e.cwLink.line, column: e.cwLink.column, message: e.message, raw: e.message } };
        let message = translateSyntax(e && e.message);
        if (kind === 'cjs' && /^'import' and 'export' may appear only/.test(String(e && e.message))) {
          message = name + ' ist eine CommonJS-Datei (in package.json steht "type": "commonjs"). Nutze dort require(…) und module.exports, oder stelle auf "type": "module" um.';
        }
        if (e && e.loc) return { syntaxError: { file: name, line: e.loc.line, column: e.loc.column + 1, message: message, raw: String(e.message) } };
        return { syntaxError: { file: name, line: 1, column: 1, message: message, raw: String(e && e.message) } };
      }
    }
    try {
      checkLinks(modules, options);
    } catch (e) {
      return { syntaxError: { file: e.cwLink.file, line: e.cwLink.line, column: e.cwLink.column, message: e.message, raw: e.message } };
    }
    const isAsync = names.some(function (n) { return modules[n].async; });
    return { files: files, modules: modules, entry: entry, async: isAsync };
  };

  function createLoader(g, compiled, snapshotCode, nodeEnv) {
    const records = {};
    const sources = {};
    const builtinCache = {};
    const jsonCache = {};
    Object.keys(compiled.modules).forEach(function (name) {
      const built = moduleSource(compiled.modules[name], compiled.async, name === compiled.entry ? snapshotCode : '');
      sources[name] = { prefix: built.prefix.length, lines: compiled.modules[name].lines };
      records[name] = { kind: compiled.modules[name].kind, fn: (0, g.eval)(built.code), ns: null, state: 'new', result: null, module: null };
    });

    const fullPath = function (name) { return PROJECT_DIR + name; };
    const dirOf = function (name) { const p = fullPath(name); return p.slice(0, p.lastIndexOf('/')); };

    function notFound(message) {
      const e = new Error(message);
      e.code = 'MODULE_NOT_FOUND';
      return e;
    }

    function builtinNamespace(name) {
      if (builtinCache[name]) return builtinCache[name];
      const value = nodeEnv.builtin(name);
      const ns = Object.create(null);
      nodeEnv.builtinNames(name).sort().forEach(function (key) {
        Object.defineProperty(ns, key, { enumerable: true, get: function () { return key === 'default' ? value : value[key]; } });
      });
      Object.defineProperty(ns, Symbol.toStringTag, { value: 'Module' });
      builtinCache[name] = ns;
      return ns;
    }

    function readJson(name) {
      if (!Object.prototype.hasOwnProperty.call(jsonCache, name)) {
        try { jsonCache[name] = JSON.parse(compiled.files[name]); } catch (e) { throw new SyntaxError(name + ' ist kein gültiges JSON: ' + e.message); }
      }
      return jsonCache[name];
    }

    function resolveRequire(from, spec) {
      const base = projectPath(from, spec);
      const has = function (n) { return Object.prototype.hasOwnProperty.call(compiled.files, n); };
      const candidates = [base, base + '.js', base + '.json', base + '.cjs', base + '/index.js', base + '/index.json'];
      for (let i = 0; i < candidates.length; i++) if (candidates[i] && has(candidates[i])) return candidates[i];
      throw notFound('Das Modul „' + spec + '“ wurde nicht gefunden (gesucht von ' + from + ' aus). Vorhanden: ' + Object.keys(compiled.files).join(', ') + '.');
    }

    function makeRequire(from) {
      const require = function (spec) {
        if (typeof spec !== 'string') throw new TypeError('require(…) braucht den Namen oder Pfad als Text, z. B. require("./rechner.js").');
        if (nodeEnv && nodeEnv.isBuiltin(spec)) return nodeEnv.builtin(spec);
        if (!/^(\.\.?(\/|$)|\/)/.test(spec)) throw notFound(packageMessage(spec));
        const target = resolveRequire(from, spec);
        if (/\.json$/.test(target)) return readJson(target);
        if (!records[target]) throw new Error(target + ' ist keine JavaScript-Datei und lässt sich nicht mit require laden.');
        if (records[target].kind === 'cjs') return requireCommonJs(target);
        if (compiled.async) throw new Error('require(…) kann ' + target + ' nicht laden, weil dort await ganz oben steht. Nutze stattdessen await import(…).');
        return evaluate(target);
      };
      require.resolve = function (spec) { return nodeEnv && nodeEnv.isBuiltin(spec) ? spec : fullPath(resolveRequire(from, spec)); };
      require.cache = {};
      Object.defineProperty(require, 'main', { get: function () { return records[compiled.entry] && records[compiled.entry].module; } });
      return require;
    }

    function requireCommonJs(name) {
      const record = records[name];
      if (record.module) return record.module.exports;
      const module = { id: name === compiled.entry ? '.' : fullPath(name), filename: fullPath(name), path: dirOf(name), exports: {}, loaded: false, children: [] };
      record.module = module;
      record.state = 'evaluating';
      try {
        record.fn.call(module.exports, module.exports, makeRequire(name), module, fullPath(name), dirOf(name));
      } finally {
        record.state = 'done';
      }
      module.loaded = true;
      record.settled = true;
      return module.exports;
    }

    function commonJsNamespace(name) {
      const record = records[name];
      const exportsValue = requireCommonJs(name);
      if (record.ns) return record.ns;
      const ns = Object.create(null);
      const keys = exportsValue && (typeof exportsValue === 'object' || typeof exportsValue === 'function') ? Object.keys(exportsValue) : [];
      keys.concat('default').sort().forEach(function (key) {
        Object.defineProperty(ns, key, { enumerable: true, get: function () { return key === 'default' ? record.module.exports : record.module.exports[key]; } });
      });
      Object.defineProperty(ns, Symbol.toStringTag, { value: 'Module' });
      record.ns = ns;
      return ns;
    }

    function importModule(name) {
      if (name.indexOf('node:') === 0) return builtinNamespace(name);
      if (records[name].kind === 'cjs') return commonJsNamespace(name);
      return evaluate(name);
    }

    function namespace(record) {
      if (!record.ns) {
        record.ns = Object.create(null);
        Object.defineProperty(record.ns, Symbol.toStringTag, { value: 'Module' });
      }
      return record.ns;
    }

    function evaluate(name) {
      const record = records[name];
      const ns = namespace(record);
      if (record.state !== 'new') return record.state === 'done' && compiled.async ? record.result : ns;
      record.state = 'evaluating';
      const define = function (getters) {
        const all = Object.assign({}, starGetters(name, getters), getters);
        Object.keys(all).sort().forEach(function (key) {
          Object.defineProperty(ns, key, {
            enumerable: true,
            get: all[key],
            set: function () { throw new TypeError('Importierte Werte sind schreibgeschützt. Ändere „' + key + '“ in ' + name + ' selbst.'); },
          });
        });
      };
      const dynamicImport = function (spec) {
        return Promise.resolve().then(function () {
          if (nodeEnv && nodeEnv.isBuiltin(spec)) return builtinNamespace('node:' + nodeEnv.canonical(spec));
          if (nodeEnv && !/^\.\.?\//.test(String(spec))) throw notFound(packageMessage(spec));
          let target;
          try { target = resolveModule(name, spec, compiled.files); } catch (e) { throw new TypeError(e.message); }
          if (!records[target]) throw new TypeError(target + ' ist keine JavaScript-Datei und lässt sich nicht importieren.');
          return importModule(target);
        });
      };
      const meta = nodeEnv
        ? { url: 'file://' + fullPath(name), filename: fullPath(name), dirname: dirOf(name) }
        : { url: 'file:///' + name };
      let value;
      try {
        value = record.fn.call(undefined, importModule, define, dynamicImport, meta);
      } finally {
        record.state = 'done';
      }
      Object.preventExtensions(ns);
      if (compiled.async) {
        record.result = value.then(function () { record.settled = true; return ns; });
        return record.result;
      }
      record.settled = true;
      return ns;
    }

    function starGetters(name, own) {
      const out = {};
      compiled.modules[name].stars.forEach(function (s) {
        exportedNames(compiled.modules, s.target, [name]).forEach(function (key) {
          if (key === 'default' || own[key] || out[key]) return;
          out[key] = function () { return namespace(records[s.target])[key]; };
        });
      });
      return out;
    }

    return {
      sources: sources,
      start: function () {
        return records[compiled.entry].kind === 'cjs' ? requireCommonJs(compiled.entry) : evaluate(compiled.entry);
      },
      module: function (spec) {
        const name = String(spec).replace(/^\.\//, '');
        if (!records[name]) throw new Error('Die Datei „' + spec + '“ gibt es nicht. Vorhanden: ' + Object.keys(records).join(', ') + '.');
        if (records[name].kind === 'cjs') return requireCommonJs(name);
        return records[name].settled ? records[name].ns : evaluate(name);
      },
    };
  }

  function locateModuleError(error, sources) {
    const lines = String((error && error.stack) || '').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/cw-datei\/(.+?):(\d+):(\d+)/);
      if (!m || !sources[m[1]]) continue;
      const line = Number(m[2]);
      let column = Number(m[3]);
      if (line === 1) column = Math.max(1, column - sources[m[1]].prefix);
      if (line >= 1 && line <= sources[m[1]].lines) return { file: m[1], line: line, column: column };
    }
    return null;
  }

  const STORAGE_LIMIT = 100 * 1024;

  function makeStorage(store, changed) {
    const has = function (k) { return Object.prototype.hasOwnProperty.call(store, k); };
    const storage = {
      getItem: function (k) { k = String(k); return has(k) ? store[k] : null; },
      setItem: function (k, v) {
        k = String(k);
        v = String(v);
        let size = k.length + v.length;
        Object.keys(store).forEach(function (key) { if (key !== k) size += key.length + store[key].length; });
        if (size > STORAGE_LIMIT) throw new Error('Der Speicher ist voll (höchstens 100 KB in Codewerk).');
        store[k] = v;
        changed();
      },
      removeItem: function (k) { delete store[String(k)]; changed(); },
      clear: function () { Object.keys(store).forEach(function (k) { delete store[k]; }); changed(); },
      key: function (i) { const keys = Object.keys(store); return i >= 0 && i < keys.length ? keys[i] : null; },
    };
    Object.defineProperty(storage, 'length', { get: function () { return Object.keys(store).length; } });
    return storage;
  }

  CW.installPage = function installPage(g, initial) {
    const data = {};
    if (initial && typeof initial === 'object') {
      Object.keys(initial).forEach(function (k) { data[k] = String(initial[k]); });
    }
    let listener = null;
    const changed = function () { if (listener) listener(); };
    [['localStorage', data, changed], ['sessionStorage', {}, function () {}]].forEach(function (entry) {
      try { Object.defineProperty(g, entry[0], { configurable: true, enumerable: true, value: makeStorage(entry[1], entry[2]) }); } catch (e) { }
    });
    ['XMLHttpRequest', 'WebSocket', 'EventSource', 'indexedDB', 'caches', 'BroadcastChannel', 'SharedWorker', 'Worker', 'open'].forEach(function (name) {
      try { g[name] = undefined; } catch (e) { }
    });
    return {
      dump: function () { return Object.assign({}, data); },
      onChange: function (fn) { listener = fn; },
    };
  };

  let currentAsyncError = null;
  CW.asyncError = function (reason) { if (currentAsyncError) currentAsyncError(reason); };

  CW.runLesson = async function runLesson(options) {
    const files = options.files && typeof options.files === 'object' ? options.files : null;
    const entry = String(options.entry || 'main.js');
    const code = files ? String(files[entry] || '') : String(options.code || '');
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
    let guarded = null;
    let compiled = null;
    const nodeEnv = files && options.node && CW.createNodeEnv
      ? CW.createNodeEnv(g, { files: files, entry: entry, args: options.node.args, env: options.node.env })
      : null;
    if (files) {
      compiled = CW.compileModules(files, entry, { loopGuard: !!options.loopGuard, node: nodeEnv });
      if (compiled.syntaxError) {
        result.syntaxError = compiled.syntaxError;
        return result;
      }
      declarations = topLevelDeclarations(compiled.modules[entry].ast);
    } else try {
      const ast = g.acorn.parse(STRICT_PREFIX + code, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
      declarations = topLevelDeclarations(ast);
      if (options.loopGuard) guarded = guardLoops(STRICT_PREFIX + code, ast);
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
      loop: function (start) {
        if (Date.now() - start > LOOP_LIMIT_MS) throw new Error(LOOP_MESSAGE);
      },
      snapshot: function (entries) {
        entriesFn = entries;
        takeSnapshot();
        if (g.__cw.phase === 'user') capturing = false;
      },
      api: {
        test: function (name, fn) { registered.push({ name: name, fn: fn }); },
        expect: makeExpect(),
        output: function () { return result.logs.map(function (l) { return l.text; }); },
        source: function (name) {
          if (!files || name === undefined) return code;
          const file = String(name).replace(/^\.\//, '');
          return Object.prototype.hasOwnProperty.call(files, file) ? String(files[file]) : null;
        },
        modul: function (name) {
          if (!loader) throw new Error('modul(…) gibt es nur in Lektionen mit mehreren Dateien.');
          return loader.module(name);
        },
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
    let loader = null;

    const snapshotCall = '__cw.snapshot(function(){return [' + getters + '];});';
    let program;
    let entryPromise = null;
    if (compiled) {
      try {
        loader = createLoader(g, compiled, snapshotCall, nodeEnv);
      } catch (e) {
        result.syntaxError = { file: entry, line: 1, column: 1, message: translateSyntax(e && e.message), raw: String(e && e.message) };
        return result;
      }
      g.__cw.start = function () {
        const value = loader.start();
        if (compiled.async) entryPromise = value;
      };
      program = ';__cw.start();\n';
    } else {
      program = (guarded || STRICT_PREFIX + code) + '\n;' + snapshotCall + '\n';
    }
    if (testsSource) {
      program += ';__cw.phase="tests";\n;(function(){ const { test, expect, output, source, capture, wait, modul' + (nodeEnv ? ', node' : '') + ' } = __cw.api;\n' +
        testsSource + '\n})();\n';
    }
    program += '//# sourceURL=' + SOURCE_NAME;

    function userError(e) {
      const isObject = e !== null && typeof e === 'object';
      const name = isObject ? String(e.name || 'Error') : 'Error';
      const message = isObject ? String(e.message) : String(e);
      const loc = isObject ? (loader ? locateModuleError(e, loader.sources) : locateError(e, userLineCount)) : null;
      const error = {
        name: name,
        message: isObject ? translateError(name, message) : 'Dein Code hat etwas „geworfen“ (throw): ' + show(e),
        raw: isObject ? name + ': ' + message : String(e),
        line: loc ? loc.line : null,
        column: loc ? loc.column : null,
      };
      if (loader) error.file = loc ? loc.file : null;
      return error;
    }

    let testAsyncError = null;
    function onAsyncError(e) {
      if (e && e.__cwExit) return;
      if (g.__cw.phase === 'running-tests') { if (!testAsyncError) testAsyncError = e; return; }
      if (!result.error) result.error = userError(e);
    }
    currentAsyncError = onAsyncError;
    const timers = watchTimers(g, onAsyncError);
    g.fetch = practiceFetch(g);
    if (nodeEnv) {
      nodeEnv.install(timers, push, onAsyncError);
      g.fetch = nodeEnv.wrapFetch(g.fetch);
      g.__cw.api.node = nodeEnv.testApi;
    }

    try {
      (0, g.eval)(program);
    } catch (e) {
      if (e && e.__cwExit) {
        if (g.__cw.phase === 'user') capturing = false;
      } else if (g.__cw.phase === 'tests') {
        const message = e !== null && typeof e === 'object' ? String(e.message) : String(e);
        result.testsBroken = 'Die Tests dieser Lektion enthalten einen Fehler: ' + message;
      } else {
        result.error = userError(e);
      }
    }

    if (!result.syntaxError && !result.testsBroken) {
      g.__cw.phase = 'user-async';
      if (entryPromise) {
        entryPromise.then(null, onAsyncError);
        await Promise.race([
          entryPromise.then(null, function () {}),
          new Promise(function (resolve) { (timers.real.setTimeout || setTimeout)(resolve, SETTLE_LIMIT_MS); }),
        ]);
      }
      capturing = true;
      if (nodeEnv) nodeEnv.drainTicks();
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
      if (nodeEnv) {
        nodeEnv.flush();
        result.fsChanges = nodeEnv.changes();
        const exitCode = nodeEnv.exitCode();
        if (exitCode) result.logs.push({ type: 'warn', text: 'Das Programm endet mit Exit-Code ' + exitCode + ' (alles außer 0 bedeutet: Fehler).' });
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
