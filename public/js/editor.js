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
      { token: 'comment', foreground: '6B7F7E', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7A3E9D' },
      { token: 'string', foreground: '2B7A4F' },
      { token: 'number', foreground: '1F5FA3' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#1B2B2A',
      'editorLineNumber.foreground': '#617775',
      'editorLineNumber.activeForeground': '#226B74',
      'editor.lineHighlightBackground': '#F2F7F6',
      'editorCursor.foreground': '#226B74',
      'editor.selectionBackground': '#CDE6E9',
    },
  });
  monaco.editor.defineTheme('cw-dark', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: '86A09E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C9A2E8' },
      { token: 'string', foreground: '8FD6AC' },
      { token: 'number', foreground: '8CBCF0' },
    ],
    colors: {
      'editor.background': '#1A2425',
      'editor.foreground': '#E4EEEC',
      'editorLineNumber.foreground': '#86A09E',
      'editorLineNumber.activeForeground': '#6FC1C9',
      'editor.lineHighlightBackground': '#213031',
      'editorCursor.foreground': '#6FC1C9',
      'editor.selectionBackground': '#2F5558',
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
