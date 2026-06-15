import { useRef, useEffect, useState, useCallback } from 'react';
import { getLanguageExtension, normalizeLanguage } from '../utils/programmingLanguages';

const JAVA_SNIPPETS = [
  { trigger: 'syso', label: 'syso - System.out.println', insert: 'System.out.println();', cursorOffset: 21 },
  { trigger: 'sout', label: 'sout - System.out.println', insert: 'System.out.println();', cursorOffset: 21 },
  { trigger: 'psvm', label: 'psvm - main method', insert: 'public static void main(String[] args) {\n    \n}', cursorOffset: 44 },
  { trigger: 'main', label: 'main - main method', insert: 'public static void main(String[] args) {\n    \n}', cursorOffset: 44 },
  { trigger: 'for', label: 'for - indexed for loop', insert: 'for (int i = 0; i < length; i++) {\n    \n}', cursorOffset: 10 },
  { trigger: 'foreach', label: 'foreach - enhanced for', insert: 'for (Type item : collection) {\n    \n}', cursorOffset: 5 },
  { trigger: 'if', label: 'if - if statement', insert: 'if (condition) {\n    \n}', cursorOffset: 4 },
  { trigger: 'ife', label: 'ife - if else', insert: 'if (condition) {\n    \n} else {\n    \n}', cursorOffset: 4 },
  { trigger: 'while', label: 'while - while loop', insert: 'while (condition) {\n    \n}', cursorOffset: 7 },
  { trigger: 'do', label: 'do - do while', insert: 'do {\n    \n} while (condition);', cursorOffset: 4 },
  { trigger: 'try', label: 'try - try catch', insert: 'try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}', cursorOffset: 6 },
  { trigger: 'return', label: 'return', insert: 'return ;', cursorOffset: 7 },
  { trigger: 'class', label: 'class', insert: 'public class ClassName {\n    \n}', cursorOffset: 14 },
  { trigger: 'String', label: 'String', insert: 'String', cursorOffset: 6 },
  { trigger: 'int', label: 'int', insert: 'int ', cursorOffset: 4 },
  { trigger: 'boolean', label: 'boolean', insert: 'boolean ', cursorOffset: 8 },
  { trigger: 'public', label: 'public', insert: 'public ', cursorOffset: 7 },
  { trigger: 'private', label: 'private', insert: 'private ', cursorOffset: 8 },
  { trigger: 'static', label: 'static', insert: 'static ', cursorOffset: 7 },
  { trigger: 'void', label: 'void', insert: 'void ', cursorOffset: 5 },
  { trigger: 'new', label: 'new', insert: 'new ', cursorOffset: 4 },
  { trigger: 'null', label: 'null', insert: 'null', cursorOffset: 4 },
  { trigger: 'true', label: 'true', insert: 'true', cursorOffset: 4 },
  { trigger: 'false', label: 'false', insert: 'false', cursorOffset: 5 },
  { trigger: 'import', label: 'import', insert: 'import ', cursorOffset: 7 },
  { trigger: 'scanner', label: 'Scanner', insert: 'Scanner scanner = new Scanner(System.in);', cursorOffset: 8 },
];

