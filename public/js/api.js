async function json(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'Serverfehler ' + res.status;
    try { msg = (await res.json()).error || msg; } catch (e) { }
    throw new Error(msg);
  }
  return res.json();
}

const put = (url, body, keepalive) => json(url, {
  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: !!keepalive,
});
const post = (url, body) => json(url, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
});

export const api = {
  config: () => json('/api/config'),
  lessons: () => json('/api/lessons'),
  lesson: (id) => json('/api/lessons/' + encodeURIComponent(id)),
  progress: () => json('/api/progress'),
  saveLesson: (id, patch, keepalive) => put('/api/progress/lessons/' + encodeURIComponent(id), patch, keepalive),
  resetLesson: (id) => post('/api/progress/lessons/' + encodeURIComponent(id) + '/reset'),
  saveUi: (ui) => put('/api/progress/ui', ui),
  event: (lessonId, type, detail) => post('/api/progress/event', { lessonId, type, detail }).catch(() => {}),
};
