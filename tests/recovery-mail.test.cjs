const {test}=require('node:test');const assert=require('node:assert');
const {nickToEmail,emailToNick}=require('../functions/nick');
const mail=require('../functions/mail-text');
global.firebase=undefined;global.window={};require('../firebase-config.js');
test('server nick mapping matches the browser login scheme and round-trips',()=>{
  for(const n of ['Demid','демид','a.b_c','Ёжик-7','x-6162']){
    assert.strictEqual(nickToEmail(n),window.SkillFirebase.nickToEmail(n));
    assert.strictEqual(nickToEmail(emailToNick(nickToEmail(n))),nickToEmail(n));
  }
  assert.strictEqual(emailToNick('someone@gmail.com'),null);
});
test('letters never contain a password and escape the nick in HTML',()=>{
  const w=mail.welcome('<b>x</b>',false);
  assert.match(w.text,/Ник для входа: <b>x<\/b>/);assert.doesNotMatch(w.html,/<b><b>/);
  assert.ok(w.text.includes(mail.SITE_URL));
  assert.doesNotMatch(w.text+w.html,/Пароль: /);
  assert.match(mail.passwordReset('demid','https://x/reset?a=1&b=2').html,/a=1&amp;b=2/);
  assert.strictEqual(mail.mask('demid@gmail.com'),'d***d@gmail.com');
});
