/**
 * Chat input for PTY-backed agents: the webview's chat box types a message into
 * the agent's Claude Code TUI and presses Enter, exactly as a user at the
 * embedded terminal would. Gating (privileged connection, agent has a PTY)
 * lives in clientMessageHandler beside launch/close; this module only shapes
 * and writes the input.
 */

import { AGENT_INPUT_MAX_CHARS, AGENT_INPUT_SUBMIT_DELAY_MS } from '../constants.js';
import type { PtySession } from './ptySessionManager.js';

/**
 * One line of chat text ready to type, or null when the input is unusable.
 *
 * Newlines become spaces (a "\r" mid-message would submit half of it), other
 * control characters are dropped (an ESC would be read as a key, not text), and
 * an empty or over-long message is refused rather than trimmed to fit.
 */
export function toAgentInputLine(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let line = '';
  for (const ch of raw.replace(/\r\n|\r|\n/g, ' ')) {
    const code = ch.charCodeAt(0);
    if (code >= 0x20 && code !== 0x7f) line += ch;
  }
  line = line.trim();
  if (!line || line.length > AGENT_INPUT_MAX_CHARS) return null;
  return line;
}

/** Type the line, then press Enter in a separate write (see AGENT_INPUT_SUBMIT_DELAY_MS). */
export function submitAgentInput(session: PtySession, line: string): void {
  session.write(line);
  // write() is a no-op once the process exited, so a PTY dying in the gap is harmless.
  setTimeout(() => session.write('\r'), AGENT_INPUT_SUBMIT_DELAY_MS);
}
