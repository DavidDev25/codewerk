/* Setzt Farbschema und Textgröße sofort beim Laden – aus dem lokalen Browser-Speicher.
   (Nur Anzeige-Einstellungen; Fortschritt und Code liegen auf dem Server.) */
(function () {
  var root = document.documentElement;
  var pref = 'auto', size = 'm';
  try {
    pref = localStorage.getItem('cw-theme') || 'auto';
    size = localStorage.getItem('cw-size') || 'm';
  } catch (e) { /* Speicher gesperrt: Standardwerte */ }
  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.pref = pref;
  root.dataset.theme = pref === 'auto' ? (dark ? 'dark' : 'light') : pref;
  root.dataset.size = size;
})();
