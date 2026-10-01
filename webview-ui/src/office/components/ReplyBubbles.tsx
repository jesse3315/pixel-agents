import { useEffect, useState } from 'react';

import {
  AGENT_REPLY_BUBBLE_LIFT_PX,
  AGENT_REPLY_BUBBLE_MAX_CHARS,
  AGENT_REPLY_BUBBLE_MAX_WIDTH_PX,
  CHARACTER_SITTING_OFFSET_PX,
  TOOL_OVERLAY_VERTICAL_OFFSET,
} from '../../constants.js';
import { t, useLanguage } from '../../i18n/index.js';
import type { OfficeState } from '../engine/officeState.js';
import { overlayProjection } from '../projection.js';
import { CharacterState } from '../types.js';

interface ReplyBubblesProps {
  officeState: OfficeState;
  agents: number[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  panRef: React.RefObject<{ x: number; y: number }>;
  /** Agents whose terminal can be opened (bubble click reveals it). */
  terminalAgentIds: number[];
  onOpenTerminal: (id: number) => void;
}

function bubbleText(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > AGENT_REPLY_BUBBLE_MAX_CHARS
    ? `${flat.slice(0, AGENT_REPLY_BUBBLE_MAX_CHARS - 1)}…`
    : flat;
}

/**
 * Speech bubbles with each agent's last turn reply (`agentReply`). DOM, not
 * canvas, so Hangul and any other script render with the page's font fallback.
 * Positioned like ToolOverlay, lifted to clear its label panel.
 */
export function ReplyBubbles({
  officeState,
  agents,
  containerRef,
  zoom,
  panRef,
  terminalAgentIds,
  onOpenTerminal,
}: ReplyBubblesProps) {
  useLanguage();
  const [, setTick] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      setTick((n) => n + 1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const el = containerRef.current;
  if (!el) return null;
  const project = overlayProjection(
    officeState.getLayout(),
    el.getBoundingClientRect(),
    zoom,
    panRef.current,
    window.devicePixelRatio || 1,
  );

  return (
    <>
      {agents.map((id) => {
        const ch = officeState.characters.get(id);
        if (!ch?.replyText) return null;
        const sittingOffset = ch.state === CharacterState.TYPE ? CHARACTER_SITTING_OFFSET_PX : 0;
        const canOpen = terminalAgentIds.includes(id);
        return (
          <div
            key={id}
            className={`absolute pixel-panel px-8 pt-2 pb-4 text-sm ${canOpen ? 'cursor-pointer' : ''}`}
            style={{
              left: project.toScreenX(ch.x),
              top:
                project.toScreenY(ch.y + sittingOffset - TOOL_OVERLAY_VERTICAL_OFFSET) -
                AGENT_REPLY_BUBBLE_LIFT_PX,
              transform: 'translate(-50%, -100%)',
              maxWidth: AGENT_REPLY_BUBBLE_MAX_WIDTH_PX,
              width: 'max-content',
              lineHeight: 1.1,
              zIndex: 43,
            }}
            title={canOpen ? t('reply.openTerminal') : undefined}
            onClick={() => {
              officeState.dismissReply(id);
              if (canOpen) onOpenTerminal(id);
            }}
            data-testid="agent-reply"
            data-agent-id={id}
          >
            {bubbleText(ch.replyText)}
          </div>
        );
      })}
    </>
  );
}
