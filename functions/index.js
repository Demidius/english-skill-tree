/*
 * Восстановление доступа по почте. Пароли здесь не видны: Firebase Auth хранит только их хэш.
 * Почта для восстановления лежит в accountPrivate/{uid}; пишет её только этот код (Admin SDK),
 * клиент может лишь отказаться от почты (emailOptOut) — см. firestore.rules.
 */
const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {setGlobalOptions} = require('firebase-functions/v2');
const {defineSecret} = require('firebase-functions/params');
const admin = require('firebase-admin');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const {nickToEmail, emailToNick} = require('./nick');
const mail = require('./mail-text');

admin.initializeApp();
setGlobalOptions({region: 'europe-west1', maxInstances: 3});
const SMTP_USER = defineSecret('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');
const secrets = [SMTP_USER, SMTP_PASS];
const db = () => admin.firestore();

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
function normEmail(v) {
  const e = String(v || '').trim().toLowerCase();
  if (e.length > 254 || !EMAIL_RE.test(e) || e.endsWith('@users.skilltree.app')) throw new HttpsError('invalid-argument', 'Проверь адрес почты.');
  return e;
}

async function send(to, letter) {
  if (process.env.FUNCTIONS_EMULATOR === 'true' && !process.env.SMTP_LIVE) { console.log('[mail]', to, letter.subject, '\n' + letter.text); return; }
  const t = nodemailer.createTransport({host: 'smtp.gmail.com', port: 465, secure: true, auth: {user: SMTP_USER.value(), pass: SMTP_PASS.value()}});
  await t.sendMail({from: {name: 'English File · Skill Tree', address: SMTP_USER.value()}, to, subject: letter.subject, text: letter.text, html: letter.html});
}

/** Не больше `max` событий за `windowMs` на ключ. Ключ хэшируется, чтобы в базе не копились адреса. */
async function limit(key, max, windowMs) {
  const ref = db().doc('mailLimits/' + crypto.createHash('sha256').update(key).digest('hex'));
  return db().runTransaction(async tx => {
    const now = Date.now();
    const hits = ((await tx.get(ref)).data()?.hits || []).filter(t => t > now - windowMs);
    if (hits.length >= max) return false;
    tx.set(ref, {hits: [...hits, now], expiresAt: admin.firestore.Timestamp.fromMillis(now + windowMs)});
    return true;
  });
}
async function loginNick(uid) {
  const u = await admin.auth().getUser(uid);
  return emailToNick(u.email) || u.email;
}

// Привязать или сменить почту. Шлёт письмо с ником на новый адрес и уведомление на старый.
exports.setRecoveryEmail = onCall({secrets}, async req => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Войди в аккаунт.');
  const uid = req.auth.uid, email = normEmail(req.data?.email);
  if (!await limit('set:' + uid, 5, 86400000)) throw new HttpsError('resource-exhausted', 'Почту можно менять не чаще 5 раз в сутки.');
  const ref = db().doc('accountPrivate/' + uid);
  const old = (await ref.get()).data()?.email || null;
  if (old === email) return {email, unchanged: true};
  const nick = await loginNick(uid);
  await send(email, mail.welcome(nick, !!old));
  await ref.set({email, emailOptOut: false, emailSetAt: admin.firestore.FieldValue.serverTimestamp()}, {merge: true});
  if (old) await send(old, mail.emailMoved(nick, mail.mask(email))).catch(e => console.warn('old address notice failed', e.message));
  return {email};
});

// «Забыл ник»: шлёт все ники, привязанные к адресу. Ответ одинаковый, есть такой адрес или нет.
exports.recoverNick = onCall({secrets}, async req => {
  const email = normEmail(req.data?.email);
  if (!await limit('nick:' + email, 3, 3600000)) throw new HttpsError('resource-exhausted', 'Слишком много запросов. Попробуй через час.');
  const q = await db().collection('accountPrivate').where('email', '==', email).limit(10).get();
  if (!q.empty) await send(email, mail.nickList(await Promise.all(q.docs.map(d => loginNick(d.id)))));
  return {ok: true};
});

// «Забыл пароль»: ссылка сброса уходит на почту для восстановления, а не на технический адрес.
exports.sendPasswordReset = onCall({secrets}, async req => {
  const nick = String(req.data?.nick || '').trim();
  if (nick.length < 2 || nick.length > 30 || /[\s@]/.test(nick)) throw new HttpsError('invalid-argument', 'Проверь ник.');
  const login = nickToEmail(nick);
  if (!await limit('reset:' + login, 3, 3600000)) throw new HttpsError('resource-exhausted', 'Слишком много запросов. Попробуй через час.');
  let user; try { user = await admin.auth().getUserByEmail(login); } catch { return {ok: true}; }
  const to = (await db().doc('accountPrivate/' + user.uid).get()).data()?.email;
  if (!to) return {ok: true};
  const link = await admin.auth().generatePasswordResetLink(login, {url: mail.SITE_URL});
  await send(to, mail.passwordReset(emailToNick(login) || nick, link));
  return {ok: true};
});
