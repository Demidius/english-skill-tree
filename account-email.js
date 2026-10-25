/* Почта для восстановления: запрос при входе, раздел в настройках, «Забыл пароль» / «Забыл ник».
 * Письма отправляют Cloud Functions (functions/index.js); пароль никуда не пересылается. */
window.RECOVERY = (() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
  const LATER = 'ef_email_later';
  let db = null, user = null, state = null, draft = '', editing = false, busy = false, note = '', noteBad = false, stop = null;

  function errText(e) {
    const c = String(e && e.code || '').replace(/^functions\//, '');
    if (e && e.message && ['invalid-argument', 'resource-exhausted', 'unauthenticated'].includes(c)) return e.message;
    if (['not-found', 'unavailable', 'internal'].includes(c) && !navigator.onLine) return 'Нет связи с сервером. Проверь интернет.';
    if (c === 'not-found' || c === 'unavailable') return 'Отправка писем пока не настроена на сервере. Попробуй позже.';
    return 'Не удалось отправить письмо. Попробуй ещё раз чуть позже.';
  }
  const call = (name, data) => SkillFirebase.callable(name)(data);
  async function saveEmail(email) {
    const v = email.trim();
    if (!EMAIL_RE.test(v)) throw {code: 'invalid-argument', message: 'Проверь адрес почты.'};
    await call('setRecoveryEmail', {email: v});
  }
  const optOut = () => db.doc('accountPrivate/' + user.uid).set({emailOptOut: true, optOutAt: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});

  // ---------- экран входа: «Забыл пароль» / «Забыл ник» ----------
  let mode = 'pass';
  function openRecover(kind) {
    mode = kind;
    const pass = kind === 'pass';
    $('recoverTitle').textContent = pass ? 'Забыл пароль' : 'Забыл ник';
    $('recoverSub').textContent = pass
      ? 'Введи ник. Если к нему привязана почта, мы пришлём на неё ссылку, чтобы задать новый пароль.'
      : 'Введи почту, которую привязывал к аккаунту. Мы пришлём на неё твой ник.';
    $('recoverLabel').firstChild.textContent = pass ? 'Ник' : 'Почта';
    const inp = $('recoverInput');
    inp.type = pass ? 'text' : 'email'; inp.autocomplete = pass ? 'username' : 'email';
    inp.placeholder = pass ? 'например, demid' : 'name@example.com';
    inp.value = pass ? $('authNick').value.trim() : '';
    $('recoverErr').hidden = $('recoverOk').hidden = true;
    $('recoverSend').disabled = false;
    $('authForm').hidden = true; $('recoverForm').hidden = false;
    setTimeout(() => inp.focus(), 30);
  }
  function closeRecover() { $('recoverForm').hidden = true; $('authForm').hidden = false; }
  async function sendRecover(ev) {
    ev.preventDefault();
    const v = $('recoverInput').value.trim(), err = $('recoverErr'), ok = $('recoverOk'), btn = $('recoverSend');
    err.hidden = ok.hidden = true;
    if (mode === 'pass' && (v.length < 2 || /[\s@]/.test(v))) { err.textContent = 'Введи ник, без пробелов и @.'; err.hidden = false; return; }
    if (mode === 'nick' && !EMAIL_RE.test(v)) { err.textContent = 'Проверь адрес почты.'; err.hidden = false; return; }
    btn.disabled = true;
    try {
      await call(mode === 'pass' ? 'sendPasswordReset' : 'recoverNick', mode === 'pass' ? {nick: v} : {email: v});
      ok.textContent = mode === 'pass'
        ? 'Готово. Если к этому нику привязана почта, письмо со ссылкой уже в пути. Проверь и папку «Спам». Если письма нет, значит почта к нику не привязана.'
        : 'Готово. Если эта почта привязана к аккаунту, письмо с ником уже в пути. Проверь и папку «Спам».';
      ok.hidden = false;
    } catch (e) { err.textContent = errText(e); err.hidden = false; btn.disabled = false; }
  }

  // ---------- запрос почты при входе ----------
  function laterThisSession() { try { return sessionStorage.getItem(LATER) === user.uid; } catch { return false; } }
  function maybePrompt() {
    if (!state || state.email || state.emailOptOut || laterThisSession() || !$('emailPrompt').hidden) return;
    if (!$('authBox').hidden) return;
    $('emailPromptErr').hidden = true;
    $('emailPrompt').hidden = false;
    setTimeout(() => $('emailPromptInput').focus(), 50);
  }
  function syncPrompt() {
    const off = $('emailPromptOptOut').checked;
    $('emailPromptInput').disabled = off;
    $('emailPromptWarn').hidden = !off;
    $('emailPromptSave').textContent = off ? 'Продолжить без почты' : 'Сохранить почту';
  }
  async function submitPrompt(ev) {
    ev.preventDefault();
    const err = $('emailPromptErr'), btns = [$('emailPromptSave'), $('emailPromptLater')];
    err.hidden = true; btns.forEach(b => b.disabled = true);
    try {
      if ($('emailPromptOptOut').checked) await optOut();
      else { await saveEmail($('emailPromptInput').value); note = 'Почта привязана. Мы отправили на неё письмо с ником.'; noteBad = false; }
      $('emailPrompt').hidden = true;
    } catch (e) { err.textContent = e.code === 'invalid-argument' ? (e.message || 'Проверь адрес почты.') : e.code ? errText(e) : 'Не удалось сохранить. Проверь соединение.'; err.hidden = false; }
    finally { btns.forEach(b => b.disabled = false); }
  }

  // ---------- раздел в настройках аккаунта ----------
  function renderCard(root) {
    if (!root || !user) return;
    const has = !!(state && state.email);
    const form = editing || (!has && state);
    root.innerHTML = '<h2>Почта для восстановления</h2>' +
      '<p>Нужна, чтобы восстановить пароль или ник, если забудешь. Видишь её только ты. Других писем не будет.</p>' +
      (!state ? '<p class="access-note">Загрузка…</p>'
        : has && !editing ? '<div class="access-person"><span>' + esc(state.email) + '</span><button type="button" class="chip" data-rec="edit">Изменить</button></div>'
        : (state.emailOptOut && !editing ? '<p class="access-note">Ты отказался указывать почту. Без неё забытый пароль восстановить не получится.</p>' : '')) +
      (form ? '<label class="access-field">' + (has ? 'Новая почта' : 'Почта') + '<input type="email" id="recEmail" autocomplete="email" maxlength="254" placeholder="name@example.com" value="' + esc(draft) + '"></label>' +
        '<div class="access-row"><button type="button" class="m-btn" data-rec="save">' + (has ? 'Сохранить новую почту' : 'Привязать почту') + '</button>' +
        (editing ? '<button type="button" class="m-btn ghost" data-rec="cancel">Отмена</button>' : '') + '</div>' +
        '<p class="access-note">На этот адрес придёт письмо с твоим ником' + (has ? ', а на старый — уведомление о смене' : '') + '.</p>' : '') +
      (note ? '<p class="access-status' + (noteBad ? ' bad' : '') + '" role="status">' + esc(note) + '</p>' : '');
    root.querySelectorAll('button,input').forEach(e => { if (busy) e.disabled = true; });
    root.oninput = e => { if (e.target.id === 'recEmail') draft = e.target.value; };
    root.onkeydown = e => { if (e.target.id === 'recEmail' && e.key === 'Enter') { e.preventDefault(); act('save'); } };
    root.onclick = e => { const b = e.target.closest('[data-rec]'); if (b) act(b.dataset.rec); };
  }
  const rerender = () => renderCard($('recoveryCard'));
  async function act(kind) {
    if (kind === 'edit') { editing = true; draft = ''; note = ''; rerender(); setTimeout(() => $('recEmail')?.focus(), 30); return; }
    if (kind === 'cancel') { editing = false; note = ''; rerender(); return; }
    if (kind !== 'save' || busy) return;
    busy = true; note = ''; rerender();
    try { await saveEmail(draft); editing = false; draft = ''; note = 'Почта сохранена. Мы отправили на неё письмо с ником.'; noteBad = false; }
    catch (e) { note = e.code === 'invalid-argument' ? (e.message || 'Проверь адрес почты.') : errText(e); noteBad = true; }
    finally { busy = false; rerender(); }
  }

  function start(options) {
    ({db, user} = options);
    if (!user || stop) return;
    stop = db.doc('accountPrivate/' + user.uid).onSnapshot(s => {
      state = s.exists ? s.data() : {};
      rerender(); maybePrompt();
    }, () => { state = null; });
  }

  (function bind() {
    $('authForm').querySelectorAll('[data-recover]').forEach(b => b.addEventListener('click', () => openRecover(b.dataset.recover)));
    $('recoverForm').addEventListener('submit', sendRecover);
    $('recoverBack').addEventListener('click', closeRecover);
    $('emailPromptForm').addEventListener('submit', submitPrompt);
    $('emailPromptOptOut').addEventListener('change', syncPrompt);
    // При каждом новом показе экрана входа начинаем с формы входа, а не с восстановления.
    new MutationObserver(() => { if (!$('authBox').hidden) closeRecover(); }).observe($('authBox'), {attributes: true, attributeFilter: ['hidden']});
    $('emailPromptLater').addEventListener('click', () => { try { sessionStorage.setItem(LATER, user.uid); } catch {} $('emailPrompt').hidden = true; });
  })();
  return {start, renderCard};
})();
