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

test('audio/report controls are above the flashcard and buttons stay at the bottom',()=>{
  const app=read('app.js');
  const css=read('card-reports.css');
  const begin=app.indexOf("    let h=(S.lv?lvHead():head(");
  const end=app.indexOf("    modal.innerHTML=h; modal.classList.add('fixed');",begin);
  const session=app.slice(begin,end);
  const tools=session.indexOf('fc-foot fc-tools');
  const card=session.indexOf("'<div class=\"fc\">");
  const buttons=session.indexOf('fc-actions');
  assert.ok(tools>=0 && card>tools && buttons>card);
  assert.match(session,/id="autoSay"/);
  assert.match(session,/data-act="report-word"/);
  assert.match(session,/fc-foot-right/);
  assert.equal((session.match(/id="autoSay"/g)||[]).length,1);
  assert.equal((session.match(/Пожаловаться на ошибку/g)||[]).length,1);
  assert.match(css,/\.modal\.fixed > \.fc-actions\s*\{[^}]*margin-top:auto/);
  assert.match(css,/\.modal\.fixed > \.fc-tools\s*\{[^}]*flex-wrap:nowrap/);
});
