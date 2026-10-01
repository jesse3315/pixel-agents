/**
 * Movement commands typed into the agent chat box ("휴게실로 와", "go to kitchen",
 * "자리로 돌아가"). Recognized commands move the character in the UI and are
 * never sent to Claude; anything else returns null and goes to the agent.
 *
 * Pure: no DOM, no OfficeState. The whole message must be the command (anchored
 * patterns), so "API로 가는 요청 고쳐줘" stays a message for Claude.
 */

export type MoveCommand =
  /** Go to an area. `label` is the layout's own label when `name` matched one
   *  (case-insensitive), or null when no such area exists (show a hint). */
  | { kind: 'area'; name: string; label: string | null }
  /** Return to the assigned seat. */
  | { kind: 'seat' };

// Korean verb + optional request/polite ending: 와, 가, 오세요, 와줘, 가 주세요,
// 이동, 이동해, 이동해줘, 이동하자, 가자, 와라 ...
const KO_VERB =
  '(?:와|가|오|이동\\s*(?:해|하자|하세요|해요)?)\\s*(?:줘요|줘|주세요|세요|요|라|자)?';
const END = '[\\s.!?~]*$';

const KO_SEAT = new RegExp(
  `^(?:내|네|니)?\\s*자리\\s*(?:(?:으로|로|에)\\s*(?:돌아\\s*)?(?:${KO_VERB})?|(?:돌아\\s*)?${KO_VERB})${END}`,
);
const KO_GO_BACK = new RegExp(`^돌아\\s*${KO_VERB}${END}`);
const EN_SEAT =
  /^(?:please\s+)?(?:go\s+back(?:\s+to\s+(?:your\s+)?(?:seat|desk))?|back\s+to\s+(?:your\s+)?(?:seat|desk)|(?:go|return|move)\s+to\s+(?:your\s+)?(?:seat|desk))[\s.!?]*$/i;

/** "<target> <verb>" where target still carries its particle (휴게실로, 회의실으로, 카페에). */
const KO_AREA = new RegExp(`^(.+?)\\s*${KO_VERB}${END}`);
const KO_PARTICLES = ['으로', '로', '에'] as const;
const EN_AREA = /^(?:please\s+)?(?:go|come|move|walk)\s+to\s+(?:the\s+)?(.+?)[\s.!?]*$/i;

export function parseMoveCommand(input: string, areaLabels: readonly string[]): MoveCommand | null {
  const text = input.trim();
  if (!text) return null;

  if (KO_SEAT.test(text) || KO_GO_BACK.test(text) || EN_SEAT.test(text)) {
    return { kind: 'seat' };
  }

  const en = EN_AREA.exec(text);
  if (en) return areaCommand(en[1].trim(), [en[1].trim()], areaLabels);

  const ko = KO_AREA.exec(text);
  if (ko) {
    const target = ko[1].trim();
    const particle = KO_PARTICLES.find((p) => target.length > p.length && target.endsWith(p));
    if (!particle) return null; // "그냥 가" — no destination, not a move command
    // A label may itself end in a particle-like syllable ("복도로" area named
    // "복도로"?), so try the whole target and every particle-stripped form.
    const candidates = [
      target,
      ...KO_PARTICLES.filter((p) => target.endsWith(p)).map((p) =>
        target.slice(0, -p.length).trim(),
      ),
    ];
    return areaCommand(target.slice(0, -particle.length).trim(), candidates, areaLabels);
  }

  return null;
}

function areaCommand(
  name: string,
  candidates: string[],
  areaLabels: readonly string[],
): MoveCommand | null {
  for (const candidate of candidates) {
    const wanted = candidate.toLowerCase();
    const label = areaLabels.find((l) => l.trim().toLowerCase() === wanted);
    if (label !== undefined) return { kind: 'area', name, label };
  }
  // An unknown multi-word "name" is far more likely a sentence for Claude
  // ("이 버그 고치고 회의실로 와") than an area name, so let it through.
  if (!name || /\s/.test(name)) return null;
  return { kind: 'area', name, label: null };
}