const LANGUAGE_SNIPPETS = {
  Java: JAVA_SNIPPETS,
  Python: [
    { trigger: 'print', label: 'print', insert: 'print()', cursorOffset: 6 },
    { trigger: 'input', label: 'input', insert: 'input().strip()', cursorOffset: 15 },
    { trigger: 'for', label: 'for loop', insert: 'for item in items:\n    ', cursorOffset: 9 },
    { trigger: 'if', label: 'if statement', insert: 'if condition:\n    ', cursorOffset: 3 },
    { trigger: 'def', label: 'function', insert: 'def solve():\n    ', cursorOffset: 4 },
    { trigger: 'list', label: 'parse integers', insert: 'list(map(int, input().split()))', cursorOffset: 31 },
    { trigger: 'return', label: 'return', insert: 'return ', cursorOffset: 7 },
  ],
  C: [
    { trigger: 'printf', label: 'printf', insert: 'printf("\\n");', cursorOffset: 8 },
    { trigger: 'scanf', label: 'scanf', insert: 'scanf("%d", &value);', cursorOffset: 12 },
    { trigger: 'main', label: 'main function', insert: 'int main(void) {\n    \n    return 0;\n}', cursorOffset: 22 },
    { trigger: 'for', label: 'for loop', insert: 'for (int i = 0; i < n; i++) {\n    \n}', cursorOffset: 14 },
    { trigger: 'if', label: 'if statement', insert: 'if (condition) {\n    \n}', cursorOffset: 4 },
    { trigger: 'include', label: 'stdio include', insert: '#include <stdio.h>', cursorOffset: 18 },
  ],
  'C++': [
    { trigger: 'cout', label: 'cout', insert: 'cout <<  << endl;', cursorOffset: 8 },
    { trigger: 'cin', label: 'cin', insert: 'cin >> value;', cursorOffset: 13 },
    { trigger: 'main', label: 'main function', insert: 'int main() {\n    \n    return 0;\n}', cursorOffset: 17 },
    { trigger: 'for', label: 'for loop', insert: 'for (int i = 0; i < n; i++) {\n    \n}', cursorOffset: 14 },
    { trigger: 'if', label: 'if statement', insert: 'if (condition) {\n    \n}', cursorOffset: 4 },
    { trigger: 'vector', label: 'vector', insert: 'vector<int> values;', cursorOffset: 18 },
  ],
  JavaScript: [
    { trigger: 'log', label: 'console.log', insert: 'console.log();', cursorOffset: 12 },
    { trigger: 'input', label: 'read stdin', insert: "const input = require('fs').readFileSync(0, 'utf8').trim();", cursorOffset: 64 },
    { trigger: 'nums', label: 'parse numbers', insert: "const numbers = input.split(/\\s+/).map(Number);", cursorOffset: 45 },
    { trigger: 'for', label: 'for loop', insert: 'for (let i = 0; i < n; i++) {\n  \n}', cursorOffset: 13 },
    { trigger: 'if', label: 'if statement', insert: 'if (condition) {\n  \n}', cursorOffset: 4 },
    { trigger: 'return', label: 'return', insert: 'return ', cursorOffset: 7 },
  ],
  'C#': [
    { trigger: 'cw', label: 'Console.WriteLine', insert: 'Console.WriteLine();', cursorOffset: 18 },
    { trigger: 'read', label: 'Console.ReadLine', insert: 'Console.ReadLine()', cursorOffset: 18 },
    { trigger: 'main', label: 'Main method', insert: 'static void Main() {\n    \n}', cursorOffset: 23 },
    { trigger: 'for', label: 'for loop', insert: 'for (int i = 0; i < n; i++) {\n    \n}', cursorOffset: 14 },
    { trigger: 'if', label: 'if statement', insert: 'if (condition) {\n    \n}', cursorOffset: 4 },
  ],
};

function getWordBounds(text, pos) {
  const before = text.slice(0, pos);
  const after = text.slice(pos);
  const startMatch = before.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
  const endMatch = after.match(/^[a-zA-Z0-9_]*/);
  const start = startMatch ? pos - startMatch[0].length : pos;
  const end = pos + (endMatch ? endMatch[0].length : 0);
  return { word: text.slice(start, end), start, end };
}

function filterSnippets(query, language) {
  const q = (query || '').toLowerCase();
  const snippets = LANGUAGE_SNIPPETS[normalizeLanguage(language)] || JAVA_SNIPPETS;
  if (!q) return snippets.slice(0, 12);
  return snippets.filter(
    (s) => s.trigger.toLowerCase().startsWith(q) || s.label.toLowerCase().includes(q)
  ).slice(0, 12);
}

