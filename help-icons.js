// Значки подсказок: «?» вместо «i» — у тем, веток и блоков «Отработка» / «Повторение».
// Значки создают app.js и extras.js (в том числе при каждой перерисовке), поэтому следим за DOM.
(function () {
  function swap() {
    document.querySelectorAll('.info, .rv-info').forEach(function (e) {
      if (e.textContent === 'i') e.textContent = '?';
    });
  }
  swap();
  new MutationObserver(swap).observe(document.body, { childList: true, subtree: true });
})();
