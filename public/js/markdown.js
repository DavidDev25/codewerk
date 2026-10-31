export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function inline(text) {
  return String(text).split(/(`[^`\n]+`)/).map((part) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return '<code>' + escapeHtml(part.slice(1, -1)) + '</code>';
    }
    return escapeHtml(part).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  }).join('');
}

const CALLOUT_TITLES = { alltag: 'Alltagsbeispiel', tipp: 'Tipp', achtung: 'Achtung' };

export function renderMarkdown(src, opts) {
  const runnable = !!(opts && opts.runnable);
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const isBlockStart = (l) => /^```/.test(l) || /^:::/.test(l) || /^#{1,4}\s/.test(l) ||
    /^\s*[-*]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l) || /^\s*\|/.test(l);
  const cells = (l) => {
    const parts = [];
    let cur = '';
    let inCode = false;
    for (const ch of l.trim().replace(/^\||\|$/g, '')) {
      if (ch === '`') inCode = !inCode;
      if (ch === '|' && !inCode) { parts.push(cur.trim()); cur = ''; } else cur += ch;
    }
    parts.push(cur.trim());
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    let m = line.match(/^```(\w*)/);
    if (m) {
      const lang = m[1];
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      const text = code.join('\n');
      if (runnable && (lang === 'js' || lang === 'javascript')) {
        out.push('<div class="codeblock"><pre tabindex="0"><code>' + escapeHtml(text) + '</code></pre>' +
          '<div class="codeblock-bar"><button type="button" class="btn small try" data-code="' + escapeHtml(text) + '">Ausprobieren</button></div>' +
          '<div class="try-out" hidden></div></div>');
      } else {
        out.push('<pre tabindex="0"><code>' + escapeHtml(text) + '</code></pre>');
      }
      continue;
    }

    m = line.match(/^:::(\w+)\s*$/);
    if (m) {
      const inner = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) inner.push(lines[i++]);
      i++;
      const name = m[1].toLowerCase();
      out.push('<div class="callout callout-' + escapeHtml(name) + '" role="note"><div class="callout-title">' +
        escapeHtml(CALLOUT_TITLES[name] || name) + '</div>' + renderMarkdown(inner.join('\n'), opts) + '</div>');
      continue;
    }

    m = line.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      const level = Math.min(4, m[1].length + 1);
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(inline(lines[i++].replace(/^\s*[-*]\s+/, '')));
      out.push('<ul>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>');
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(inline(lines[i++].replace(/^\s*\d+[.)]\s+/, '')));
      out.push('<ol>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ol>');
      continue;
    }

    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push('<div class="table-wrap"><table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') +
        '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    const para = [];
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) para.push(lines[i++]);
    if (para.length === 0) { para.push(lines[i++]); }
    out.push('<p>' + inline(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}
