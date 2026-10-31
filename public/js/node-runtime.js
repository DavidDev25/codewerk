(function (root) {
  'use strict';

  const CW = root.CW;
  const CWD = '/projekt';
  const NODE_VERSION = '24.11.0';
  const BUILTINS = ['fs', 'fs/promises', 'path', 'events', 'http', 'process', 'util', 'timers/promises'];
  const REPLY_LIMIT_MS = 1000;

  function canonical(spec) {
    const name = String(spec).replace(/^node:/, '');
    return BUILTINS.indexOf(name) !== -1 ? name : null;
  }

  function byteLength(text) {
    return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length;
  }

  function createPath() {
    function check(value, fn) {
      if (typeof value !== 'string') throw new TypeError('path.' + fn + '(…) braucht Texte, bekommen hat es ' + (value === null ? 'null' : typeof value) + '.');
    }
    function normalize(p) {
      check(p, 'normalize');
      const absolute = p.startsWith('/');
      const out = [];
      p.split('/').forEach(function (part) {
        if (part === '' || part === '.') return;
        if (part === '..') {
          if (out.length && out[out.length - 1] !== '..') out.pop();
          else if (!absolute) out.push('..');
        } else out.push(part);
      });
      let result = (absolute ? '/' : '') + out.join('/');
      if (p.endsWith('/') && out.length) result += '/';
      return result || (absolute ? '/' : '.');
    }
    const path = {
      sep: '/',
      delimiter: ':',
      normalize: normalize,
      join: function () {
        const parts = [].slice.call(arguments);
        parts.forEach(function (p) { check(p, 'join'); });
        const joined = parts.filter(Boolean).join('/');
        return joined ? normalize(joined) : '.';
      },
      resolve: function () {
        let result = '';
        for (let i = arguments.length - 1; i >= 0 && !result.startsWith('/'); i--) {
          check(arguments[i], 'resolve');
          if (arguments[i]) result = arguments[i] + (result ? '/' + result : '');
        }
        if (!result.startsWith('/')) result = CWD + (result ? '/' + result : '');
        result = normalize(result);
        return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
      },
      isAbsolute: function (p) { check(p, 'isAbsolute'); return p.startsWith('/'); },
      dirname: function (p) {
        check(p, 'dirname');
        if (p.length > 1) p = p.replace(/\/+$/, '');
        const i = p.lastIndexOf('/');
        if (i === -1) return '.';
        return i === 0 ? '/' : p.slice(0, i);
      },
      basename: function (p, ext) {
        check(p, 'basename');
        p = p.replace(/\/+$/, '');
        let base = p.slice(p.lastIndexOf('/') + 1);
        if (ext && base.endsWith(ext) && base !== ext) base = base.slice(0, -ext.length);
        return base;
      },
      extname: function (p) {
        const base = path.basename(p);
        const i = base.lastIndexOf('.');
        return i <= 0 ? '' : base.slice(i);
      },
      parse: function (p) {
        const base = path.basename(p);
        const ext = path.extname(p);
        return { root: p.startsWith('/') ? '/' : '', dir: p.indexOf('/') === -1 ? '' : path.dirname(p), base: base, ext: ext, name: ext ? base.slice(0, -ext.length) : base };
      },
      format: function (o) {
        const base = o.base || (o.name || '') + (o.ext || '');
        const dir = o.dir || o.root || '';
        return dir ? (dir.endsWith('/') ? dir + base : dir + '/' + base) : base;
      },
      relative: function (from, to) {
        const a = path.resolve(from).split('/').filter(Boolean);
        const b = path.resolve(to).split('/').filter(Boolean);
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i++;
        return a.slice(i).map(function () { return '..'; }).concat(b.slice(i)).join('/');
      },
    };
    path.posix = path;
    return path;
  }

  const listenersOf = new WeakMap();

  class EventEmitter {
    static get defaultMaxListeners() { return 10; }

    _list(name, create) {
      let map = listenersOf.get(this);
      if (!map) { map = new Map(); listenersOf.set(this, map); }
      if (!map.has(name) && create) map.set(name, []);
      return map.get(name) || [];
    }

    _add(name, fn, once, front) {
      if (typeof fn !== 'function') throw new TypeError('Der zweite Wert muss eine Funktion sein, z. B. on("' + String(name) + '", (wert) => { … }).');
      const list = this._list(name, true);
      if (front) list.unshift({ fn: fn, once: once }); else list.push({ fn: fn, once: once });
      return this;
    }

    on(name, fn) { return this._add(name, fn, false, false); }
    addListener(name, fn) { return this.on(name, fn); }
    prependListener(name, fn) { return this._add(name, fn, false, true); }
    once(name, fn) { return this._add(name, fn, true, false); }
    prependOnceListener(name, fn) { return this._add(name, fn, true, true); }

    off(name, fn) {
      const list = this._list(name, false);
      const i = list.findIndex(function (entry) { return entry.fn === fn; });
      if (i !== -1) list.splice(i, 1);
      return this;
    }

    removeListener(name, fn) { return this.off(name, fn); }

    removeAllListeners(name) {
      const map = listenersOf.get(this);
      if (map) { if (name === undefined) map.clear(); else map.delete(name); }
      return this;
    }

    emit(name) {
      const args = [].slice.call(arguments, 1);
      const list = this._list(name, false);
      if (!list.length) {
        if (name === 'error') {
          const e = args[0];
          throw e instanceof Error ? e : new Error('Unbehandeltes "error"-Event: ' + CW.show(e));
        }
        return false;
      }
      const self = this;
      list.slice().forEach(function (entry) {
        if (entry.once) self.off(name, entry.fn);
        entry.fn.apply(self, args);
      });
      return true;
    }

    listenerCount(name) { return this._list(name, false).length; }
    listeners(name) { return this._list(name, false).map(function (entry) { return entry.fn; }); }
    eventNames() { const map = listenersOf.get(this); return map ? Array.from(map.keys()).filter((n) => map.get(n).length) : []; }
    setMaxListeners() { return this; }
    getMaxListeners() { return 10; }
  }
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.once = function (emitter, name) {
    return new Promise(function (resolve) { emitter.once(name, function () { resolve([].slice.call(arguments)); }); });
  };

  const FS_TEXT = {
    ENOENT: 'no such file or directory',
    EEXIST: 'file already exists',
    EISDIR: 'illegal operation on a directory',
    ENOTDIR: 'not a directory',
    ENOTEMPTY: 'directory not empty',
  };

  function createFs(initial, path, later) {
    const files = new Map();
    const dirs = new Set(['/', CWD]);
    const start = new Map();
    const times = new Map();

    function addParents(p) {
      let dir = path.dirname(p);
      while (!dirs.has(dir)) { dirs.add(dir); dir = path.dirname(dir); }
    }
    Object.keys(initial).forEach(function (name) {
      const p = CWD + '/' + name;
      files.set(p, String(initial[name]));
      start.set(p, String(initial[name]));
      addParents(p);
    });

    function fail(code, syscall, p, extra) {
      const e = new Error(code + ': ' + FS_TEXT[code] + ', ' + syscall + " '" + p + "'" + (extra ? " -> '" + extra + "'" : ''));
      e.errno = -2;
      e.code = code;
      e.syscall = syscall;
      e.path = p;
      return e;
    }
    function where(p, fn) {
      if (p && typeof p === 'object' && typeof p.pathname === 'string') p = p.pathname;
      if (typeof p !== 'string') throw new TypeError('fs.' + fn + '(…) braucht einen Pfad als Text, bekommen hat es ' + (p === null ? 'null' : typeof p) + '.');
      return path.resolve(p);
    }
    function text(data, fn) {
      if (typeof data === 'string') return data;
      if (data && typeof data === 'object' && typeof data.byteLength === 'number' && typeof data.toString === 'function') return data.toString();
      throw new TypeError('fs.' + fn + '(…) speichert nur Text, bekommen hat es ' + (data === null ? 'null' : Array.isArray(data) ? 'ein Array' : typeof data === 'object' ? 'ein Objekt' : typeof data) +
        '. Für Objekte und Arrays: JSON.stringify(…).');
    }
    function parentMustExist(p, syscall) {
      const dir = path.dirname(p);
      if (!dirs.has(dir)) throw fail(files.has(dir) ? 'ENOTDIR' : 'ENOENT', syscall, p);
    }
    function dirent(name, isDir) {
      return { name: name, isFile: function () { return !isDir; }, isDirectory: function () { return isDir; } };
    }
    function children(dir) {
      const prefix = dir === '/' ? '/' : dir + '/';
      const out = new Map();
      files.forEach(function (_, p) { if (p.startsWith(prefix) && p.indexOf('/', prefix.length) === -1) out.set(p.slice(prefix.length), false); });
      dirs.forEach(function (p) { if (p !== dir && p.startsWith(prefix) && p.indexOf('/', prefix.length) === -1) out.set(p.slice(prefix.length), true); });
      return out;
    }

    const fs = {
      existsSync: function (p) {
        try { p = where(p, 'existsSync'); } catch (e) { return false; }
        return files.has(p) || dirs.has(p);
      },
      readFileSync: function (p) {
        p = where(p, 'readFileSync');
        if (dirs.has(p)) throw fail('EISDIR', 'read', p);
        if (!files.has(p)) throw fail('ENOENT', 'open', p);
        return files.get(p);
      },
      writeFileSync: function (p, data) {
        p = where(p, 'writeFileSync');
        const value = text(data, 'writeFileSync');
        if (dirs.has(p)) throw fail('EISDIR', 'open', p);
        parentMustExist(p, 'open');
        files.set(p, value);
        times.set(p, new Date());
      },
      appendFileSync: function (p, data) {
        p = where(p, 'appendFileSync');
        const value = text(data, 'appendFileSync');
        if (dirs.has(p)) throw fail('EISDIR', 'open', p);
        parentMustExist(p, 'open');
        files.set(p, (files.get(p) || '') + value);
        times.set(p, new Date());
      },
      readdirSync: function (p, options) {
        p = where(p, 'readdirSync');
        if (files.has(p)) throw fail('ENOTDIR', 'scandir', p);
        if (!dirs.has(p)) throw fail('ENOENT', 'scandir', p);
        const list = children(p);
        const names = Array.from(list.keys()).sort();
        return options && options.withFileTypes ? names.map(function (n) { return dirent(n, list.get(n)); }) : names;
      },
      mkdirSync: function (p, options) {
        p = where(p, 'mkdirSync');
        const recursive = !!(options && options.recursive);
        if (dirs.has(p) || files.has(p)) {
          if (recursive && dirs.has(p)) return undefined;
          throw fail('EEXIST', 'mkdir', p);
        }
        if (!recursive) parentMustExist(p, 'mkdir');
        dirs.add(p);
        addParents(p);
        return recursive ? p : undefined;
      },
      unlinkSync: function (p) {
        p = where(p, 'unlinkSync');
        if (dirs.has(p)) throw fail('EISDIR', 'unlink', p);
        if (!files.delete(p)) throw fail('ENOENT', 'unlink', p);
      },
      rmSync: function (p, options) {
        p = where(p, 'rmSync');
        if (files.delete(p)) return;
        if (dirs.has(p)) {
          if (!(options && options.recursive)) throw fail('EISDIR', 'rm', p);
          const prefix = p + '/';
          Array.from(files.keys()).forEach(function (f) { if (f.startsWith(prefix)) files.delete(f); });
          Array.from(dirs).forEach(function (d) { if (d === p || d.startsWith(prefix)) dirs.delete(d); });
          return;
        }
        if (!(options && options.force)) throw fail('ENOENT', 'rm', p);
      },
      rmdirSync: function (p) {
        p = where(p, 'rmdirSync');
        if (!dirs.has(p)) throw fail(files.has(p) ? 'ENOTDIR' : 'ENOENT', 'rmdir', p);
        if (children(p).size) throw fail('ENOTEMPTY', 'rmdir', p);
        dirs.delete(p);
      },
      renameSync: function (from, to) {
        from = where(from, 'renameSync');
        to = where(to, 'renameSync');
        if (!files.has(from)) throw fail('ENOENT', 'rename', from, to);
        parentMustExist(to, 'rename');
        files.set(to, files.get(from));
        files.delete(from);
      },
      copyFileSync: function (from, to) {
        from = where(from, 'copyFileSync');
        to = where(to, 'copyFileSync');
        if (!files.has(from)) throw fail('ENOENT', 'copyfile', from, to);
        parentMustExist(to, 'copyfile');
        files.set(to, files.get(from));
      },
      statSync: function (p) {
        p = where(p, 'statSync');
        const isDir = dirs.has(p);
        if (!isDir && !files.has(p)) throw fail('ENOENT', 'stat', p);
        const mtime = times.get(p) || new Date(0);
        return {
          size: isDir ? 4096 : byteLength(files.get(p)),
          mtime: mtime,
          mtimeMs: mtime.getTime(),
          isFile: function () { return !isDir; },
          isDirectory: function () { return isDir; },
        };
      },
    };

    const promises = {};
    const SYNC = ['readFile', 'writeFile', 'appendFile', 'readdir', 'mkdir', 'unlink', 'rm', 'rmdir', 'rename', 'copyFile', 'stat'];
    SYNC.forEach(function (name) {
      const sync = fs[name + 'Sync'];
      promises[name] = function () {
        const args = arguments;
        return new Promise(function (resolve, reject) {
          later(function () {
            try { resolve(sync.apply(null, args)); } catch (e) { reject(e); }
          });
        });
      };
      fs[name] = function () {
        const args = [].slice.call(arguments);
        const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        if (!callback) throw new TypeError('fs.' + name + '(…) braucht als letzten Wert eine Callback-Funktion (fehler, daten) => { … }. Ohne Callback: fs.' + name + 'Sync(…) oder fs.promises.' + name + '(…).');
        later(function () {
          let value;
          try { value = sync.apply(null, args); } catch (e) { callback(e); return; }
          callback(null, value);
        });
      };
    });
    promises.access = function (p) {
      return new Promise(function (resolve, reject) {
        later(function () { if (fs.existsSync(p)) resolve(); else reject(fail('ENOENT', 'access', where(p, 'access'))); });
      });
    };
    fs.promises = promises;
    fs.constants = { F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1 };

    return {
      fs: fs,
      read: function (p) {
        const full = path.resolve(p);
        return files.has(full) ? files.get(full) : null;
      },
      changes: function () {
        const out = [];
        const short = function (p) { return p.startsWith(CWD + '/') ? p.slice(CWD.length + 1) : p; };
        files.forEach(function (content, p) {
          if (!start.has(p)) out.push({ path: short(p), status: 'neu', content: content });
          else if (start.get(p) !== content) out.push({ path: short(p), status: 'geändert', content: content });
        });
        start.forEach(function (_, p) { if (!files.has(p)) out.push({ path: short(p), status: 'gelöscht', content: '' }); });
        return out;
      },
    };
  }

  const STATUS_CODES = {
    200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed',
    409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 503: 'Service Unavailable',
  };

  function chunkText(chunk, fn) {
    if (typeof chunk === 'string') return chunk;
    if (chunk && typeof chunk === 'object' && typeof chunk.byteLength === 'number' && typeof chunk.toString === 'function') return chunk.toString();
    throw new TypeError('res.' + fn + '(…) braucht einen Text, bekommen hat es ' + (chunk === null ? 'null' : Array.isArray(chunk) ? 'ein Array' : typeof chunk === 'object' ? 'ein Objekt' : typeof chunk) +
      '. Für Objekte und Arrays: JSON.stringify(…), für Zahlen: String(…).');
  }

  function createHttp(env) {
    const servers = new Map();
    let lastServer = null;
    let nextPort = 40000;

    class IncomingMessage extends EventEmitter {
      constructor(method, url, headers) {
        super();
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.httpVersion = '1.1';
        this.complete = false;
        this.socket = { remoteAddress: '127.0.0.1' };
      }
      setEncoding() { return this; }
      [Symbol.asyncIterator]() {
        const chunks = [];
        const self = this;
        const finished = this.complete ? Promise.resolve() : new Promise(function (resolve) {
          self.on('data', function (c) { chunks.push(c); });
          self.on('end', resolve);
        });
        let i = 0;
        return {
          next: function () {
            return finished.then(function () { return i < chunks.length ? { value: chunks[i++], done: false } : { value: undefined, done: true }; });
          },
          [Symbol.asyncIterator]: function () { return this; },
        };
      }
    }

    class ServerResponse extends EventEmitter {
      constructor(finish) {
        super();
        this.statusCode = 200;
        this.statusMessage = '';
        this.headersSent = false;
        this.writableEnded = false;
        Object.defineProperty(this, '_headers', { value: {} });
        Object.defineProperty(this, '_body', { value: [] });
        Object.defineProperty(this, '_finish', { value: finish });
      }
      get finished() { return this.writableEnded; }
      setHeader(name, value) {
        if (this.headersSent) {
          const e = new Error('Die Kopfzeilen (Header) sind schon gesendet. setHeader(…) und writeHead(…) müssen vor write(…) und end(…) stehen.');
          e.code = 'ERR_HTTP_HEADERS_SENT';
          throw e;
        }
        this._headers[String(name).toLowerCase()] = Array.isArray(value) ? value.map(String) : String(value);
        return this;
      }
      getHeader(name) { return this._headers[String(name).toLowerCase()]; }
      getHeaders() { return Object.assign({}, this._headers); }
      hasHeader(name) { return Object.prototype.hasOwnProperty.call(this._headers, String(name).toLowerCase()); }
      removeHeader(name) { delete this._headers[String(name).toLowerCase()]; }
      writeHead(status, message, headers) {
        if (typeof message === 'object' && message !== null) { headers = message; message = undefined; }
        if (headers) Object.keys(headers).forEach((k) => this.setHeader(k, headers[k]));
        this.statusCode = Number(status);
        if (message) this.statusMessage = String(message);
        this.headersSent = true;
        return this;
      }
      write(chunk) {
        if (this.writableEnded) throw new Error('write(…) nach end(…): Die Antwort ist schon fertig.');
        this._body.push(chunkText(chunk, 'write'));
        this.headersSent = true;
        return true;
      }
      end(chunk, callback) {
        if (typeof chunk === 'function') { callback = chunk; chunk = undefined; }
        if (this.writableEnded) return this;
        if (chunk !== undefined && chunk !== null) this._body.push(chunkText(chunk, 'end'));
        this.headersSent = true;
        this.writableEnded = true;
        this._finish({
          status: this.statusCode,
          statusText: this.statusMessage || STATUS_CODES[this.statusCode] || '',
          headers: Object.assign({}, this._headers),
          body: this._body.join(''),
        });
        this.emit('finish');
        if (callback) callback();
        return this;
      }
    }

    class Server extends EventEmitter {
      constructor(handler) {
        super();
        this.listening = false;
        Object.defineProperty(this, '_port', { value: null, writable: true });
        if (handler) this.on('request', handler);
      }
      listen() {
        const args = [].slice.call(arguments);
        const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        let port = args[0] && typeof args[0] === 'object' ? args[0].port : args[0];
        port = port === undefined || port === null || port === '' ? 0 : Number(port);
        if (!Number.isInteger(port) || port < 0 || port > 65535) throw new RangeError('Der Port muss eine ganze Zahl von 0 bis 65535 sein, bekommen hat er ' + CW.show(args[0]) + '.');
        if (port === 0) port = nextPort++;
        const self = this;
        if (servers.has(port)) {
          env.later(function () {
            const e = new Error('listen EADDRINUSE: address already in use :::' + port);
            e.code = 'EADDRINUSE';
            self.emit('error', e);
          });
          return this;
        }
        servers.set(port, this);
        this._port = port;
        this.listening = true;
        lastServer = this;
        env.later(function () {
          self.emit('listening');
          if (callback) callback();
        });
        return this;
      }
      close(callback) {
        if (this._port !== null) servers.delete(this._port);
        if (lastServer === this) lastServer = null;
        this.listening = false;
        const self = this;
        env.later(function () {
          self.emit('close');
          if (callback) callback();
        });
        return this;
      }
      address() { return this.listening ? { port: this._port, address: '::', family: 'IPv6' } : null; }
    }

    function dispatch(request) {
      return new Promise(function (resolve, reject) {
        const server = request.port === null ? lastServer : servers.get(request.port);
        if (!server) {
          const e = new TypeError('fetch failed: Unter ' + (request.port === null ? 'localhost' : 'localhost:' + request.port) + ' läuft kein Server. Hast du server.listen(' + (request.port || 3000) + ') aufgerufen?');
          e.code = 'ECONNREFUSED';
          reject(e);
          return;
        }
        const headers = {};
        Object.keys(request.headers || {}).forEach(function (k) { headers[k.toLowerCase()] = String(request.headers[k]); });
        if (!headers.host) headers.host = 'localhost:' + server._port;
        const req = new IncomingMessage(String(request.method || 'GET').toUpperCase(), request.path || '/', headers);
        let done = false;
        const res = new ServerResponse(function (answer) { done = true; resolve(answer); });
        env.realLater(function () {
          if (!done) reject(new Error('Der Server hat nach ' + REPLY_LIMIT_MS / 1000 + ' Sekunde nicht geantwortet. Ruft jeder Weg in deinem Code res.end(…) auf?'));
        }, REPLY_LIMIT_MS);
        try {
          server.emit('request', req, res);
        } catch (e) {
          env.report(e);
          reject(new Error('Der Server ist bei dieser Anfrage abgestürzt: ' + (e && e.message ? e.message : String(e))));
          return;
        }
        env.later(function () {
          if (request.body !== undefined && request.body !== null && request.body !== '') req.emit('data', String(request.body));
          req.complete = true;
          req.emit('end');
        });
      });
    }

    const http = {
      createServer: function (options, handler) {
        return new Server(typeof options === 'function' ? options : handler);
      },
      Server: Server,
      IncomingMessage: IncomingMessage,
      ServerResponse: ServerResponse,
      STATUS_CODES: STATUS_CODES,
      METHODS: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    };
    return { http: http, dispatch: dispatch, running: function () { return !!lastServer; } };
  }

  function response(answer) {
    return {
      ok: answer.status >= 200 && answer.status < 300,
      status: answer.status,
      statusText: answer.statusText,
      headers: { get: function (name) { const v = answer.headers[String(name).toLowerCase()]; return v === undefined ? null : String(v); } },
      text: function () { return Promise.resolve(answer.body); },
      json: function () {
        try { return Promise.resolve(JSON.parse(answer.body)); } catch (e) {
          return Promise.reject(new SyntaxError('Die Antwort ist kein gültiges JSON: ' + CW.show(answer.body.slice(0, 60))));
        }
      },
    };
  }

  CW.createNodeEnv = function createNodeEnv(g, options) {
    const files = options.files || {};
    const entry = options.entry || 'main.js';
    const startedAt = Date.now();
    let timers = null;
    let push = function () {};
    let report = function () {};
    const pending = { log: '', error: '' };

    const env = {
      later: function (fn) { g.setTimeout(fn, 0); },
      realLater: function (fn, ms) { ((timers && timers.real.setTimeout) || setTimeout)(fn, ms); },
      report: function (e) { report(e); },
    };
    const path = createPath();
    const disk = createFs(files, path, env.later);
    const web = createHttp(env);

    function write(type, text) {
      pending[type] += String(text);
      const lines = pending[type].split('\n');
      pending[type] = lines.pop();
      lines.forEach(function (line) { push(type, [line]); });
      return true;
    }

    const ticks = [];
    let tickScheduled = false;
    function drainTicks() {
      tickScheduled = false;
      while (ticks.length) {
        const tick = ticks.shift();
        try { tick.fn.apply(null, tick.args); } catch (e) { report(e); }
      }
    }

    const proc = new EventEmitter();
    Object.assign(proc, {
      title: 'node',
      argv: ['/usr/local/bin/node', CWD + '/' + entry].concat((options.args || []).map(String)),
      argv0: 'node',
      execArgv: [],
      env: {},
      platform: 'linux',
      arch: 'x64',
      pid: 4242,
      version: 'v' + NODE_VERSION,
      versions: { node: NODE_VERSION },
      exitCode: undefined,
      cwd: function () { return CWD; },
      uptime: function () { return (Date.now() - startedAt) / 1000; },
      memoryUsage: function () { return { rss: 41943040, heapTotal: 16777216, heapUsed: 8388608, external: 1048576, arrayBuffers: 16384 }; },
      nextTick: function (fn) {
        if (typeof fn !== 'function') throw new TypeError('process.nextTick(…) braucht eine Funktion.');
        ticks.push({ fn: fn, args: [].slice.call(arguments, 1) });
        if (!tickScheduled) {
          tickScheduled = true;
          Promise.resolve().then(drainTicks);
        }
      },
      exit: function (code) {
        if (code !== undefined) proc.exitCode = Number(code);
        proc.emit('exit', proc.exitCode || 0);
        throw { __cwExit: true };
      },
      stdout: { write: function (text) { return write('log', text); }, isTTY: false, columns: 80 },
      stderr: { write: function (text) { return write('error', text); }, isTTY: false, columns: 80 },
    });
    const hrtime = function (previous) {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 1e6;
      const seconds = Math.floor(now / 1e9);
      const nanos = Math.floor(now % 1e9);
      if (!previous) return [seconds, nanos];
      let ds = seconds - previous[0];
      let dn = nanos - previous[1];
      if (dn < 0) { ds -= 1; dn += 1e9; }
      return [ds, dn];
    };
    hrtime.bigint = function () { return BigInt(Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) * 1e6)); };
    proc.hrtime = hrtime;
    const baseEnv = { NODE_ENV: 'development', HOME: '/home/codewerk', USER: 'codewerk', PATH: '/usr/local/bin:/usr/bin:/bin', LANG: 'de_DE.UTF-8' };
    const extraEnv = options.env || {};
    Object.keys(baseEnv).concat(Object.keys(extraEnv)).forEach(function (k) {
      proc.env[k] = String(Object.prototype.hasOwnProperty.call(extraEnv, k) ? extraEnv[k] : baseEnv[k]);
    });

    const util = {
      promisify: function (fn) {
        return function () {
          const args = [].slice.call(arguments);
          const self = this;
          return new Promise(function (resolve, reject) {
            fn.apply(self, args.concat(function (err, value) { if (err) reject(err); else resolve(value); }));
          });
        };
      },
      inspect: function (value) { return CW.show(value); },
      format: function (first) {
        const args = [].slice.call(arguments, 1);
        if (typeof first !== 'string') return [first].concat(args).map(function (a) { return typeof a === 'string' ? a : CW.show(a); }).join(' ');
        let out = first.replace(/%([sdifjoO%])/g, function (m, k) {
          if (k === '%') return '%';
          if (!args.length) return m;
          const v = args.shift();
          if (k === 'd' || k === 'i') return String(k === 'i' ? parseInt(v, 10) : Number(v));
          if (k === 'f') return String(parseFloat(v));
          if (k === 'j') return JSON.stringify(v);
          return typeof v === 'string' ? v : CW.show(v);
        });
        if (args.length) out += ' ' + args.map(function (a) { return typeof a === 'string' ? a : CW.show(a); }).join(' ');
        return out;
      },
      isDeepStrictEqual: function (a, b) { return JSON.stringify(a) === JSON.stringify(b); },
    };

    const timersPromises = {
      setTimeout: function (ms, value) { return new Promise(function (resolve) { g.setTimeout(function () { resolve(value); }, ms); }); },
      setImmediate: function (value) { return new Promise(function (resolve) { g.setTimeout(function () { resolve(value); }, 0); }); },
    };

    const modules = {
      fs: disk.fs,
      'fs/promises': disk.fs.promises,
      path: path,
      events: EventEmitter,
      http: web.http,
      process: proc,
      util: util,
      'timers/promises': timersPromises,
    };

    return {
      isBuiltin: function (spec) { return canonical(spec) !== null; },
      canonical: canonical,
      builtin: function (name) { return modules[canonical(name)]; },
      builtinNames: function (name) {
        const value = modules[canonical(name)];
        const names = Object.keys(value).concat(['default']);
        if (value === EventEmitter) names.push('EventEmitter', 'once');
        return names.filter(function (n, i) { return names.indexOf(n) === i; });
      },
      install: function (watched, pushLog, onError) {
        timers = watched;
        push = pushLog;
        report = onError;
        g.process = proc;
        g.global = g;
        ['setTimeout', 'setInterval'].forEach(function (name) {
          const watchedTimer = g[name];
          g[name] = function (fn, ms) {
            const args = [].slice.call(arguments, 2);
            if (typeof fn !== 'function') return watchedTimer(fn, ms);
            return watchedTimer(function () {
              try { fn.apply(null, args); } finally { drainTicks(); }
            }, ms);
          };
        });
        g.setImmediate = function (fn) {
          const args = [].slice.call(arguments, 1);
          return g.setTimeout(function () { fn.apply(null, args); }, 0);
        };
        g.clearImmediate = function (id) { g.clearTimeout(id); };
      },
      wrapFetch: function (practice) {
        return function fetch(input, init) {
          const url = String(input && input.url ? input.url : input);
          const m = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::(\d+))?(\/[^#]*)?$/.exec(url);
          if (!m) return practice(input, init);
          const options = init || {};
          return web.dispatch({ port: m[1] ? Number(m[1]) : 80, path: m[2] || '/', method: options.method, headers: options.headers, body: options.body }).then(response);
        };
      },
      flush: function () {
        ['log', 'error'].forEach(function (type) {
          if (pending[type]) { push(type, [pending[type]]); pending[type] = ''; }
        });
      },
      exitCode: function () { return proc.exitCode; },
      drainTicks: drainTicks,
      changes: disk.changes,
      testApi: {
        anfrage: function (method, url, body, headers) {
          const h = Object.assign({}, headers || {});
          let payload = body;
          if (body !== undefined && body !== null && typeof body !== 'string') {
            payload = JSON.stringify(body);
            if (!h['content-type']) h['content-type'] = 'application/json';
          }
          const m = /^https?:\/\/[^/:]+(?::(\d+))?(\/.*)?$/.exec(String(url));
          return web.dispatch({ port: m && m[1] ? Number(m[1]) : null, path: m ? m[2] || '/' : String(url), method: method, headers: h, body: payload }).then(function (answer) {
            return {
              status: answer.status,
              headers: answer.headers,
              text: answer.body,
              json: function () { return JSON.parse(answer.body); },
            };
          });
        },
        require: function (name) {
          if (!canonical(name)) throw new Error('node.require(…) kennt nur eingebaute Module: ' + BUILTINS.join(', '));
          return modules[canonical(name)];
        },
        datei: disk.read,
        fs: disk.fs,
        process: proc,
        serverLaeuft: web.running,
      },
    };
  };
})(typeof self !== 'undefined' ? self : globalThis);
