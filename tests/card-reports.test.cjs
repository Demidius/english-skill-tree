const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');

test('new report scripts and modified app parse as JavaScript',()=>{
  for(const file of ['card-reports.js','reports.js','app.js'])
    assert.doesNotThrow(()=>new Function(read(file)),file);
});

test('report links and handlers exist on both study cards and grammar rules',()=>{
  const html=read('index.html'),app=read('app.js');
  assert.match(html,/card-reports\.js[^"]*/);
  assert.match(html,/card-reports\.css[^"]*/);
  assert.ok(html.indexOf('card-reports.js')<html.indexOf('app.js'));
  assert.match(app,/data-act="report-rule"/);
  assert.match(app,/data-act="report-word"/);
  assert.match(app,/CardReports\.open\(\{kind:'word'/);
  assert.match(app,/CardReports\.open\(\{kind:'rule'/);
});

test('report rules keep submissions immutable and admin access restricted',()=>{
  const rules=read('firestore.rules');
  assert.match(rules,/match \/cardReports\/\{reportId\}/);
  assert.match(rules,/allow get, list: if admin\(\)/);
  assert.match(rules,/request\.resource\.data\.createdAt == request\.time/);
  assert.match(rules,/request\.resource\.data\.reporterUid == request\.auth\.uid/);
  assert.match(rules,/diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly/);
});

test('audio control and complaint action share one footer row',()=>{
  const app=read('app.js');
  const css=read('card-reports.css');
  const footer=app.slice(app.indexOf('    h+=\'<div class="fc-foot">\'+'),app.indexOf('    modal.innerHTML=h; modal.classList.add(\'fixed\');'));
  assert.match(footer,/id="autoSay"/);
  assert.match(footer,/data-act="report-word"/);
  assert.match(footer,/fc-foot-right/);
  assert.doesNotMatch(footer,/fc-report/);
  assert.match(css,/\.fc-foot\s*\{[^}]*flex-wrap:nowrap/);
});
