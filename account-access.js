/* Account visibility and mutual, read-only friendships. No directory of private users. */
window.ACCOUNT = (() => {
  let db, user, hooks, ready = false, isAdmin = false, mine = null, friends = new Map(), people = new Map();
  let stops = [], peers = new Map(), invitations = [], incoming = '', result = '', message = '', busy = false;
  let started = false, guest = false;
  const params = new URLSearchParams(location.search);
  const publicId = params.get('profile');
  incoming = params.get('friend') || '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stamp = () => firebase.firestore.FieldValue.serverTimestamp();
  function url(key, value) {
    const u = new URL('index.html', location.href); u.search = ''; u.hash = '';
    if (params.has('emulator') && ['localhost', '127.0.0.1'].includes(location.hostname)) u.searchParams.set('emulator', '1');
    u.searchParams.set(key, value); return u.href;
  }
  function emit() {
    const all = [...people.values()].sort((a,b) => a.id === user?.uid ? -1 : b.id === user?.uid ? 1 : a.name.localeCompare(b.name, 'ru'));
    hooks.onProfiles(all); render();
  }
  function denied(id) {
    if (id === user?.uid) return;
    people.delete(id); hooks.onDenied(id); emit();
  }
  function watchPeer(id) {
    if (peers.has(id) || id === user?.uid) return;
    peers.set(id, db.doc('profiles/' + id).onSnapshot(s => {
      if (!s.exists) { denied(id); return; }
      const p = s.data();
      people.set(id, {id, name:String(p.name || 'Без имени'), group:friends.has(id) ? 'friend' : 'public'}); emit();
    }, () => { denied(id); }));
  }
  async function start(options) {
    if (started) return; started = true;
    ({db, user, ...hooks} = options); guest = !user;
    stops.push(db.doc('system/access').onSnapshot(s => { ready = s.exists && s.data().version === 1; render(); }, () => { ready = false; render(); }));
    if (user) {
      stops.push(db.doc('accessAdmins/' + user.uid).onSnapshot(s => { isAdmin = s.exists; hooks.onRole?.(isAdmin); render(); }, () => { isAdmin = false; }));
      stops.push(db.doc('profiles/' + user.uid).onSnapshot(s => {
        if (!s.exists) return;
        mine = s.data(); people.set(user.uid, {id:user.uid, name:String(mine.name || 'Я'), group:'self'}); emit();
      }, () => { message = 'Не удалось загрузить свой профиль. Проверь соединение.'; render(); }));
      stops.push(db.collection('profiles/' + user.uid + '/friends').onSnapshot(q => {
        friends = new Map(q.docs.map(d => [d.id, d.data()]));
        for (const [id, stop] of peers) if (!friends.has(id) && id !== publicId) { stop(); peers.delete(id); people.delete(id); hooks.onDenied(id); }
        friends.forEach((_, id) => { const p=people.get(id); if(p) p.group='friend'; watchPeer(id); }); emit();
      }, () => { message = 'Не удалось загрузить список друзей.'; render(); }));
      stops.push(db.collection('friendInvites').where('ownerId', '==', user.uid).onSnapshot(q => {
        invitations = q.docs.map(d => ({id:d.id, ...d.data()}));
        if(result && !invitations.some(i=>i.id===result && i.status==='open' && i.expiresAt?.toMillis()>Date.now())) {
          message=invitations.some(i=>i.id===result && i.status==='accepted')?'Приглашение принято. Друг добавлен.':'Срок кода истёк или он отменён.';
          result='';
        }
        render();
      }, () => {}));
    }
    if (publicId && /^[\w-]{1,128}$/.test(publicId)) watchPeer(publicId);
    if (incoming && user) setTimeout(() => hooks.openSettings(), 0);
  }
  function mount(root) {
    const slot = document.createElement('div'); slot.id = 'accountSettings';
    root.prepend(slot); render();
  }
  function render() {
    const root = document.getElementById('accountSettings'); if (!root) return;
    if (!started || guest) {
      root.innerHTML = '<section class="access-card"><h2>Аккаунт и друзья</h2><p>Войди в аккаунт, чтобы управлять приватностью и обмениваться прогрессом с друзьями.</p><button class="m-btn" type="button" data-access="login">Войти</button></section>';
    } else {
      const pub = mine?.visibility === 'public';
      const active = invitations.filter(i => i.status === 'open' && i.expiresAt?.toMillis() > Date.now()).sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      root.innerHTML = '<div class="access-wrap"><section class="access-card"><h2>Видимость аккаунта</h2><p>По умолчанию профиль приватный. Друзья, которых ты добавишь, видят твой прогресс. Менять его можешь только ты и администратор.</p>' +
        (!ready ? '<p class="access-warning">Настройка доступа ещё не включена на сервере. Приглашения и публичный режим пока недоступны.</p>' : '') +
        '<label class="access-choice"><input type="radio" name="visibility" value="private" '+(!pub?'checked':'')+' '+(!ready?'disabled':'')+'> Приватный <small>Только я, друзья и администратор</small></label>' +
        '<label class="access-choice"><input type="radio" name="visibility" value="public" '+(pub?'checked':'')+' '+(!ready?'disabled':'')+'> Публичный <small>Любой человек по ссылке, без входа — только просмотр</small></label>' +
        (pub ? '<label class="access-field">Ссылка на мой профиль<input readonly value="'+esc(url('profile', user.uid))+'"></label><button type="button" class="m-btn ghost" data-access="public">Скопировать ссылку</button>' : '') +
        '</section><section class="access-card"><h2>Друзья <span>'+friends.size+'</span></h2><p>Приглашение даёт взаимный доступ: вы видите страницы друг друга, без права что-либо менять.</p>' +
        '<button type="button" class="m-btn" data-access="create" '+(!ready?'disabled':'')+'>Создать код дружбы</button><p class="access-note">Код одноразовый и действует 7 дней. Отправь его только тому, кого хочешь добавить.</p>' +
        (result ? '<label class="access-field">Ссылка-приглашение<input readonly id="friendResult" value="'+esc(url('friend',result))+'"></label><div class="access-result"><code>'+esc(result)+'</code><button type="button" class="m-btn ghost" data-access="copy">Копировать</button></div>' : '') +
        '<label class="access-field">Код или ссылка от друга<input id="friendCode" value="'+esc(incoming)+'" autocomplete="off" placeholder="Вставь приглашение"></label><button class="m-btn ghost" type="button" data-access="accept" '+(!ready?'disabled':'')+'>Принять приглашение…</button>' +
        '<div class="access-friends">'+[...friends.keys()].map(id => '<div class="access-person"><span>'+esc(people.get(id)?.name || 'Загрузка…')+'</span><button type="button" class="chip" data-access="view" data-id="'+esc(id)+'">Смотреть</button><button type="button" class="chip" data-access="remove" data-id="'+esc(id)+'">Убрать</button></div>').join('')+'</div>' +
        (active.length ? '<details class="access-invites"><summary>Действующие приглашения · '+active.length+'</summary>'+active.map(i=>'<div class="access-person"><code>'+esc(i.id.slice(0,8))+'…</code><button class="chip" type="button" data-access="copy-invite" data-id="'+i.id+'">Копировать</button><button class="chip" type="button" data-access="revoke" data-id="'+i.id+'">Отменить</button></div>').join('')+'</details>' : '') +
        '</section></div><p class="access-status" role="status">'+esc(message)+'</p>';
    }
    root.querySelectorAll('button, input').forEach(e => { if (busy) e.disabled=true; });
    root.onclick = e => { const b=e.target.closest('[data-access]'); if(b) action(b.dataset.access,b.dataset.id); };
    root.oninput = e => { if(e.target.id==='friendCode') incoming=e.target.value; };
    root.onchange = e => { if(e.target.name==='visibility') run(async () => {
      if (!ready) return;
      await db.doc('profiles/'+user.uid).update({visibility:e.target.value, updatedAt:Date.now()});
      message=e.target.value==='public'?'Публичный доступ включён.':'Профиль приватный. Друзья сохраняют доступ.';
    }); };
  }
  async function run(fn) {
    if(busy) return; busy=true; message=''; render();
    try { await fn(); } catch(e) { message=e.message?.startsWith('APP:')?e.message.slice(4):'Не удалось выполнить действие. Проверь соединение и попробуй ещё раз.'; }
    finally { busy=false; render(); }
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); message='Ссылка скопирована.'; }
    catch { message='Копирование недоступно. Выдели ссылку в поле и скопируй её.'; }
  }
  async function action(kind,id) {
    if(kind==='login'){ document.getElementById('goLogin').click(); return; }
    if(kind==='view'){ hooks.select(id); hooks.closeSettings(); return; }
    if(!ready || !user) return;
    await run(async () => {
      if(kind==='public') return copy(url('profile',user.uid));
      if(kind==='copy' || kind==='copy-invite') return copy(url('friend',id||result));
      if(kind==='create') {
        const bytes=crypto.getRandomValues(new Uint8Array(16));
        const token=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
        await db.doc('friendInvites/'+token).set({ownerId:user.uid,ownerName:mine.name,status:'open',createdAt:stamp(),expiresAt:firebase.firestore.Timestamp.fromMillis(Date.now()+7*86400000-60000)});
        result=token; message='Приглашение создано. Отправь другу ссылку или код.';
      }
      if(kind==='revoke') { await db.doc('friendInvites/'+id).update({status:'revoked'}); if(result===id) result=''; message='Код отменён.'; }
      if(kind==='remove') {
        if(!confirm('Прекратить дружбу? Вы оба потеряете доступ к приватным профилям друг друга.')) return;
        const b=db.batch(); b.delete(db.doc('profiles/'+user.uid+'/friends/'+id)); b.delete(db.doc('profiles/'+id+'/friends/'+user.uid)); await b.commit();
        message='Дружба прекращена. Публичные профили по-прежнему доступны по ссылке.';
      }
      if(kind==='accept') {
        let token=incoming.trim().toLowerCase();
        try { token=new URL(incoming.trim()).searchParams.get('friend') || ''; } catch {}
        if(!/^[a-f0-9]{32}$/.test(token)) throw Error('APP:Вставь полный код дружбы или ссылку-приглашение.');
        const ref=db.doc('friendInvites/'+token);
        let snap; try { snap=await ref.get({source:'server'}); } catch { throw Error('APP:Код недействителен, уже использован, отменён или истёк.'); }
        const invitation=snap.data();
        if(!invitation || invitation.status!=='open' || invitation.expiresAt.toMillis()<=Date.now()) throw Error('APP:Код недействителен или истёк.');
        if(invitation.ownerId===user.uid) throw Error('APP:Это твой код. Отправь его другу.');
        if(friends.has(invitation.ownerId)) throw Error('APP:Вы уже друзья.');
        if(!confirm('Добавить «'+invitation.ownerName+'»? Вы оба сможете смотреть прогресс друг друга, без редактирования.')) return;
        await db.runTransaction(async tx => {
          const latest=await tx.get(ref), v=latest.data();
          if(!v || v.status!=='open' || v.ownerId!==invitation.ownerId) throw Error('APP:Приглашение уже использовано или отменено.');
          tx.update(ref,{status:'accepted',acceptedBy:user.uid,acceptedAt:stamp()});
          const edge={inviteId:token,createdAt:stamp()};
          tx.set(db.doc('profiles/'+user.uid+'/friends/'+v.ownerId),edge);
          tx.set(db.doc('profiles/'+v.ownerId+'/friends/'+user.uid),edge);
        });
        incoming=''; const u=new URL(location.href); u.searchParams.delete('friend'); history.replaceState(null,'',u); message='Друг добавлен. Выбери его в меню аккаунта, чтобы посмотреть прогресс.';
      }
    });
  }
  return {start,mount,render,denied,get isAdmin(){return isAdmin;},get publicId(){return publicId;},get hasInvite(){return !!incoming;}};
})();
