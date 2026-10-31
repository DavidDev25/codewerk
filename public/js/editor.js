export function loadMonaco() {
  return new Promise((resolve, reject) => {
    window.MonacoEnvironment = { getWorkerUrl: () => '/monaco-worker.js' };
    const script = document.createElement('script');
    script.src = '/vendor/monaco/vs/loader.js';
    script.onerror = () => reject(new Error('Monaco konnte nicht geladen werden.'));
    script.onload = () => {
      window.require.config({
        paths: { vs: '/vendor/monaco/vs' },
        'vs/nls': { availableLanguages: { '*': 'de' } },
      });
      window.require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    };
    document.head.appendChild(script);
  });
}

export function createEditor(monaco, element, { fontSize }) {
  monaco.editor.defineTheme('cw-light', {
    base: 'vs', inherit: true,
    rules: [
      { token: 'comment', foreground: '566A6D', fontStyle: 'italic' },
      { token: 'keyword', foreground: '23727C', fontStyle: 'bold' },
      { token: 'string', foreground: '23683F' },
      { token: 'number', foreground: '7A5A12' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#141C1E',
      'editorLineNumber.foreground': '#566A6D',
      'editorLineNumber.activeForeground': '#1B5E67',
      'editor.lineHighlightBackground': '#F5F8F8',
      'editorCursor.foreground': '#1B5E67',
      'editor.selectionBackground': '#B3DDE1',
    },
  });
  monaco.editor.defineTheme('cw-dark', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: '8DA0A2', fontStyle: 'italic' },
      { token: 'keyword', foreground: '78C3CA', fontStyle: 'bold' },
      { token: 'string', foreground: '7FD3A2' },
      { token: 'number', foreground: 'DDB04A' },
    ],
    colors: {
      'editor.background': '#141C1E',
      'editor.foreground': '#E9EFEF',
      'editorLineNumber.foreground': '#8DA0A2',
      'editorLineNumber.activeForeground': '#78C3CA',
      'editor.lineHighlightBackground': '#1A2527',
      'editorCursor.foreground': '#78C3CA',
      'editor.selectionBackground': '#134A52',
    },
  });

  const js = monaco.languages.typescript.javascriptDefaults;
  js.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    lib: ['esnext'],
    allowNonTsExtensions: true,
  });
  js.addExtraLib(
    'declare const console: { log(...a: any[]): void; info(...a: any[]): void; warn(...a: any[]): void; error(...a: any[]): void; table(a: any): void; };',
    'ts:codewerk-console.d.ts'
  );
  js.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: false, noSuggestionDiagnostics: true });

  const editor = monaco.editor.create(element, {
    language: 'javascript',
    theme: document.documentElement.dataset.theme === 'dark' ? 'cw-dark' : 'cw-light',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize,
    lineHeight: Math.round(fontSize * 1.65),
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    padding: { top: 14, bottom: 14 },
    renderLineHighlight: 'line',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    accessibilitySupport: 'auto',
    showUnused: false,
    showDeprecated: false,
    ariaLabel: 'Code-Editor. Mit Strg+Enter ausführen.',
  });
  return editor;
}
