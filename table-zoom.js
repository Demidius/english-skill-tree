// Масштаб таблицы-дерева («Правила» и «Лексика»): кнопки над таблицей, «Вся таблица»
// и Ctrl + колёсико (или щипок на тачпаде) над таблицей. Работает, пока таблица показана
// сеткой (компьютер, планшет); на телефоне видна одна ветка — там масштаб не нужен.
// Масштаб хранится в браузере отдельно для каждой таблицы (ef_zoom_mode-g / ef_zoom_mode-w).
(function () {
  const MIN = 0.2, MAX = 1.5;
  const STEPS = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5];
  const done = new WeakSet();
  const clampZ = k => Math.min(MAX, Math.max(MIN, Math.round(k * 100) / 100));
  const load = key => { try { return parseFloat(localStorage.getItem(key)); } catch (e) { return NaN; } };
  const store = (key, v) => { try { localStorage.setItem(key, v); } catch (e) {} };
  const closeTip = () => { if (typeof unpin === 'function') unpin(); };

  function setup(mode) {
    const scroller = mode.querySelector('.tree-scroll'), tree = scroller && scroller.querySelector('.tree');
    if (!tree || done.has(tree)) return;
    done.add(tree);
    const KEY = 'ef_zoom_' + mode.id;
    let k = clampZ(load(KEY) || 1), on = false, saveT = 0;

    const bar = document.createElement('div');
    bar.className = 'tree-zoom'; bar.hidden = true;
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Масштаб таблицы');
    bar.innerHTML = '<span class="ctl-label">Масштаб</span>' +
      '<button type="button" class="chip" data-z="out" aria-label="Уменьшить таблицу">−</button>' +
      '<button type="button" class="chip tz-val" data-z="reset" title="Вернуть 100%">100%</button>' +
      '<button type="button" class="chip" data-z="in" aria-label="Увеличить таблицу">+</button>' +
      '<button type="button" class="chip" data-z="fit" title="Уменьшить так, чтобы все ветки поместились по ширине">Вся таблица</button>' +
      '<span class="tz-hint">Ctrl + колёсико над таблицей — тоже масштаб</span>';
    scroller.before(bar);
    const val = bar.querySelector('.tz-val');

    const isGrid = () => !mode.hidden && getComputedStyle(tree).display === 'grid';
    function show() {
      val.textContent = Math.round(k * 100) + '%';
      bar.querySelector('[data-z="out"]').disabled = k <= MIN;
      bar.querySelector('[data-z="in"]').disabled = k >= MAX;
    }
    function paint() { tree.style.zoom = on && k !== 1 ? String(k) : ''; show(); }
    function save() { clearTimeout(saveT); saveT = setTimeout(() => store(KEY, String(k)), 250); }
    // точка (ax, ay) на экране остаётся на месте: под курсором или в центре видимой части таблицы
    function setZoom(nk, ax, ay) {
      nk = clampZ(nk); if (!on || nk === k) return;
      const r = tree.getBoundingClientRect(), s = scroller.getBoundingClientRect();
      if (ax == null) ax = (Math.max(s.left, 0) + Math.min(s.right, innerWidth)) / 2;
      if (ay == null) ay = Math.min(Math.max(innerHeight / 2, r.top), r.bottom);
      const cx = (ax - r.left) / k, cy = (ay - r.top) / k;
      k = nk; paint(); closeTip();
      const r2 = tree.getBoundingClientRect();
      scroller.scrollLeft += r2.left + cx * k - ax;
      window.scrollBy(0, r2.top + cy * k - ay);
      save();
    }
    function fit() {
      if (!on) return;
      const natural = tree.getBoundingClientRect().width / k;
      k = clampZ(Math.min(1, Math.floor(scroller.clientWidth / natural * 100) / 100));
      paint(); closeTip(); scroller.scrollLeft = 0; save();
    }
    function sync() {
      const was = on; on = isGrid();
      bar.hidden = !on;
      if (on !== was) paint();
    }

    bar.addEventListener('click', ev => {
      const b = ev.target.closest('[data-z]'); if (!b || b.disabled) return;
      const z = b.dataset.z;
      if (z === 'fit') return fit();
      if (z === 'reset') return setZoom(1);
      setZoom(z === 'in' ? (STEPS.find(x => x > k + 0.001) || MAX) : ([...STEPS].reverse().find(x => x < k - 0.001) || MIN));
    });
    scroller.addEventListener('wheel', ev => {
      if (!on || !(ev.ctrlKey || ev.metaKey)) return;
      ev.preventDefault();
      setZoom(k * Math.exp(-ev.deltaY * (ev.deltaMode === 1 ? 0.05 : 0.002)), ev.clientX, ev.clientY);
    }, { passive: false });

    // Полоса веток прокручивает таблицу по offsetLeft, а он не учитывает масштаб.
    // При масштабе ≠ 100% считаем переход по экранным координатам сами.
    const jn = mode.querySelector('.jumpnav');
    if (jn) jn.addEventListener('click', ev => {
      const bt = ev.target.closest('button[data-key]');
      if (!bt || !on || k === 1) return;
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
    sync(); show();
  }

  function scan() { document.querySelectorAll('.mode').forEach(setup); }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
