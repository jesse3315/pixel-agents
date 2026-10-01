import { useSyncExternalStore } from 'react';

import { LANGUAGE_STORAGE_KEY } from '../constants.js';
import type { MessageKey, Messages } from './en.js';
import { en } from './en.js';
import { ko } from './ko.js';

export type { MessageKey } from './en.js';

export type Language = 'en' | 'ko';

/** Each language's name written in that language (for the selector). */
export const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', ko: '한국어' };

const dictionaries: Record<Language, Messages> = { en, ko };

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'ko';
}

// Storage/navigator may be missing (Node test runner) or throw (restricted webview storage).
function detectInitialLanguage(): Language {
  try {
    const stored =
      typeof localStorage !== 'undefined' ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
    if (isLanguage(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ko')) {
      return 'ko';
    }
  } catch {
    /* navigator unavailable */
  }
  return 'en';
}

function applyDocumentLang(lang: Language): void {
  // Accessed via globalThis: the Node-typed test project (tsconfig.node.json) has no DOM lib.
  const doc = (globalThis as { document?: { documentElement: { lang: string } } }).document;
  if (doc) doc.documentElement.lang = lang;
}

let currentLanguage: Language = detectInitialLanguage();
applyDocumentLang(currentLanguage);

const listeners = new Set<() => void>();

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language): void {
  if (lang === currentLanguage) return;
  currentLanguage = lang;
  applyDocumentLang(lang);
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: the choice lasts for this session only */
  }
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Translate a UI string in the current language, filling `{name}` placeholders from `params`. */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = dictionaries[currentLanguage][key];
  if (!params) return template;
  // Single pass with a replacer function: parameter values are inserted verbatim
  // (never re-scanned for placeholders, `$` patterns not interpreted).
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** React hook: re-renders the calling component when the language changes. */
export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getLanguage, getLanguage);
}

// Server-sent agent statuses are English (formatToolStatus) and toolUtils'
// extractToolName parses their prefixes, so the stored value stays English and
// only the displayed text is translated. Exact phrases come before prefix
// patterns ('Editing notebook' vs 'Editing <file>'). The captured part (file
// name, command, description, ...) is inserted verbatim.
const STATUS_PATTERNS: Array<[RegExp, MessageKey, string?]> = [
  [/^Searching files$/, 'status.searchingFiles'],
  [/^Searching code$/, 'status.searchingCode'],
  [/^Fetching web content$/, 'status.fetchingWeb'],
  [/^Searching the web$/, 'status.searchingWeb'],
  [/^Running subtask$/, 'status.runningSubtask'],
  [/^Waiting for your answer$/, 'status.waitingForAnswer'],
  [/^Planning$/, 'status.planning'],
  [/^Editing notebook$/, 'status.editingNotebook'],
  [/^Creating team$/, 'status.creatingTeam'],
  [/^Sending message$/, 'status.sendingMessage'],
  [/^Reading (.*)$/s, 'status.reading', 'file'],
  [/^Editing (.*)$/s, 'status.editing', 'file'],
  [/^Writing (.*)$/s, 'status.writing', 'file'],
  [/^Running: (.*)$/s, 'status.running', 'command'],
  [/^Subtask: (.*)$/s, 'status.subtask', 'description'],
  [/^Creating team: (.+)$/s, 'status.creatingTeamNamed', 'team'],
  [/^Using (.*)$/s, 'status.using', 'tool'],
];

/** Display-time translation of a server-sent agent status. Unknown strings pass through unchanged. */
export function translateStatus(status: string): string {
  if (currentLanguage === 'en') return status;
  for (const [pattern, key, param] of STATUS_PATTERNS) {
    const match = pattern.exec(status);
    if (match) return param ? t(key, { [param]: match[1] ?? '' }) : t(key);
  }
  return status;
}
