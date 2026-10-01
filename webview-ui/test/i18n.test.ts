/**
 * Unit tests for the webview i18n module (src/i18n): dictionary key parity,
 * `{name}` interpolation, the language store, and display-time translation of
 * the English agent statuses the server sends (formatToolStatus).
 *
 * Run with: npm test
 */

import assert from 'node:assert/strict';

import { beforeEach, test } from 'vitest';

import { en } from '../src/i18n/en.js';
import { getLanguage, setLanguage, subscribe, t, translateStatus } from '../src/i18n/index.js';
import { ko } from '../src/i18n/ko.js';

// Captured before any test switches language. Node 21+ exposes a global
// `navigator` whose language follows the OS locale, so the expected initial
// language depends on the machine running the suite.
const initialLanguage = getLanguage();

beforeEach(() => setLanguage('en'));

test('en and ko have identical keys and no empty strings', () => {
  assert.deepEqual(Object.keys(ko).sort(), Object.keys(en).sort());
  for (const [key, value] of Object.entries(ko)) assert.ok(value.length > 0, key);
});

test('initial language follows navigator.language (Korean -> ko, otherwise en)', () => {
  const nav = (globalThis as { navigator?: { language?: string } }).navigator;
  const expected = nav?.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  assert.equal(initialLanguage, expected);
  assert.equal(t('settings.title'), 'Settings');
});

test('t interpolates {name} placeholders and leaves unknown ones intact', () => {
  assert.equal(t('debug.agent', { id: 3 }), 'Agent #3');
  assert.equal(t('debug.agent'), 'Agent #{id}');
  // Values are inserted verbatim: no re-scan, no `$` replacement patterns.
  assert.equal(t('debug.agent', { id: '{id} $&' }), 'Agent #{id} $&');
  setLanguage('ko');
  assert.equal(
    t('agent.contextUsage', { pct: 50, used: 100, max: 200 }),
    '컨텍스트 50% 사용 (200k 중 100k 토큰)',
  );
});

test('setLanguage switches language and notifies subscribers once per change', () => {
  let calls = 0;
  const unsubscribe = subscribe(() => calls++);
  setLanguage('ko');
  assert.equal(getLanguage(), 'ko');
  assert.equal(t('settings.title'), '설정');
  setLanguage('ko'); // no-op: same language
  assert.equal(calls, 1);
  setLanguage('en');
  assert.equal(calls, 2);
  unsubscribe();
  setLanguage('ko');
  assert.equal(calls, 2);
});

const SERVER_STATUSES: Array<[string, string]> = [
  ['Reading App.tsx', 'App.tsx 읽는 중'],
  ['Editing src/my file.ts', 'src/my file.ts 편집 중'],
  ['Writing notes.md', 'notes.md 작성 중'],
  ['Running: npm test -- --run "$HOME"', '실행 중: npm test -- --run "$HOME"'],
  ['Running: echo a\necho b', '실행 중: echo a\necho b'],
  ['Searching files', '파일 검색 중'],
  ['Searching code', '코드 검색 중'],
  ['Fetching web content', '웹 콘텐츠 가져오는 중'],
  ['Searching the web', '웹 검색 중'],
  ['Running subtask', '하위 작업 실행 중'],
  ['Subtask: Explore the {repo}', '하위 작업: Explore the {repo}'],
  ['Waiting for your answer', '답변 기다리는 중'],
  ['Planning', '계획 세우는 중'],
  ['Editing notebook', '노트북 편집 중'],
  ['Creating team: alpha', '팀 만드는 중: alpha'],
  ['Creating team', '팀 만드는 중'],
  ['Sending message', '메시지 보내는 중'],
  ['Using mcp__server__tool', 'mcp__server__tool 사용 중'],
];

test('translateStatus translates every known server pattern in Korean', () => {
  setLanguage('ko');
  for (const [status, expected] of SERVER_STATUSES) {
    assert.equal(translateStatus(status), expected, status);
  }
});

test('translateStatus passes statuses through unchanged in English', () => {
  for (const [status] of SERVER_STATUSES) assert.equal(translateStatus(status), status);
});

test('translateStatus passes unknown strings through unchanged', () => {
  setLanguage('ko');
  for (const status of ['-> teammate', 'Something new', '', 'reading lowercase.ts']) {
    assert.equal(translateStatus(status), status);
  }
});
