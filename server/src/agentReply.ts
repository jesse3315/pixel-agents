/**
 * Turn reply text: the last assistant text of a finished turn, broadcast as
 * `agentReply` so the webview can show it as a speech bubble.
 *
 * The text comes from the transcript (assistant `text` blocks); the turn end
 * comes from whichever signal fires first -- Stop hook, `turn_duration`, or the
 * text-idle timer. Hooks usually beat the 500 ms transcript poll, so the two
 * halves arrive in either order: a turn end with no text yet only marks the
 * turn ended, and text read after that is sent as soon as it arrives.
 */

import type { AgentStateStore } from './agentStateStore.js';
import { AGENT_REPLY_MAX_CHARS } from './constants.js';
import type { AgentState } from './types.js';

/** Joined `text` blocks of an assistant record's content, or null when it has none. */
export function extractAssistantText(content: unknown): string | null {
  let text: string;
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    text = content
      .filter(
        (b): b is { type: 'text'; text: string } =>
          !!b && typeof b === 'object' && b.type === 'text' && typeof b.text === 'string',
      )
      .map((b) => b.text)
      .join('\n');
  } else {
    return null;
  }
  text = text.trim();
  return text ? text.slice(0, AGENT_REPLY_MAX_CHARS) : null;
}

/** A new user prompt: forget the previous turn's reply state. */
export function startReplyTurn(agent: AgentState): void {
  agent.pendingReplyText = undefined;
  agent.replyTurnEnded = false;
}

/** Remember the turn's latest assistant text; send it right away if the turn already ended. */
export function noteAssistantText(
  agentId: number,
  agent: AgentState,
  agents: AgentStateStore,
  text: string,
): void {
  agent.pendingReplyText = text;
  if (agent.replyTurnEnded) flushAgentReply(agentId, agent, agents);
}

/** Turn ended: send the pending reply (once), and let late text through. */
export function endReplyTurn(agentId: number, agent: AgentState, agents: AgentStateStore): void {
  agent.replyTurnEnded = true;
  flushAgentReply(agentId, agent, agents);
}

function flushAgentReply(agentId: number, agent: AgentState, agents: AgentStateStore): void {
  const text = agent.pendingReplyText;
  if (!text) return;
  agent.pendingReplyText = undefined;
  agents.broadcast({ type: 'agentReply', id: agentId, text });
}
