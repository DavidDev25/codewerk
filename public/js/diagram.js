import { escapeHtml } from './markdown.js';

const KIND_LABEL = {
  class: 'Klasse', instance: 'Objekt', object: 'Objekt', array: 'Array', map: 'Map', set: 'Set', other: 'Wert',
};

function computeDepths(snap) {
  const depth = {};
  const neighbors = (node) => {
    const out = [];
    node.rows.forEach((r) => { if (r.value.t === 'ref') out.push(r.value.id); });
    if (node.classId) out.push(node.classId);
    if (node.parentId) out.push(node.parentId);
    if (node.protoId) out.push(node.protoId);
    return out;
  };

  let frontier = [];
  snap.variables.forEach((v) => {
    if (v.value.t === 'ref' && depth[v.value.id] === undefined) { depth[v.value.id] = 1; frontier.push(v.value.id); }
  });
  while (frontier.length) {
    const next = [];
    frontier.forEach((id) => {
      neighbors(snap.nodes[id]).forEach((nid) => {
        if (depth[nid] === undefined && snap.nodes[nid]) { depth[nid] = depth[id] + 1; next.push(nid); }
      });
    });
    frontier = next;
  }
  snap.order.forEach((id) => { if (depth[id] === undefined) depth[id] = 1; });

  for (let pass = 0; pass < 20; pass++) {
    let changed = false;
    snap.order.forEach((id) => {
      const n = snap.nodes[id];
      [n.classId, n.parentId].forEach((target) => {
        if (target && depth[target] <= depth[id]) { depth[target] = depth[id] + 1; changed = true; }
      });
    });
    if (!changed) break;
  }
  return depth;
}

function valueHtml(value) {
  if (value.t === 'prim') return `<span class="dg-val dg-${escapeHtml(value.type)}">${escapeHtml(value.text)}</span>`;
  if (value.t === 'fn') return `<span class="dg-val dg-fn">${escapeHtml(value.text)}</span>`;
  return '';
}

function portHtml(value, type) {
  return `<span class="dg-port" data-to="${escapeHtml(value.id)}" data-type="${type}" aria-hidden="true"></span>`;
}

function nodeHtml(node, snap) {
  const rows = [];
  node.rows.forEach((r) => {
    const isRef = r.value.t === 'ref';
    rows.push(
      `<div class="dg-row"><span class="dg-key">${escapeHtml(r.key)}</span>` +
      (isRef ? `<span class="dg-val dg-arrowlabel">→</span>${portHtml(r.value, 'ref')}` : valueHtml(r.value)) + '</div>'
    );
  });
  if (node.more) rows.push(`<div class="dg-row dg-more">… und ${node.more} weitere</div>`);
  if (!node.rows.length && node.kind !== 'class' && !node.privates.length) rows.push('<div class="dg-row dg-more">leer</div>');
  node.privates.forEach((name) => {
    rows.push(`<div class="dg-row dg-private"><span class="dg-key"><span aria-hidden="true">🔒</span> ${escapeHtml(name)}</span><span class="dg-val dg-hidden">privat</span></div>`);
  });

  const extras = [];
  if (node.kind === 'class') {
    if (node.methods.length) extras.push(`<div class="dg-list"><span class="dg-list-title">Methoden</span>${node.methods.map((m) => `<span class="dg-chip">${escapeHtml(m)}</span>`).join('')}</div>`);
    if (node.getters.length) extras.push(`<div class="dg-list"><span class="dg-list-title">Getter/Setter</span>${node.getters.map((m) => `<span class="dg-chip">${escapeHtml(m)}</span>`).join('')}</div>`);
    if (node.statics.length) extras.push(`<div class="dg-list"><span class="dg-list-title">Statisch</span>${node.statics.map((m) => `<span class="dg-chip">${escapeHtml(m)}</span>`).join('')}</div>`);
    if (!node.methods.length && !node.getters.length && !node.statics.length && !node.privates.length) {
      extras.push('<div class="dg-row dg-more">noch keine Methoden</div>');
    }
  }

  const links = [];
  if (node.classId && snap.nodes[node.classId]) {
    links.push(`<div class="dg-row dg-link"><span class="dg-key">ist ein</span><span class="dg-val dg-ref">${escapeHtml(snap.nodes[node.classId].title)}</span>${portHtml({ id: node.classId }, 'isa')}</div>`);
  }
  if (node.parentId && snap.nodes[node.parentId]) {
    links.push(`<div class="dg-row dg-link"><span class="dg-key">erbt von</span><span class="dg-val dg-ref">${escapeHtml(snap.nodes[node.parentId].title)}</span>${portHtml({ id: node.parentId }, 'inherit')}</div>`);
  } else if (node.parentName) {
    links.push(`<div class="dg-row dg-link"><span class="dg-key">erbt von</span><span class="dg-val dg-ref">${escapeHtml(node.parentName)}</span></div>`);
  }
  if (node.protoId && snap.nodes[node.protoId]) {
    links.push(`<div class="dg-row dg-link"><span class="dg-key">Prototyp</span><span class="dg-val dg-arrowlabel">→</span>${portHtml({ id: node.protoId }, 'isa')}</div>`);
  }

  const label = KIND_LABEL[node.kind] || 'Objekt';
  return `<div class="dg-node dg-${node.kind}" data-id="${escapeHtml(node.id)}" tabindex="0" aria-label="${escapeHtml(label + ' ' + node.title)}">` +
    `<div class="dg-head"><span class="dg-badge">${label}</span>${node.title === label ? '' : `<span class="dg-title">${escapeHtml(node.title)}</span>`}</div>` +
    links.join('') + rows.join('') + extras.join('') + '</div>';
}

