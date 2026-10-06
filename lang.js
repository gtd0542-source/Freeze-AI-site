// FR / EN switch of frezzai.app: the choice is remembered (cookie "frezz-lang", 1 year) and then wins over the
// visitor's country (middleware.ts). A preference the visitor sets themselves: no consent needed.
(function () {
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-set-lang]');
    if (!link) return;
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = 'frezz-lang=' + link.getAttribute('data-set-lang') + '; Max-Age=31536000; Path=/; SameSite=Lax' + secure;
  });
})();
