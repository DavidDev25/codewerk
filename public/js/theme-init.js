(function () {
  var root = document.documentElement;
  var pref = 'auto', size = 'm';
  try {
    pref = localStorage.getItem('cw-theme') || 'auto';
    size = localStorage.getItem('cw-size') || 'm';
  } catch (e) { }
  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.pref = pref;
  root.dataset.theme = pref === 'auto' ? (dark ? 'dark' : 'light') : pref;
  root.dataset.size = size;
})();
