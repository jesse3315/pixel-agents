import * as path from 'path';
import { describe, expect, it } from 'vitest';

import { resolveWindowsCommand } from '../src/terminal/resolveCommand.js';

// Windows path semantics regardless of the host running the suite.
const win = path.win32;
const BIN = 'C:\\Users\\me\\.local\\bin';
const NPM = 'C:\\Users\\me\\AppData\\Roaming\\npm';

function existsIn(files: string[]) {
  const set = new Set(files.map((f) => f.toLowerCase()));
  return (p: string) => set.has(p.toLowerCase());
}

describe('resolveWindowsCommand', () => {
  const env = { PATH: `${BIN};${NPM}`, PATHEXT: '.COM;.EXE;.BAT;.CMD' };

  it('resolves a bare command to the first PATH entry with a PATHEXT match', () => {
    const exists = existsIn([win.join(BIN, 'claude.EXE'), win.join(NPM, 'claude.CMD')]);
    expect(resolveWindowsCommand('claude', env, exists)).toBe(win.join(BIN, 'claude.EXE'));
  });

  it('falls through PATH entries in order', () => {
    const exists = existsIn([win.join(NPM, 'claude.CMD')]);
    expect(resolveWindowsCommand('claude', env, exists)).toBe(win.join(NPM, 'claude.CMD'));
  });

  it('reads PATH case-insensitively (Windows often spells it Path)', () => {
    const exists = existsIn([win.join(BIN, 'claude.EXE')]);
    expect(resolveWindowsCommand('claude', { Path: BIN }, exists)).toBe(
      win.join(BIN, 'claude.EXE'),
    );
  });

  it('leaves commands with an extension or a path untouched', () => {
    const exists = existsIn([]);
    expect(resolveWindowsCommand('claude.exe', env, exists)).toBe('claude.exe');
    expect(resolveWindowsCommand('C:\\tools\\claude', env, exists)).toBe('C:\\tools\\claude');
  });

  it('returns the command unchanged when nothing matches', () => {
    expect(resolveWindowsCommand('claude', env, existsIn([]))).toBe('claude');
  });
});
