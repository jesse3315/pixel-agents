import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { endReplyTurn, extractAssistantText } from '../src/agentReply.js';
import { createAgentState } from '../src/agentState.js';
import { AgentStateStore } from '../src/agentStateStore.js';
import { AGENT_REPLY_MAX_CHARS, TEXT_IDLE_DELAY_MS } from '../src/constants.js';
import { claudeProvider } from '../src/providers/hook/claude/claude.js';
import { processTranscriptLine, setHookProvider } from '../src/transcriptParser.js';
import type { AgentState } from '../src/types.js';

const userPrompt = (text: string) =>
  JSON.stringify({ type: 'user', message: { role: 'user', content: text } });

const assistantText = (text: string, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'assistant',
    message: { role: 'assistant', content: [{ type: 'text', text }] },
    ...extra,
  });

const assistantTextThenTool = (text: string, toolId: string) =>
  JSON.stringify({
    type: 'assistant',
    message: {
      role: 'assistant',
      content: [
        { type: 'text', text },
        { type: 'tool_use', id: toolId, name: 'Read', input: { file_path: '/a.ts' } },
      ],
    },
  });

const toolResult = (toolId: string) =>
  JSON.stringify({
    type: 'user',
    message: { content: [{ type: 'tool_result', tool_use_id: toolId, content: 'ok' }] },
  });

const turnDuration = () =>
  JSON.stringify({ type: 'system', subtype: 'turn_duration', durationMs: 10 });

describe('extractAssistantText', () => {
  it('joins text blocks and ignores the rest', () => {
    expect(
      extractAssistantText([
        { type: 'thinking', thinking: 'hmm' },
        { type: 'text', text: ' 안녕하세요 ' },
        { type: 'text', text: 'second' },
      ]),
    ).toBe('안녕하세요 \nsecond');
  });

  it('accepts string content', () => {
    expect(extractAssistantText('  done  ')).toBe('done');
  });

  it('returns null when there is no text', () => {
    expect(extractAssistantText([{ type: 'tool_use', id: 't', name: 'Read' }])).toBeNull();
    expect(extractAssistantText([{ type: 'text', text: '   ' }])).toBeNull();
    expect(extractAssistantText(undefined)).toBeNull();
    expect(extractAssistantText([null, 3, { type: 'text', text: 7 }])).toBeNull();
  });

  it('caps the text at AGENT_REPLY_MAX_CHARS', () => {
    expect(extractAssistantText('x'.repeat(AGENT_REPLY_MAX_CHARS + 50))).toHaveLength(
      AGENT_REPLY_MAX_CHARS,
    );
  });
});

describe('agentReply: last assistant text of a finished turn', () => {
  let agents: AgentStateStore;
  let agent: AgentState;
  let replies: Array<Record<string, unknown>>;
  const waitingTimers = new Map<number, ReturnType<typeof setTimeout>>();
  const permissionTimers = new Map<number, ReturnType<typeof setTimeout>>();

  const feed = (...lines: string[]) => {
    for (const line of lines) {
      processTranscriptLine(1, line, agents, waitingTimers, permissionTimers);
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    setHookProvider(claudeProvider);
    agents = new AgentStateStore();
    agent = createAgentState({
      id: 1,
      sessionId: 's',
      projectDir: '/p',
      jsonlFile: '/p/s.jsonl',
      isExternal: false,
    });
    agents.set(1, agent);
    replies = [];
    agents.on('broadcast', (msg) => {
      if (msg.type === 'agentReply') replies.push(msg);
    });
  });

  afterEach(() => {
    waitingTimers.clear();
    permissionTimers.clear();
    vi.useRealTimers();
  });

  it('sends the final text on turn_duration, not the pre-tool preamble', () => {
    feed(
      userPrompt('fix it'),
      assistantTextThenTool('Let me look at the file.', 't1'),
      toolResult('t1'),
      assistantText('Fixed the bug in a.ts.'),
      turnDuration(),
    );
    expect(replies).toEqual([{ type: 'agentReply', id: 1, text: 'Fixed the bug in a.ts.' }]);
  });

  it('sends a text-only turn when the text-idle timer ends it (hooks off)', () => {
    feed(userPrompt('hi'), assistantText('Hello!'));
    expect(replies).toHaveLength(0);
    vi.advanceTimersByTime(TEXT_IDLE_DELAY_MS);
    expect(replies).toEqual([{ type: 'agentReply', id: 1, text: 'Hello!' }]);
  });

  it('sends text that arrives after the Stop hook already ended the turn', () => {
    agent.hookDelivered = true;
    feed(userPrompt('hi'));
    endReplyTurn(1, agent, agents); // Stop hook beat the transcript poll
    expect(replies).toHaveLength(0);
    feed(assistantText('Late answer'));
    expect(replies).toEqual([{ type: 'agentReply', id: 1, text: 'Late answer' }]);
  });

  it('sends each turn once, even when several turn-end signals fire', () => {
    agent.hookDelivered = true;
    feed(userPrompt('hi'), assistantText('Answer'));
    endReplyTurn(1, agent, agents); // Stop hook
    feed(turnDuration()); // the transcript's own turn end, later
    expect(replies).toHaveLength(1);
  });

  it('does not carry a reply into the next turn', () => {
    agent.hookDelivered = true;
    feed(userPrompt('one'), assistantText('First'));
    endReplyTurn(1, agent, agents);
    feed(userPrompt('two'), assistantTextThenTool('Checking...', 't2'));
    endReplyTurn(1, agent, agents);
    expect(replies.map((r) => r.text)).toEqual(['First']);
  });

  it("ignores a sub-agent's sidechain text once the lead has its own turns", () => {
    agent.hookDelivered = true;
    agent.sawMainChainUsage = true;
    feed(userPrompt('go'), assistantText('sub-agent chatter', { isSidechain: true }));
    endReplyTurn(1, agent, agents);
    expect(replies).toHaveLength(0);
  });
});
