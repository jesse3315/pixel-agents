import { useEffect, useRef, useState } from 'react';

import { AGENT_CHAT_HINT_MS, AGENT_CHAT_MAX_CHARS, AGENT_CHAT_WIDTH_PX } from '../constants.js';
import { t, useLanguage } from '../i18n/index.js';
import type { OfficeState } from '../office/engine/officeState.js';
import { parseMoveCommand } from '../office/moveCommand.js';
import { transport } from '../transport/index.js';
import { Button } from './ui/Button.js';

interface AgentChatInputProps {
  officeState: OfficeState;
  /** Agents with a server-side PTY: the only ones a chat message can reach. */
  terminalAgentIds: number[];
}

/**
 * Chat box for the selected agent. Movement commands ("휴게실로 와", "back to
 * seat") move the character right here and never reach Claude; anything else
 * is typed into the agent's PTY via sendAgentInput. Selection lives in
 * OfficeState (set imperatively by the canvas), so it is polled per frame.
 */
export function AgentChatInput({ officeState, terminalAgentIds }: AgentChatInputProps) {
  useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const id = officeState.selectedAgentId;
      const ch = id !== null ? officeState.characters.get(id) : undefined;
      setSelectedId(ch && !ch.isSubagent ? ch.id : null);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [officeState]);

  // A hint belongs to the agent it was about.
  useEffect(() => setHint(null), [selectedId]);
  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    },
    [],
  );

  if (selectedId === null) return null;
  const canChat = terminalAgentIds.includes(selectedId);

  const showHint = (text: string) => {
    setHint(text);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), AGENT_CHAT_HINT_MS);
  };

  const close = () => {
    officeState.selectedAgentId = null;
    officeState.cameraFollowId = null;
  };

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    const areaLabels = (officeState.getLayout().areas ?? []).map((a) => a.label);
    const cmd = parseMoveCommand(text, areaLabels);
    if (cmd) {
      const ch = officeState.characters.get(selectedId);
      if (cmd.kind === 'seat') {
        if (!ch?.seatId) showHint(t('move.noSeat'));
        else officeState.sendToSeat(selectedId);
      } else if (cmd.label === null) {
        showHint(t('move.noArea', { name: cmd.name }));
      } else if (ch?.isActive) {
        // An active agent's FSM walks it straight back to its desk.
        showHint(t('move.busy'));
      } else if (!officeState.walkToArea(selectedId, cmd.label)) {
        showHint(t('move.unreachable', { name: cmd.label }));
      }
      setDraft('');
      return;
    }
    if (!canChat) {
      showHint(t('chat.noPty'));
      return;
    }
    transport.send({ type: 'sendAgentInput', id: selectedId, text });
    setDraft('');
    showHint(t('chat.sent'));
  };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-64 z-20 pixel-panel p-4 flex flex-col gap-4"
      style={{ width: `min(${AGENT_CHAT_WIDTH_PX}px, calc(100% - 32px))` }}
      data-testid="agent-chat"
    >
      {hint && <div className="text-sm text-text-muted px-4">{hint}</div>}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={draft}
          maxLength={AGENT_CHAT_MAX_CHARS}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // IME composition (Hangul) also fires Enter to commit the syllable.
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              close();
            }
          }}
          placeholder={canChat ? t('chat.placeholder') : t('chat.placeholderMoveOnly')}
          aria-label={t('chat.inputLabel')}
          className="flex-1 min-w-0 text-base py-2 px-6 bg-bg-dark border-2 border-border rounded-none text-text"
        />
        <Button variant="accent" size="md" onClick={submit} disabled={!draft.trim()}>
          {t('chat.send')}
        </Button>
      </div>
    </div>
  );
}
