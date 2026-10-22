// Масштаб таблицы-дерева («Правила» и «Лексика»): кнопки над таблицей, «Вся таблица»
// и Ctrl + колёсико (или щипок на тачпаде). Работает, пока таблица показана сеткой
// (компьютер, планшет); на телефоне видна одна ветка — там масштаб не нужен.
// Масштаб хранится в браузере отдельно для каждой таблицы (ef_zoom_mode-g / ef_zoom_mode-w).
// Меньше «Вся таблица» не уменьшается: самый мелкий масштаб — когда ширина таблицы равна экрану.
//
// Плавность: во время жеста таблица масштабируется через transform (видеокарта, без перестройки
// страницы), а настоящий CSS zoom применяется один раз, когда жест закончился. Положение после
// применения заранее рассчитано так же, как в предпросмотре, поэтому скачка нет.
// Пока таблица на экране, Ctrl + колёсико на всей странице масштабирует таблицу, а не браузер.
(function () {
  const MIN = 0.2, MAX = 1.5;
  const STEPS = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5];
  const BUTTON_MS = 180, NOTCH_MS = 120, IDLE_MS = 160;
  const done = new WeakSet(), controllers = [];
  const clampZ = k => Math.min(MAX, Math.max(MIN, Math.round(k * 1000) / 1000));
  const load = key => { try { return parseFloat(localStorage.getItem(key)); } catch (e) { return NaN; } };
  const store = (key, v) => { try { localStorage.setItem(key, v); } catch (e) {} };
  const closeTip = () => { if (typeof unpin === 'function') unpin(); };
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function setup(mode) {
    const scroller = mode.querySelector('.tree-scroll'), tree = scroller && scroller.querySelector('.tree');
    if (!tree || done.has(tree)) return;
    done.add(tree);
    const KEY = 'ef_zoom_' + mode.id;
    let k = clampZ(load(KEY) || 1), on = false, saveT = 0, pv = null;

    const bar = document.createElement('div');
    bar.className = 'tree-zoom'; bar.hidden = true;
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Масштаб таблицы');
    bar.innerHTML = '<span class="ctl-label">Масштаб</span>' +
      '<button type="button" class="chip" data-z="out" aria-label="Уменьшить таблицу">−</button>' +
      '<button type="button" class="chip tz-val" data-z="reset" title="Вернуть 100%">100%</button>' +
      '<button type="button" class="chip" data-z="in" aria-label="Увеличить таблицу">+</button>' +
      '<button type="button" class="chip" data-z="fit" title="Уменьшить так, чтобы все ветки поместились по ширине">Вся таблица</button>' +
      '<span class="tz-hint">Ctrl + колёсико — тоже масштаб</span>';
    const field = mode.querySelector('.study-search-field');
    if (field) {
      const row = document.createElement('div');
      row.className = 'study-search-row';
      field.closest('.study-search').classList.add('study-search-with-zoom');
      field.before(row);
      row.append(field, bar);
    } else {
      scroller.before(bar);
    }
    const val = bar.querySelector('.tz-val');

    const isGrid = () => !mode.hidden && getComputedStyle(tree).display === 'grid';
    // ширина таблицы при 100% и самый мелкий масштаб, при котором она ровно во всю ширину экрана
    function natWidth() { return pv ? pv.natW : tree.getBoundingClientRect().width / (parseFloat(tree.style.zoom) || 1); }
    function minK() { return Math.min(1, Math.max(MIN, Math.floor(scroller.clientWidth / natWidth() * 1000) / 1000)); }
    function show(v) {
      val.textContent = Math.round(v * 100) + '%';
      bar.querySelector('[data-z="out"]').disabled = !on || v <= minK() + 0.001;
      bar.querySelector('[data-z="in"]').disabled = v >= MAX;
    }
    function paint() { tree.style.zoom = on && k !== 1 ? String(k) : ''; show(k); }
    function save() { clearTimeout(saveT); saveT = setTimeout(() => store(KEY, String(k)), 250); }

    // ---- предпросмотр жеста ----
    function begin() {
      if (pv) return pv;
      const r = tree.getBoundingClientRect();
      pv = { k0: k, sl0: scroller.scrollLeft, wy0: scrollY, left0: r.left, top0: r.top,
             natW: r.width / k, natH: r.height / k, docH0: document.documentElement.scrollHeight,
             k: k, sl: scroller.scrollLeft, wy: scrollY, timer: 0 };
      tree.style.transformOrigin = '0 0';
      tree.style.willChange = 'transform';
      closeTip();
      return pv;
    }
    // nk — новый масштаб; (ax, ay) — точка экрана, которая остаётся на месте
    function zoomTo(nk, ax, ay, opt) {
      if (!on) return;
      opt = opt || {};
      const p = begin();
      nk = clamp(clampZ(nk), minK(), MAX);
      // где таблица была бы сейчас, если бы текущий предпросмотр уже применили
      const L = p.left0 + p.sl0 - p.sl, T = p.top0 + p.wy0 - p.wy;
      const s = scroller.getBoundingClientRect();
      ax = ax == null ? (Math.max(s.left, 0) + Math.min(s.right, innerWidth)) / 2 : clamp(ax, Math.max(s.left, L), Math.min(s.right, L + p.natW * p.k));
      ay = ay == null ? innerHeight / 2 : ay;
      ay = clamp(ay, Math.max(T, 0), Math.min(T + p.natH * p.k, innerHeight));
      const cx = (ax - L) / p.k, cy = (ay - T) / p.k;
      let sl = opt.toLeft ? 0 : p.sl0 + p.left0 - (ax - cx * nk);
      let wy = p.wy0 + p.top0 - (ay - cy * nk);
      // те же ограничения прокрутки, что будут после применения масштаба
      sl = clamp(sl, 0, Math.max(0, p.natW * nk - scroller.clientWidth));
      wy = clamp(wy, 0, Math.max(0, p.docH0 - p.natH * (p.k0 - nk) - innerHeight));
      p.k = nk; p.sl = sl; p.wy = wy; p.ax = ax; p.ay = ay;
      tree.style.transition = opt.ms ? 'transform ' + opt.ms + 'ms ease-out' : 'none';
      // длины в transform умножаются на zoom элемента — поэтому сдвиг делим на k0
      tree.style.transform = 'translate(' + ((p.sl0 - sl) / p.k0) + 'px,' + ((p.wy0 - wy) / p.k0) + 'px) scale(' + (nk / p.k0) + ')';
      show(nk);
      clearTimeout(p.timer);
      p.timer = setTimeout(commit, (opt.ms || 0) + IDLE_MS);
    }
    function commit() {
      const p = pv; if (!p) return;
      pv = null; clearTimeout(p.timer);
      // карточка под точкой масштабирования: после применения вернём её ровно туда, где она была
      // в предпросмотре (при мелком масштабе текст переносится чуть иначе, и расчёт может сместиться)
      const hit = p.ax != null && document.elementFromPoint(p.ax, p.ay);
      const anchor = hit && tree.contains(hit) ? hit.closest('.node, .cell, .bhead, .lvl-label') : null;
      const before = anchor && anchor.getBoundingClientRect();
      tree.style.transition = ''; tree.style.transform = ''; tree.style.transformOrigin = ''; tree.style.willChange = '';
      k = p.k; paint();
      scroller.scrollTo({ left: p.sl, behavior: 'instant' });
      window.scrollTo({ left: scrollX, top: p.wy, behavior: 'instant' });
      if (anchor) {
        const after = anchor.getBoundingClientRect();
        const dx = after.left - before.left, dy = after.top - before.top;
        if (Math.abs(dx) > 0.5) scroller.scrollTo({ left: scroller.scrollLeft + dx, behavior: 'instant' });
        if (Math.abs(dy) > 0.5) window.scrollTo({ left: scrollX, top: scrollY + dy, behavior: 'instant' });
      }
      if (k !== p.k0) save();
    }

    // сохранённый или текущий масштаб не может быть мельче «вся таблица по ширине экрана»
    // (например, после того как окно стало шире)
    function enforceMin() {
      if (!on || pv) return;
      const m = minK();
      if (k < m - 0.001) { k = m; paint(); save(); } else show(k);
    }
    function sync() {
      const was = on, now = isGrid();
      if (!now && pv) commit();
      on = now; bar.hidden = !on;
      if (on !== was) paint();
      enforceMin();
    }

    bar.addEventListener('click', ev => {
      const b = ev.target.closest('[data-z]'); if (!b || b.disabled || !on) return;
      const z = b.dataset.z, cur = pv ? pv.k : k;
      if (z === 'fit') return zoomTo(minK(), null, null, { ms: BUTTON_MS, toLeft: true });
      if (z === 'reset') return zoomTo(1, null, null, { ms: BUTTON_MS });
      const m = minK();
      zoomTo(z === 'in' ? (STEPS.find(x => x > cur + 0.001) || MAX) : Math.max(m, [...STEPS].reverse().find(x => x < cur - 0.001) || m), null, null, { ms: BUTTON_MS });
    });

    // Полоса веток прокручивает таблицу по offsetLeft, а он не учитывает масштаб.
    // При масштабе ≠ 100% считаем переход по экранным координатам сами.
    const jn = mode.querySelector('.jumpnav');
    if (jn) jn.addEventListener('click', ev => {
      const bt = ev.target.closest('button[data-key]');
      if (!bt || !on) return;
      if (pv) commit();
      if (k === 1) return;
      const h = tree.querySelector('.bhead[data-branch="' + bt.dataset.key + '"]'); if (!h) return;
      ev.stopPropagation();
      const lab = tree.querySelector('.lvl-label');
      const left = h.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
      scroller.scrollTo({ left: Math.max(0, left - (lab ? lab.getBoundingClientRect().width + 8 : 140)), behavior: 'smooth' });
    }, true);

    addEventListener('resize', sync);
    // режим (Правила/Лексика), вид таблицы слов, оформление и шрифт переключаются атрибутами
    new MutationObserver(sync).observe(mode, { attributes: true, attributeFilter: ['hidden'] });
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-wview', 'data-skin', 'data-fs'] });
    sync(); show(k);

    controllers.push({
      active: () => on,
      flush: () => { if (pv) commit(); },
      wheel(ev) {
        // колёсико мыши: шаг ~100 → плавный шаг ~18%; щипок тачпада: много мелких шагов без анимации
        let d = ev.deltaMode === 1 ? ev.deltaY * 33 : ev.deltaMode === 2 ? ev.deltaY * 400 : ev.deltaY;
        d = clamp(d, -150, 150);
        zoomTo((pv ? pv.k : k) * Math.exp(-d * 0.002), ev.clientX, ev.clientY, { ms: Math.abs(d) >= 40 ? NOTCH_MS : 0 });
      },
    });
  }

  // Одна точка входа для Ctrl + колёсико на всей странице: пока видна таблица, браузерный
  // масштаб не срабатывает (он остаётся на Ctrl + «+» / «−» и Ctrl + 0).
  document.addEventListener('wheel', ev => {
    const c = controllers.find(x => x.active());
    if (!c) return;
    if (!(ev.ctrlKey || ev.metaKey)) { c.flush(); return; }
    if (ev.target instanceof Element && ev.target.closest('.modal-back, #tip')) return;
    ev.preventDefault();
    c.wheel(ev);
  }, { passive: false });
  // любое другое действие во время жеста сначала применяет масштаб
  // (кроме кнопок масштаба и нажатия самого Ctrl — при удержании он повторяется)
  document.addEventListener('pointerdown', ev => {
    if (ev.target instanceof Element && ev.target.closest('.tree-zoom')) return;
    controllers.forEach(c => c.flush());
  }, true);
  document.addEventListener('keydown', ev => {
    if (['Control', 'Meta', 'Shift', 'Alt'].includes(ev.key)) return;
    controllers.forEach(c => c.flush());
  }, true);

  function scan() { document.querySelectorAll('.mode').forEach(setup); }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
