const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const DAY = 864e5;
const NOW = new Date(2026, 9, 19, 12).getTime();

function between(start, end) {
  const first = source.indexOf(start);
  const last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `Missing source boundary: ${start}`);
  return source.slice(first, last);
}

function harness(record = [0, 0, 0], typed = 'untidy') {
  class Clock extends Date { static now() { return NOW; } }
  const ctx = {
    Date: Clock,
    COEF: { review: { hardPct: 120, easyPct: 130, maxIvl: 365 } },
    S: { mode: 'session', flipped: false, kbox: true,
      queue: [{ tid: 'adjectives', k: 'untidy', en: 'untidy', ru: 'неопрятный' }] },
    rec: () => record,
    modal: { querySelector: () => ({ value: typed, focus() {} }) },
    autoSay: false,
    renderCard: () => { ctx.renders = (ctx.renders || 0) + 1; },
    grade: g => {
      ctx.gradeUsed = g;
      ctx.result = ctx.review.sched(record, g, NOW);
    }
  };
  vm.createContext(ctx);
  vm.runInContext(
    between('  const DAY=864e5', '  function lvlHTML(') +
    between('  function normAns(', '  function renderKnownOk(') +
    between('  function checkKnown(', '  function flip(') +
    '\nthis.review = { sched, canKnow, checkKnown };', ctx
  );
  return ctx;
}

test('correct typed answers take new and due level 1-7 words directly to 8', () => {
  const records = [[0, 0, 0]];
  for (const [level, interval] of [[1, 0], [1, 0.5], [2, 1], [3, 2.5], [4, 5], [5, 10], [6, 17], [7, 30]]) {
    records.push([level, NOW - 40 * DAY, 4, NOW, interval, 2.5]);
  }
  for (const record of records) {
    const ctx = harness(record);
    ctx.review.checkKnown();
    assert.equal(ctx.gradeUsed, 'known', `level ${record[0]} must accept typed recall`);
    assert.equal(ctx.result.lv, 8);
    assert.equal(ctx.result.ivl, 45);
    const due = new Date(NOW);
    due.setDate(due.getDate() + 45);
    due.setHours(4, 0, 0, 0);
    assert.equal(ctx.result.due, due.getTime());
  }
});

test('a forgotten word accepts known once its ten-minute wait is over', () => {
  const ctx = harness();
  const forgotten = ctx.review.sched([3, NOW - 3 * DAY, 5, NOW, 2.5, 2.5], 'again', NOW - 10 * 60e3);
  const record = [forgotten.lv, NOW - 10 * 60e3, 6, forgotten.due, forgotten.ivl, forgotten.ease];
  assert.equal(record[3], NOW);
  const retry = harness(record);
  retry.review.checkKnown();
  assert.equal(retry.result.lv, 8);
  assert.equal(retry.result.ivl, 45);
});

test('future reviews cannot open or submit a known answer, including stale forms', () => {
  for (const interval of [0, 0.5, 1, 30, 45, 90, 180]) {
    const record = [1, NOW - DAY, 3, NOW + 1, interval, 2.5];
    const ctx = harness(record);
    assert.equal(ctx.review.canKnow(record, NOW), false);
    ctx.review.checkKnown();
    assert.equal(ctx.gradeUsed, undefined);
    assert.equal(ctx.S.kbox, false);
    assert.equal(ctx.renders, 1);
    record[3] = NOW;
    assert.equal(ctx.review.canKnow(record, NOW), true);
  }
});

test('incorrect and empty input never award level 8', () => {
  for (const typed of ['tidy', 'untity', '']) {
    const ctx = harness([2, NOW - DAY, 3, NOW, 1, 2.5], typed);
    ctx.review.checkKnown();
    assert.equal(ctx.gradeUsed, undefined);
    assert.equal(ctx.S.flipped, typed !== '');
  }
});

test('due known words advance one mastery stage without skipping or downgrading', () => {
  for (const [level, interval, ease, expected] of [[8, 45, 2.5, 9], [8, 89, 3.8, 9], [9, 90, 2.5, 10], [10, 180, 1.3, 10], [10, 365, 2.5, 10]]) {
    const ctx = harness([level, NOW - interval * DAY, 5, NOW, interval, ease]);
    ctx.review.checkKnown();
    assert.equal(ctx.result.lv, expected);
  }
});

test('migrated level 8 records with a 40-day review advance to 9', () => {
  const ctx = harness([8, NOW - 40 * DAY, 5, NOW, 40, 2.5]);
  ctx.review.checkKnown();
  assert.equal(ctx.result.lv, 9);
});

test('overdue low-level words still receive 8, not a higher mastery stage', () => {
  const ctx = harness([7, NOW - 300 * DAY, 6, NOW - 270 * DAY, 30, 2.5]);
  ctx.review.checkKnown();
  assert.equal(ctx.result.lv, 8);
  assert.equal(ctx.result.ivl, 45);
});
