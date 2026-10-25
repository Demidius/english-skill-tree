/* Та же схема, что nickToEmail в firebase-config.js: ник → технический адрес Firebase Auth. */
const DOMAIN = '@users.skilltree.app';
function nickToEmail(nick) {
  const n = String(nick).trim().toLowerCase();
  if (/^[a-z0-9._-]+$/.test(n)) return n + DOMAIN;
  return 'x-' + Array.from(new TextEncoder().encode(n)).map(b => b.toString(16).padStart(2, '0')).join('') + DOMAIN;
}
function emailToNick(email) {
  if (!email || !email.endsWith(DOMAIN)) return null;
  const local = email.slice(0, -DOMAIN.length);
  if (!/^x-([0-9a-f]{2})+$/.test(local)) return local;
  // ASCII-ник может сам начинаться с «x-»: принимаем расшифровку, только если она кодируется обратно в тот же адрес.
  const decoded = new TextDecoder().decode(Uint8Array.from(local.slice(2).match(/../g), h => parseInt(h, 16)));
  return nickToEmail(decoded) === email ? decoded : local;
}
module.exports = {nickToEmail, emailToNick};
