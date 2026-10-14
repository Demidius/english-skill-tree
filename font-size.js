// Настройка «Размер шрифта»: множитель --fs на <html>. Все размеры в CSS заданы в rem,
// поэтому меняется весь интерфейс. Выбор хранится в браузере (ef_fs).
(function () {
  const KEY = 'ef_fs';
  const SIZES = [
    { id: 's',  name: 'Мелкий',        k: 0.9 },
    { id: 'm',  name: 'Обычный',       k: 1 },
    { id: 'l',  name: 'Крупный',       k: 1.15 },
    { id: 'xl', name: 'Очень крупный', k: 1.3 },
  ];
  const de = document.documentElement;
  function get() { try { const v = localStorage.getItem(KEY); return SIZES.some(f => f.id === v) ? v : 'm'; } catch (e) { return 'm'; } }
  function apply(id) {
    const f = SIZES.find(x => x.id === id) || SIZES[1];
    if (f.k === 1) { de.style.removeProperty('--fs'); de.removeAttribute('data-fs'); }
    else { de.style.setProperty('--fs', String(f.k)); de.setAttribute('data-fs', f.id); }
    document.querySelectorAll('.fs-tile').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.fs === f.id)));
  }
  function set(id) { try { localStorage.setItem(KEY, id); } catch (e) {} apply(id); }

  // блок в «Настройках» — сразу после выбора оформления и вида таблицы слов
  function ensure() {
    const wrap = document.querySelector('#mode-s .set-wrap');
    if (!wrap || wrap.querySelector('.fs-pick')) return;
    const anchor = wrap.querySelector('.wview-pick') || wrap.querySelector('.skin-pick');
    if (!anchor) return; // ждём, пока themes.js добавит свои блоки
    const sec = document.createElement('section');
    sec.className = 'skin-pick fs-pick'; sec.setAttribute('aria-label', 'Размер шрифта');
    const cur = get();
    sec.innerHTML = '<h3 class="skin-h">Размер шрифта</h3><p class="skin-note">Меняет размер текста во всём интерфейсе. Выбор сохраняется на этом устройстве.</p><div class="skin-grid">' +
      SIZES.map(f => '<button type="button" class="skin-tile fs-tile" data-fs="' + f.id + '" aria-pressed="' + (f.id === cur) + '">' +
        '<span class="skin-prev fs-prev"><b style="font-size:' + (1.5 * f.k).toFixed(2) + 'rem">Aa</b></span>' +
        '<span class="skin-name">' + f.name + '</span><span class="skin-sub">' + Math.round(f.k * 100) + '%</span></button>').join('') +
      '</div>';
    sec.addEventListener('click', ev => { const t = ev.target.closest('.fs-tile'); if (t) set(t.dataset.fs); });
    anchor.after(sec);
  }

  apply(get());
  ensure();
  new MutationObserver(ensure).observe(document.body, { childList: true, subtree: true });
})();