export default function CodeEditor({ value, onChange, language = 'Java', readOnly = false }) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const editorWrapRef = useRef(null);
  const [assistOpen, setAssistOpen] = useState(false);
  const [assistItems, setAssistItems] = useState([]);
  const [assistIndex, setAssistIndex] = useState(0);
  const [wordRange, setWordRange] = useState({ start: 0, end: 0 });
  const [assistPos, setAssistPos] = useState({ top: 0, left: 0 });

  const lines = (value || '').split('\n');
  const lineCount = Math.max(lines.length, 20);

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const applySnippet = useCallback((snippet) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { start, end } = wordRange;
    const newValue = value.substring(0, start) + snippet.insert + value.substring(end);
    onChange(newValue);
    setAssistOpen(false);
    requestAnimationFrame(() => {
      const cursor = start + snippet.cursorOffset;
      ta.focus();
      ta.selectionStart = ta.selectionEnd = cursor;
    });
  }, [value, onChange, wordRange]);

  const openContentAssist = useCallback((forceQuery) => {
    const ta = textareaRef.current;
    if (!ta || readOnly) return;
    const pos = ta.selectionStart;
    const bounds = getWordBounds(value, pos);
    const query = forceQuery !== undefined ? forceQuery : bounds.word;
    const items = filterSnippets(query, language);
    if (items.length === 0) return;

    const textBefore = value.substring(0, pos);
    const lineIndex = textBefore.split('\n').length - 1;
    const colIndex = textBefore.length - textBefore.lastIndexOf('\n') - 1;

    setWordRange(bounds);
    setAssistItems(items);
    setAssistIndex(0);
    setAssistPos({ top: (lineIndex + 1) * 24 + 8, left: Math.min(colIndex * 8 + 48, 280) });
    setAssistOpen(true);
  }, [value, readOnly, language]);

  const handleKeyDown = (e) => {
    if (assistOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAssistIndex((i) => (i + 1) % assistItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAssistIndex((i) => (i - 1 + assistItems.length) % assistItems.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applySnippet(assistItems[assistIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setAssistOpen(false);
        return;
      }
    }

    if (e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      openContentAssist();
      return;
    }

    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = `${value.substring(0, start)}    ${value.substring(end)}`;
      onChange(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
      return;
    }

    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', start);
      const end = lineEnd === -1 ? value.length : lineEnd;
      const line = value.substring(lineStart, end);
      const isPython = normalizeLanguage(language) === 'Python';
      const commentPattern = isPython ? /^\s*#\s?/ : /^\s*\/\/\s?/;
      const commentPrefix = isPython ? '# ' : '// ';
      const commented = commentPattern.test(line.trimStart())
        ? line.replace(commentPattern, '')
        : `${commentPrefix}${line}`;
      onChange(value.substring(0, lineStart) + commented + value.substring(end));
    }
  };

  useEffect(() => {
    syncScroll();
  }, [value]);

  useEffect(() => {
    const close = (e) => {
      if (assistOpen && editorWrapRef.current && !editorWrapRef.current.contains(e.target)) {
        setAssistOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [assistOpen]);

  return (
    <div className="eclipse-editor overflow-hidden rounded-lg border border-[#3c3c3c] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#3c3c3c] bg-[#2d2d30] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-[#cccccc]">
            Solution.{getLanguageExtension(language)} - Content Assist
          </span>
        </div>
        <span className="text-[10px] text-[#858585]">Ctrl+Space</span>
      </div>
      <div ref={editorWrapRef} className="relative flex h-[420px] bg-[#1e1e1e]">
        <div
          ref={gutterRef}
          className="select-none overflow-hidden border-r border-[#3c3c3c] bg-[#252526] py-3 text-right font-mono text-xs leading-6 text-[#858585]"
          style={{ minWidth: '3rem', paddingLeft: 8, paddingRight: 12 }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            className="h-full w-full resize-none bg-[#1e1e1e] py-3 pl-2 font-mono text-sm leading-6 text-[#d4d4d4] outline-none caret-white selection:bg-[#264f78]"
            style={{ tabSize: 4 }}
          />
          {assistOpen && (
            <div
              className="absolute z-50 max-h-56 w-72 overflow-auto rounded border border-[#454545] bg-[#252526] shadow-xl"
              style={{ top: assistPos.top, left: assistPos.left }}
            >
              <div className="border-b border-[#454545] px-2 py-1 text-[10px] text-[#858585]">
                Content Assist - type a keyword, then Ctrl+Space
              </div>
              {assistItems.map((item, i) => (
                <button
                  key={item.trigger}
                  type="button"
                  className={`block w-full px-3 py-1.5 text-left text-xs ${
                    i === assistIndex ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                  onMouseEnter={() => setAssistIndex(i)}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    applySnippet(item);
                  }}
                >
                  <span className="font-semibold text-[#9cdcfe]">{item.trigger}</span>
                  <span className="ml-2 text-[#858585]">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#3c3c3c] bg-[#007acc] px-3 py-1 text-[10px] text-white">
        <span>Writable | Smart Insert | {lineCount} lines</span>
        <span>Ctrl+Space Content Assist | Tab indent | Ctrl+/ comment line</span>
      </div>
    </div>
  );
}
