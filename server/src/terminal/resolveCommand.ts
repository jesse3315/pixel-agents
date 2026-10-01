/**
 * Windows command resolution for PTY spawns.
 *
 * node-pty's ConPTY backend does not search PATH with PATHEXT the way a shell
 * does: a bare `claude` fails with "File not found:" even though `claude.exe`
 * (or an npm `claude.cmd` shim) is on PATH. Resolve it to a full path first.
 */

import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_PATHEXT = '.COM;.EXE;.BAT;.CMD';

function envValue(env: Record<string, string | undefined>, name: string): string | undefined {
  const key = Object.keys(env).find((k) => k.toLowerCase() === name.toLowerCase());
  return key === undefined ? undefined : env[key];
}

function isFile(p: string): boolean {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/** Resolve a bare command (no extension, no directory) against PATH + PATHEXT.
 *  Anything else, or a command that matches nothing, is returned unchanged so
 *  the spawn reports its own error. */
export function resolveWindowsCommand(
  command: string,
  env: Record<string, string | undefined>,
  exists: (p: string) => boolean = isFile,
): string {
  const win = path.win32;
  if (win.extname(command) !== '' || win.basename(command) !== command) return command;

  const dirs = (envValue(env, 'PATH') ?? '').split(';').filter(Boolean);
  const exts = (envValue(env, 'PATHEXT') ?? DEFAULT_PATHEXT).split(';').filter(Boolean);
  for (const dir of dirs) {
    for (const ext of exts) {
      const candidate = win.join(dir, command + ext);
      if (exists(candidate)) return candidate;
    }
  }
  return command;
}
