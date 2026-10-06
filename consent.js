// Choix de cookies de frezzai.app (recommandations CNIL) :
// - aucun traceur non nécessaire avant l'accord : les scripts concernés sont écrits <script type="text/plain"
//   data-consent="ads"> et ne s'exécutent qu'après « Tout accepter » (ou la case cochée dans « Personnaliser ») ;
// - « Tout refuser » / « Reject all » est aussi visible et aussi simple que « Tout accepter » / « Accept all » ;
// - textes en anglais par défaut, en français sur les pages /fr/ ;
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

  var TEXT = {
    en: {
      title: 'Your cookie choices',
      text: 'Our visit statistics are anonymous and cookie-free. With your consent, we add Whop’s advertising pixel to learn which ads bring you here: it sets cookies and computes a fingerprint of your browser. You can change your mind at any time.',
      more: 'Learn more', cookiesPage: '/cookies.html',
      necessary: 'Necessary', necessaryHint: 'Remembers your choice for 6 months. Always on.', necessaryLabel: 'Necessary, always on',
      ads: 'Advertising measurement (Whop)', adsHint: '_wuid cookies, browser fingerprint. Whop, United States.',
      refuse: 'Reject all', accept: 'Accept all', customize: 'Customize my choices', save: 'Save my choices',
    },
    fr: {
      title: 'Tes choix de cookies',
      text: 'Nos statistiques de visite sont anonymes et sans cookie. Avec ton accord, nous ajoutons le pixel publicitaire de Whop pour savoir quelles publicités t’amènent ici : il dépose des cookies et calcule une empreinte de ton navigateur. Tu peux changer d’avis à tout moment.',
      more: 'En savoir plus', cookiesPage: '/fr/cookies.html',
      necessary: 'Nécessaire', necessaryHint: 'Mémoriser ton choix pendant 6 mois. Toujours actif.', necessaryLabel: 'Nécessaire, toujours actif',
      ads: 'Mesure publicitaire (Whop)', adsHint: 'Cookies _wuid, empreinte du navigateur. Whop, États-Unis.',
      refuse: 'Tout refuser', accept: 'Tout accepter', customize: 'Personnaliser mes choix', save: 'Enregistrer mes choix',
    },
  };

  var banner = null;

  function build() {
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-text');
    var t = TEXT[document.documentElement.lang === 'fr' ? 'fr' : 'en'];
    banner.innerHTML =
      '<h2 id="consent-title">' + t.title + '</h2>' +
      '<p id="consent-text">' + t.text + ' <a href="' + t.cookiesPage + '">' + t.more + '</a></p>' +
      '<div class="consent-details" id="consent-details" hidden>' +
      '<div class="consent-row"><span><b>' + t.necessary + '</b><small>' + t.necessaryHint + '</small></span>' +
      '<input type="checkbox" checked disabled aria-label="' + t.necessaryLabel + '"></div>' +
      '<label class="consent-row" for="consent-ads"><span><b>' + t.ads + '</b><small>' + t.adsHint + '</small></span>' +
      '<input type="checkbox" id="consent-ads"></label>' +
      '</div>' +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-btn" data-choice="refuse">' + t.refuse + '</button>' +
      '<button type="button" class="consent-btn" data-choice="accept">' + t.accept + '</button>' +
      '</div>' +
      '<div class="consent-more-row">' +
      '<button type="button" class="consent-link" data-choice="details" aria-expanded="false" aria-controls="consent-details">' + t.customize + '</button>' +
      '<button type="button" class="consent-btn consent-save" data-choice="save" hidden>' + t.save + '</button>' +
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
