/* Тексты писем. Чистые функции — их проверяют юнит-тесты без сети. */
const SITE_URL = 'https://demidius.github.io/english-skill-tree/';
const SITE_NAME = 'English File · Skill Tree';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function layout(title, paragraphs) {
  const text = [title, '', ...paragraphs.map(p => p.text), '', SITE_NAME + ' — ' + SITE_URL].join('\n');
  const html = '<div style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1c1c20;max-width:520px">'
    + '<h2 style="font:600 20px/1.3 Georgia,serif;margin:0 0 14px">' + esc(title) + '</h2>'
    + paragraphs.map(p => p.html || '<p style="margin:0 0 12px">' + esc(p.text) + '</p>').join('')
    + '<p style="margin:18px 0 0;color:#6b6b72;font-size:13px">' + esc(SITE_NAME)
    + ' — сайт для изучения английского по учебнику English File: правила, лексика и тесты с прогрессом на всех устройствах.<br>'
    + '<a href="' + SITE_URL + '">' + SITE_URL + '</a></p></div>';
  return {text, html};
}
const button = (url, label) => ({text: label + ': ' + url,
  html: '<p style="margin:16px 0"><a href="' + esc(url) + '" style="display:inline-block;background:#1c1c20;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px">' + esc(label) + '</a></p>'});

function welcome(nick, changed) {
  return {subject: changed ? 'Почта для восстановления изменена — ' + SITE_NAME : 'Почта привязана к аккаунту — ' + SITE_NAME,
    ...layout(changed ? 'Почта для восстановления изменена' : 'Почта привязана к аккаунту', [
      {text: 'Эта почта теперь привязана к аккаунту на сайте ' + SITE_NAME + '.'},
      {text: 'Ник для входа: ' + nick, html: '<p style="margin:0 0 12px">Ник для входа: <b>' + esc(nick) + '</b></p>'},
      {text: 'Пароль — тот, который ты задал при регистрации. Сайт хранит его только в зашифрованном виде и не может его прочитать или прислать. Если забудешь пароль, нажми «Забыл пароль» на странице входа — сюда придёт ссылка, чтобы задать новый. Если забудешь ник, нажми «Забыл ник».'},
      button(SITE_URL, 'Открыть сайт'),
      {text: 'Если ты не привязывал эту почту, просто проигнорируй письмо.'}
    ])};
}
function emailMoved(nick, newMasked) {
  return {subject: 'Почта аккаунта изменена — ' + SITE_NAME,
    ...layout('Почта аккаунта изменена', [
      {text: 'К аккаунту «' + nick + '» теперь привязана другая почта: ' + newMasked + '. Письма для восстановления больше не будут приходить сюда.'},
      {text: 'Если это сделал не ты, войди на сайт и верни свою почту в настройках аккаунта.'}
    ])};
}
function nickList(nicks) {
  return {subject: 'Твой ник — ' + SITE_NAME,
    ...layout(nicks.length > 1 ? 'Ники, привязанные к этой почте' : 'Твой ник для входа', [
      {text: nicks.join(', '), html: '<p style="margin:0 0 12px;font-size:18px"><b>' + nicks.map(esc).join('<br>') + '</b></p>'},
      button(SITE_URL, 'Войти на сайт'),
      {text: 'Если ты не запрашивал напоминание, просто проигнорируй письмо.'}
    ])};
}
function passwordReset(nick, link) {
  return {subject: 'Новый пароль — ' + SITE_NAME,
    ...layout('Задай новый пароль', [
      {text: 'Кто-то (надеемся, ты) запросил сброс пароля для ника «' + nick + '». Ссылка действует 1 час.'},
      button(link, 'Задать новый пароль'),
      {text: 'На странице сброса может быть показан технический адрес вида ник@users.skilltree.app — это нормально, это твой аккаунт.'},
      {text: 'Если ты не запрашивал сброс, ничего не делай — старый пароль продолжит работать.'}
    ])};
}
function mask(email) {
  const [u, d] = email.split('@');
  return (u.length <= 2 ? u[0] + '*' : u[0] + '***' + u[u.length - 1]) + '@' + d;
}
module.exports = {SITE_URL, welcome, emailMoved, nickList, passwordReset, mask};
