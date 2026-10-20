// Run with: node tests/a1-phrases.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ EX_RU: {} });
const run = source => vm.runInContext(source, context);
const json = source => JSON.parse(run(`JSON.stringify(${source})`));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const file of ['data-words.js', 'data-wordex.js', 'data-wordtr.js', 'data-patch.js', 'fixes.js']) run(read(file));
run(`function inventory() {
  return W_BRANCHES.flatMap(b => ['cells', 'extra'].flatMap(p =>
    Object.values(b[p] || {}).flatMap(cards => cards.flatMap(card =>
      card[3].split(';').map(s => s.trim()).filter(Boolean).map(s => ({ id: card[0], fields: s.split('|').map(f => f.trim()) }))
    ))
  ));
}`);
const before = json('inventory()');
run(read('data-a1-phrases.js'));
run(read('verb-forms.js'));
const after = json('inventory()');
const aliases = json('A1_PHRASE_PROGRESS');
const key = row => row.id + '|' + slug(row.fields[0]);
const existing = new Map(after.map(row => [key(row), row]));
const sourceKeys = new Set(Object.values(aliases).flat().map(([id, k]) => id + '|' + k));
const newIds = new Set(['da-a1-phrasal', 'da-a1-everyday', 'ba-a1-prepositions']);
const added = after.filter(row => newIds.has(row.id));

assert.equal(before.length, 4375);
assert.equal(added.length, 51);
assert.equal(after.length, 4396);
assert.equal(before.filter(row => sourceKeys.has(key(row))).length, 30);
assert.equal(sourceKeys.size, 32); // Includes both earlier be-late-for variants.
for (const [target, sources] of Object.entries(aliases)) {
  assert.ok(existing.has(target), 'Missing destination: ' + target);
  for (const [id, k] of sources) {
    assert.ok(!existing.has(id + '|' + k), 'Duplicate left in vocabulary: ' + id + '|' + k);
    assert.ok(after.some(row => row.id === id), 'Legacy progress document must still load: ' + id);
  }
}

// Unrelated entries, including different senses, stay intact.
const refined = new Set(['da2-phrasal|pick-up', 'da4-phrasal-3|put-down']);
for (const row of before) {
  if (!sourceKeys.has(key(row)) && !refined.has(key(row))) assert.deepEqual(existing.get(key(row)), row);
}
for (const id of ['to2-airport|take-off', 'to3-directions|turn-off', 'da3-phrasal-3|turn-up']) {
  assert.ok(existing.has(id), 'Distinct sense removed: ' + id);
}
assert.equal(existing.get('da2-phrasal|pick-up').fields[1], 'заехать за кем-то, забрать');
assert.equal(existing.get('da4-phrasal-3|put-down').fields[1], 'записать (на бумаге)');
assert.ok(json(`W_BRANCHES.every(b => ['cells', 'extra'].every(p => Object.values(b[p] || {}).every(cards => cards.every(c => c[3].trim()))))`));
for (const row of added) {
  assert.equal(after.filter(other => other.fields[0].toLowerCase() === row.fields[0].toLowerCase()).length, 1);
  const k = slug(row.fields[0]);
  const meta = json(`({ tr: WORD_TR[${JSON.stringify(k)}], ex: WORD_EX[${JSON.stringify(k)}], translation: EX_RU[${JSON.stringify(row.fields[3])}] })`);
  assert.ok(meta.tr && meta.tr[0] && meta.tr[1], 'Missing pronunciation: ' + k);
  assert.ok(meta.ex && meta.ex[0].length === 3 && meta.ex[3], 'Missing verb data: ' + k);
  assert.ok(meta.translation && row.fields[4], 'Missing explanation: ' + k);
}

// Exercise the actual app accessor, including all stored SRS fields.
const app = read('app.js');
const accessor = app.slice(app.indexOf('  function rec(id,k){'), app.indexOf('  const lvl=(id,k)=>rec(id,k)[0];'));
assert.ok(accessor.includes('A1_PHRASE_PROGRESS'));
run('const prog={};\n' + accessor + '\nglobalThis.progress=prog; globalThis.readProgress=rec;');
const progress = context.progress;
const clear = () => Object.keys(progress).forEach(id => delete progress[id]);
const set = (id, k, record) => (progress[id] ||= {})[k] = record;
for (const [target, sources] of Object.entries(aliases)) {
  const [id, k] = target.split('|');
  for (const [sourceId, sourceKey] of sources) {
    clear();
    const old = [8, 1000, 12, 900000, 60, 2.6];
    set(sourceId, sourceKey, old);
    const snapshot = JSON.stringify(progress);
    assert.equal(context.readProgress(id, k), old);
    assert.equal(JSON.stringify(progress), snapshot, 'Reading must not rewrite or delete progress');
    const current = [2, 2000, 13, 950000, 1, 2.4];
    set(id, k, current);
    assert.equal(context.readProgress(id, k), current, 'Latest review wins, even at a lower level');
    delete progress[id][k]; // Undo first review under the consolidated key.
    assert.equal(context.readProgress(id, k), old);
    set(id, k, [0, 3000, 0]);
    assert.equal(context.readProgress(id, k)[0], 0, 'An explicit reset must not revive old progress');
  }
}
clear();
set('da2-phrasal', 'put-on', [8, 1000, 4, 5000, 60, 2.5]);
const newest = [5, 2000, 8, 6000, 10, 2.3];
set('sh-clothes-2', 'put-on', newest);
assert.equal(context.readProgress('da-a1-phrasal', 'put-on-a-jacket'), newest);
assert.equal(context.readProgress('da-a1-phrasal', 'eat-out')[0], 0);
clear(); // Switching profile must not retain another profile's progress.
assert.equal(context.readProgress('da-a1-phrasal', 'put-on-a-jacket')[0], 0);

// Validate answers using the shipped validator, including the consolidated late-for card.
context.document = { addEventListener() {}, createElement() { return {}; }, head: { appendChild() {} } };
context.MutationObserver = class { observe() {} };
const validator = read('type-to-know.js');
const end = validator.lastIndexOf('})();');
run(validator.slice(0, end) + '\nglobalThis.answerOK=(typed,w,ru)=>ok(norm(typed),w,ru);\n' + validator.slice(end));
function accepts(en, typed) {
  const row = added.find(r => r.fields[0] === en);
  assert.ok(row);
  return context.answerOK(typed, { id: row.id, en, p: row.fields[2] }, row.fields[1]);
}
for (const answer of ['be late for', 'late for', 'be late for work', 'be late for school']) assert.ok(accepts('be late for', answer));
for (const answer of ['be late to school', 'late', 'be late school']) assert.ok(!accepts('be late for', answer));
assert.ok(accepts('wait for somebody', 'wait for someone'));
assert.ok(!accepts('wait for somebody', 'wait somebody'));
assert.ok(accepts('put on a jacket', 'put a jacket on'));
assert.ok(!accepts('put on a jacket', 'put off a jacket'));
assert.ok(accepts('be at home', 'at home'));

console.log('PASS: 30 older duplicates consolidated; 51 A1 entries; progress, distinct senses and answers verified.');
