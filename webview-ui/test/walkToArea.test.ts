/**
 * OfficeState half of the chat move commands: walkToArea sends a character into
 * an area and holdPosition keeps it there (no idle wander) until the agent
 * becomes active again. Like greeter.test.ts, this pins domain-model invariants
 * (a wander FSM that stays put across simulated minutes) that e2e can't observe.
 *
 * Run with: npm test
 */

import assert from 'node:assert/strict';

import { test } from 'vitest';

import { AREA_DEFAULT_COLORS } from '../src/constants.js';
import { OfficeState } from '../src/office/engine/officeState.js';
import type { OfficeLayout } from '../src/office/types.js';
import { TileType } from '../src/office/types.js';

const COLS = 12;
const ROWS = 8;
/** Columns 8..11 form the "휴게실" area. */
const AREA_MIN_COL = 8;

function layoutWithArea(): OfficeLayout {
  const areaTiles: Array<string | null> = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) areaTiles.push(col >= AREA_MIN_COL ? '휴게실' : null);
  }
  return {
    version: 1,
    cols: COLS,
    rows: ROWS,
    tiles: new Array<TileType>(COLS * ROWS).fill(TileType.FLOOR_1),
    furniture: [],
    areas: [{ label: '휴게실', color: AREA_DEFAULT_COLORS[0] }],
    areaTiles,
  };
}

function idleAgent(os: OfficeState, id: number) {
  os.addAgent(id, 0, 0, undefined, true);
  os.setAgentActive(id, false);
  return os.characters.get(id)!;
}

function simulate(os: OfficeState, seconds: number): void {
  for (let t = 0; t < seconds; t += 0.05) os.update(0.05);
}

test('walks an idle agent into the area and holds it there', () => {
  const os = new OfficeState(layoutWithArea());
  const ch = idleAgent(os, 1);

  assert.equal(os.walkToArea(1, '휴게실'), true);
  simulate(os, 300); // five minutes: far longer than any wander pause

  assert.ok(ch.tileCol >= AREA_MIN_COL, `still in the area (col ${ch.tileCol})`);
  assert.equal(ch.path.length, 0, 'standing still, not wandering');
});

test('becoming active releases the hold', () => {
  const os = new OfficeState(layoutWithArea());
  const ch = idleAgent(os, 1);
  os.walkToArea(1, '휴게실');
  simulate(os, 10);

  os.setAgentActive(1, true);
  assert.equal(ch.holdPosition, false);
});

test('an unknown area or agent is refused', () => {
  const os = new OfficeState(layoutWithArea());
  idleAgent(os, 1);
  assert.equal(os.walkToArea(1, '회의실'), false);
  assert.equal(os.walkToArea(99, '휴게실'), false);
});

test('a reply bubble hides on new activity', () => {
  const os = new OfficeState(layoutWithArea());
  const ch = idleAgent(os, 1);
  os.showReply(1, '완료했어요');
  assert.equal(ch.replyText, '완료했어요');
  os.setAgentActive(1, true);
  assert.equal(ch.replyText, null);
});
