/* 공통 다크/라이트 토글 — 모든 페이지에서 동일하게 동작 (localStorage 공유) */
(function () {
  var root = document.documentElement;
  var saved = localStorage.getItem('lf-theme');
  if (saved) root.setAttribute('data-theme', saved);
  function isDark() {
    var s = root.getAttribute('data-theme');
    return s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme:dark)').matches);
  }
  function sync() {
    document.querySelectorAll('.thm').forEach(function (b) { b.textContent = isDark() ? '☀️' : '🌙'; });
  }
  function bind() {
    sync();
    document.querySelectorAll('.thm').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', n);
        localStorage.setItem('lf-theme', n);
        sync();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
