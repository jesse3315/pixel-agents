import assert from 'node:assert/strict';

import { describe, test } from 'vitest';

import { parseMoveCommand } from '../src/office/moveCommand.js';

const AREAS = ['휴게실', '회의실', 'Kitchen', 'Meeting Room', '복도로'];

const area = (name: string, label: string | null) => ({ kind: 'area', name, label });
const SEAT = { kind: 'seat' };

describe('parseMoveCommand: Korean area commands', () => {
  test('strips 로 / 으로 / 에 and accepts the verb forms', () => {
    assert.deepEqual(parseMoveCommand('휴게실로 와', AREAS), area('휴게실', '휴게실'));
    assert.deepEqual(parseMoveCommand('휴게실로 가', AREAS), area('휴게실', '휴게실'));
    assert.deepEqual(parseMoveCommand('휴게실로 이동', AREAS), area('휴게실', '휴게실'));
    assert.deepEqual(parseMoveCommand('휴게실로 이동해줘', AREAS), area('휴게실', '휴게실'));
    assert.deepEqual(parseMoveCommand('회의실으로 와', AREAS), area('회의실', '회의실'));
    assert.deepEqual(parseMoveCommand('회의실에 가', AREAS), area('회의실', '회의실'));
    assert.deepEqual(parseMoveCommand('회의실로 가줘', AREAS), area('회의실', '회의실'));
    assert.deepEqual(parseMoveCommand('회의실으로 가 주세요!', AREAS), area('회의실', '회의실'));
    assert.deepEqual(parseMoveCommand('  휴게실로와  ', AREAS), area('휴게실', '휴게실'));
  });

  test('matches a label that itself ends in a particle-like syllable', () => {
    assert.deepEqual(parseMoveCommand('복도로로 와', AREAS), area('복도로', '복도로'));
  });

  test('reports an unknown area by name so the UI can hint', () => {
    assert.deepEqual(parseMoveCommand('옥상으로 와', AREAS), area('옥상', null));
    assert.deepEqual(parseMoveCommand('휴게실로 와', []), area('휴게실', null));
  });

  test('leaves sentences for Claude', () => {
    assert.equal(parseMoveCommand('API로 가는 요청을 고쳐줘', AREAS), null);
    assert.equal(parseMoveCommand('이 버그 고치고 회의실로 와', AREAS), null);
    assert.equal(parseMoveCommand('그냥 가', AREAS), null);
    assert.equal(parseMoveCommand('README 요약해줘', AREAS), null);
    assert.equal(parseMoveCommand('', AREAS), null);
  });
});

describe('parseMoveCommand: English area commands', () => {
  test('go / come / move to <name>, case-insensitive', () => {
    assert.deepEqual(parseMoveCommand('go to kitchen', AREAS), area('kitchen', 'Kitchen'));
    assert.deepEqual(parseMoveCommand('Come to the KITCHEN!', AREAS), area('KITCHEN', 'Kitchen'));
    assert.deepEqual(
      parseMoveCommand('move to meeting room', AREAS),
      area('meeting room', 'Meeting Room'),
    );
    assert.deepEqual(parseMoveCommand('go to 휴게실', AREAS), area('휴게실', '휴게실'));
  });

  test('unknown single-word area hints; unknown multi-word is a message', () => {
    assert.deepEqual(parseMoveCommand('go to garden', AREAS), area('garden', null));
    assert.equal(parseMoveCommand('go to the docs folder and fix the typo', AREAS), null);
  });
});

describe('parseMoveCommand: return to seat', () => {
  test('Korean forms', () => {
    assert.deepEqual(parseMoveCommand('자리로', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('자리로 돌아가', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('자리로 돌아가줘', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('네 자리로 와', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('돌아와', AREAS), SEAT);
  });

  test('English forms', () => {
    assert.deepEqual(parseMoveCommand('back to seat', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('go back', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('Go back to your desk.', AREAS), SEAT);
    assert.deepEqual(parseMoveCommand('go to your seat', AREAS), SEAT);
  });

  test('a sentence mentioning a seat is not a command', () => {
    assert.equal(parseMoveCommand('자리 배치 코드를 고쳐줘', AREAS), null);
  });
});
