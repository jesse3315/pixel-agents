import { describe, expect, it } from 'vitest';

import { AGENT_INPUT_MAX_CHARS } from '../src/constants.js';
import { toAgentInputLine } from '../src/terminal/agentInput.js';

describe('toAgentInputLine', () => {
  it('passes plain text through, trimmed', () => {
    expect(toAgentInputLine('  README 요약해줘 ')).toBe('README 요약해줘');
  });

  it('flattens every newline style to a space', () => {
    expect(toAgentInputLine('a\nb\r\nc\rd')).toBe('a b c d');
  });

  it('drops control characters that the TUI would read as keys', () => {
    expect(toAgentInputLine('a\u001b[Ab\u0003c\u007f')).toBe('a[Abc');
  });

  it('refuses non-strings, empty input and over-long input', () => {
    expect(toAgentInputLine(42)).toBeNull();
    expect(toAgentInputLine(undefined)).toBeNull();
    expect(toAgentInputLine(' \n\t ')).toBeNull();
    expect(toAgentInputLine('x'.repeat(AGENT_INPUT_MAX_CHARS + 1))).toBeNull();
    expect(toAgentInputLine('x'.repeat(AGENT_INPUT_MAX_CHARS))).toHaveLength(AGENT_INPUT_MAX_CHARS);
  });
});