function variableHtml(v) {
  const isRef = v.value.t === 'ref';
  if (v.value.t === 'fn') v = { ...v, value: { ...v.value, text: v.value.text.replace(/^ƒ [^(]*/, 'ƒ ') } };
  const kind = v.kind === 'function' ? 'function' : v.kind;
  return `<div class="dg-var"><span class="dg-kindchip">${escapeHtml(kind)}</span><span class="dg-name">${escapeHtml(v.name)}</span>` +
    (isRef ? portHtml(v.value, 'ref') : valueHtml(v.value)) + '</div>';
}

export function createDiagram(container) {
  let hasContent = false;

  function emptyState(text) {
    hasContent = false;
    container.innerHTML = `<div class="empty"><p>${escapeHtml(text)}</p></div>`;
  }

  function render(snapshot, reason) {
    if (!snapshot) { emptyState(reason || 'Noch nichts zu sehen. Drücke „Ausführen“, dann erscheint hier dein Code als Bild.'); return; }
    if (!snapshot.variables.length && !snapshot.order.length) {
      emptyState('Noch keine Variablen. Schreibe zum Beispiel const zahl = 5; und drücke „Ausführen“.');
      return;
    }
    const depth = computeDepths(snapshot);
    const maxDepth = Math.max(0, ...snapshot.order.map((id) => depth[id]));
    const cols = [];
    for (let d = 0; d <= maxDepth; d++) cols.push([]);
    snapshot.order.forEach((id) => cols[depth[id]].push(snapshot.nodes[id]));

    const colHtml = [];
    colHtml.push(`<div class="dg-col dg-col-vars"><div class="dg-coltitle">Variablen</div>${snapshot.variables.map(variableHtml).join('')}</div>`);
    for (let d = 1; d <= maxDepth; d++) {
      if (!cols[d].length) continue;
      colHtml.push(`<div class="dg-col">${cols[d].map((n) => nodeHtml(n, snapshot)).join('')}</div>`);
    }

    container.innerHTML =
      '<div class="dg-scroll"><div class="dg-canvas">' +
      '<svg class="dg-arrows" aria-hidden="true"><defs>' +
      '<marker id="dg-head-ref" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-marker dg-marker-ref"/></marker>' +
      '<marker id="dg-head-isa" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-marker dg-marker-isa"/></marker>' +
      '<marker id="dg-head-inherit" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-marker dg-marker-inherit"/></marker>' +
      '</defs><g class="dg-paths"></g></svg>' +
      `<div class="dg-cols">${colHtml.join('')}</div></div></div>` +
      '<p class="dg-legend small muted">Pfeil = Verweis auf ein Objekt · gestrichelt = „ist ein“ · dick = „erbt von“ · 🔒 = privat, von außen unsichtbar' +
      (snapshot.truncated ? ' · Es gibt mehr Objekte, als hier gezeigt werden.' : '') + '</p>';
    hasContent = true;
    wireHover();
    requestAnimationFrame(refresh);
  }

  function refresh() {
    if (!hasContent) return;
    const canvas = container.querySelector('.dg-canvas');
    const svg = container.querySelector('.dg-arrows');
    if (!canvas || !svg || canvas.offsetParent === null) return;
    const cr = canvas.getBoundingClientRect();
    svg.setAttribute('width', canvas.scrollWidth);
    svg.setAttribute('height', canvas.scrollHeight);
    const g = svg.querySelector('.dg-paths');
    g.innerHTML = '';

    container.querySelectorAll('.dg-port').forEach((port) => {
      const target = container.querySelector(`.dg-node[data-id="${port.dataset.to}"]`);
      if (!target) return;
      const sourceNode = port.closest('.dg-node');
      const p = port.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      const x1 = p.left + p.width / 2 - cr.left;
      const y1 = p.top + p.height / 2 - cr.top;
      const ty = Math.min(t.top - cr.top + 22, t.top - cr.top + t.height / 2);
      let d;
      if (t.left - cr.left > x1 + 8) {
        const x2 = t.left - cr.left - 2;
        const dx = Math.max(40, (x2 - x1) / 2);
        d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${ty} ${x2},${ty}`;
      } else {
        const x2 = t.right - cr.left + 2;
        const out = Math.max(x1, x2) + 46;
        d = `M${x1},${y1} C${out},${y1} ${out},${ty} ${x2},${ty}`;
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'dg-path dg-path-' + port.dataset.type);
      path.setAttribute('marker-end', `url(#dg-head-${port.dataset.type})`);
      path.dataset.from = sourceNode ? sourceNode.dataset.id : 'var';
      path.dataset.to = port.dataset.to;
      g.appendChild(path);
    });
  }

  function wireHover() {
    const canvas = container.querySelector('.dg-canvas');
    const mark = (id) => {
      canvas.classList.toggle('is-hovering', !!id);
      container.querySelectorAll('.dg-path').forEach((p) => {
        p.classList.toggle('is-active', !!id && (p.dataset.from === id || p.dataset.to === id));
      });
    };
    container.querySelectorAll('.dg-node').forEach((node) => {
      node.addEventListener('mouseenter', () => mark(node.dataset.id));
      node.addEventListener('mouseleave', () => mark(null));
      node.addEventListener('focus', () => mark(node.dataset.id));
      node.addEventListener('blur', () => mark(null));
    });
  }

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => refresh()).observe(container);

  emptyState('Noch nichts zu sehen. Drücke „Ausführen“, dann erscheint hier dein Code als Bild.');
  return { render, refresh };
}
