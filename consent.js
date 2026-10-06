// Choix de cookies de frezzai.app (recommandations CNIL) :
// - aucun traceur non nécessaire avant l'accord : les scripts concernés sont écrits <script type="text/plain"
//   data-consent="ads"> et ne s'exécutent qu'après « Tout accepter » (ou la case cochée dans « Personnaliser ») ;
// - « Tout refuser » est aussi visible et aussi simple que « Tout accepter » ;
// - le choix est gardé 6 mois, puis redemandé ;
// - retrait à tout moment, aussi simple que l'accord : « Gérer mes cookies » dans le pied de page.
// Seul traceur soumis à l'accord : le pixel publicitaire Whop. Les statistiques Vercel (anonymes, sans cookie) et la
// mémorisation de ce choix (stockage local « frezz-consent ») n'en dépendent pas.
(function () {
  var KEY = 'frezz-consent';
  var VERSION = 1;
  var MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000; // 6 mois
  var AD_COOKIES = ['_wuid', '_wuid_link'];
  var AD_STORAGE = /^_w(uid|sc|fp)/; // _wuid, _wuid_link_domain, _wsc, _wsc_probed(_at), _wfp

  function read() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!saved || saved.v !== VERSION || typeof saved.at !== 'number' || Date.now() - saved.at > MAX_AGE_MS) return null;
      return saved;
    } catch (error) {
      return null;
    }
  }

  function save(ads) {
    var choice = { v: VERSION, ads: Boolean(ads), at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (error) { /* navigation privée : choix pour cette page */ }
    return choice;
  }

  var adsRunning = false;
  /** Runs the blocked scripts, once: from here on the pixel works as if it had been in the page. */
  function runAds() {
    if (adsRunning) return;
    adsRunning = true;
    var blocked = document.querySelectorAll('script[type="text/plain"][data-consent="ads"]');
    for (var i = 0; i < blocked.length; i++) {
      var script = document.createElement('script');
      script.text = blocked[i].text;
      blocked[i].parentNode.insertBefore(script, blocked[i].nextSibling);
    }
  }

  /** Consent withdrawn: the advertising cookies and storage go. */
  function clearAds() {
    var host = location.hostname;
    var base = host.split('.').slice(-2).join('.');
    AD_COOKIES.forEach(function (name) {
      document.cookie = name + '=; Max-Age=0; path=/';
      [host, '.' + host, base, '.' + base].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + domain;
      });
    });
    [window.localStorage, window.sessionStorage].forEach(function (store) {
      try {
        Object.keys(store).forEach(function (key) { if (AD_STORAGE.test(key)) store.removeItem(key); });
      } catch (error) { /* stockage indisponible */ }
    });
  }

  var banner = null;

  function build() {
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-text');
    banner.innerHTML =
      '<h2 id="consent-title">Tes choix de cookies</h2>' +
      '<p id="consent-text">Nos statistiques de visite sont anonymes et sans cookie. Avec ton accord, nous ajoutons le pixel ' +
      'publicitaire de Whop pour savoir quelles publicités t’amènent ici : il dépose des cookies et calcule une empreinte ' +
      'de ton navigateur. Tu peux changer d’avis à tout moment. <a href="cookies.html">En savoir plus</a></p>' +
      '<div class="consent-details" id="consent-details" hidden>' +
      '<div class="consent-row"><span><b>Nécessaire</b><small>Mémoriser ton choix pendant 6 mois. Toujours actif.</small></span>' +
      '<input type="checkbox" checked disabled aria-label="Nécessaire, toujours actif"></div>' +
      '<label class="consent-row" for="consent-ads"><span><b>Mesure publicitaire (Whop)</b><small>Cookies _wuid, empreinte du navigateur. ' +
      'Whop, États-Unis.</small></span><input type="checkbox" id="consent-ads"></label>' +
      '</div>' +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-btn" data-choice="refuse">Tout refuser</button>' +
      '<button type="button" class="consent-btn" data-choice="accept">Tout accepter</button>' +
      '</div>' +
      '<div class="consent-more-row">' +
      '<button type="button" class="consent-link" data-choice="details" aria-expanded="false" aria-controls="consent-details">Personnaliser mes choix</button>' +
      '<button type="button" class="consent-btn consent-save" data-choice="save" hidden>Enregistrer mes choix</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (event) {
      var target = event.target.closest('[data-choice]');
      if (!target) return;
      var action = target.getAttribute('data-choice');
      if (action === 'accept') decide(true);
      else if (action === 'refuse') decide(false);
      else if (action === 'save') decide(banner.querySelector('#consent-ads').checked);
      else if (action === 'details') showDetails(true);
    });
  }

  function showDetails(open) {
    banner.querySelector('#consent-details').hidden = !open;
    banner.querySelector('.consent-save').hidden = !open;
    var toggle = banner.querySelector('[data-choice="details"]');
    toggle.hidden = open;
    toggle.setAttribute('aria-expanded', String(open));
  }

  function open(fromUser) {
    if (!banner) build();
    var current = read();
    banner.querySelector('#consent-ads').checked = Boolean(current && current.ads);
    showDetails(Boolean(fromUser));
    banner.classList.add('open');
    if (fromUser) banner.querySelector('[data-choice="refuse"]').focus();
  }

  function decide(ads) {
    save(ads);
    if (banner) banner.classList.remove('open');
    if (ads) {
      runAds();
      return;
    }
    clearAds();
    // The pixel already ran on this page: reload it without the pixel.
    if (adsRunning) location.reload();
  }

  function init() {
    var choice = read();
    if (choice && choice.ads) runAds();
    if (!choice) open(false);
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-consent-manage]');
      if (!link) return;
      event.preventDefault();
      open(true);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
