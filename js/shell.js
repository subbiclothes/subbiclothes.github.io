/* ── Subbi Clothes — Shell ──────────────────────────────────────
   Injects the shared nav + footer into every public page.
   Pages configure themselves with a <meta name="shell-*"> tag.
   Lang switching: shell handles nav/footer, then calls window.setLang()
   for page-specific content if it exists.
──────────────────────────────────────────────────────────────── */

(function () {

  /* ── Strings ── */
  const S = {
    en: {
      home:    'Home',
      guide:   'Guide',
      faq:     'FAQ',
      editor:  'Config Editor',
      mp:      'Marketplace',

      footer_contact: 'Questions? Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life.',
      footer_version: 'Latest release: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 DEV: Early access',
    },
    es: {
      home:    'Inicio',
      guide:   'Guía',
      faq:     'FAQ',
      editor:  'Editor de Config',
      mp:      'Marketplace',
      footer_contact: '¿Preguntas? Escribe a <strong>Souwind</strong> o <strong>Aratx</strong> en Second Life.',
      footer_version: 'Última versión: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 DEV: acceso anticipado',
    }
  };

  /* ── Logo ── */
  const LOGO_IMG = `<img src="/img/subbiclothes_logo.png" width="34" height="34" alt="" aria-hidden="true">`;

  /* ── Read page meta config ── */
  function meta(name, fallback) {
    return document.querySelector('meta[name="' + name + '"]')?.content ?? fallback;
  }

  /* Logo subtitle is page-specific text (e.g. "Official Guide"), so it can't
     live in the shared S.en/S.es tables above — each page provides both
     language variants via <meta name="shell-logo-sub-en/es">. */
  var LOGO_SUB = {
    en: meta('shell-logo-sub-en', "Second Life's RLV Wardrobe"),
    es: meta('shell-logo-sub-es', "Guardarropa RLV de Second Life")
  };

  /* ── Build nav HTML ── */
  function buildNav(logoSub) {
    return `
<nav class="site-nav" id="shell-nav">
  <div class="nav-inner">
    <a href="/" class="site-logo">
      <div class="logo-icon">${LOGO_IMG}</div>
      <div class="logo-wordmark">
        <b>SUBBI</b><span class="logo-pink">CLOTHES</span>
        <span class="logo-sub">${logoSub}</span>
      </div>
    </a>
    <div class="nav-links">
      <a href="/" data-si="home">Home</a>
      <a href="/guide/" data-si="guide">Guide</a>
      <a href="/faq/" data-si="faq">FAQ</a>
      <a href="/outfit-config-editor/" data-si="editor">Config Editor</a>
      <a href="/r/mp" class="nav-cta"><span data-si="mp">Marketplace</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </div>
    <div class="nav-right">
      <div class="lang-switcher">
        <button data-lang="en" onclick="window.__shell.setLang('en')">EN</button>
        <button data-lang="es" onclick="window.__shell.setLang('es')">ES</button>
      </div>
      <button class="nav-hamburger" id="nav-hamburger" onclick="window.__shell.toggleMobile()" aria-label="Menu" aria-expanded="false">
        <i class="fa-solid fa-bars" id="nav-hamburger-icon"></i>
      </button>
    </div>
  </div>
  <div class="nav-mobile" id="nav-mobile" aria-hidden="true">
    <a href="/" data-si="home" onclick="window.__shell.closeMobile()">Home</a>
    <a href="/guide/" data-si="guide" onclick="window.__shell.closeMobile()">Guide</a>
    <a href="/faq/" data-si="faq" onclick="window.__shell.closeMobile()">FAQ</a>
    <a href="/outfit-config-editor/" data-si="editor" onclick="window.__shell.closeMobile()">Config Editor</a>
    <a href="/r/mp" class="nav-cta" onclick="window.__shell.closeMobile()"><span data-si="mp">Marketplace</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
  </div>
</nav>`;
  }

  /* ── Build footer HTML ── */
  function buildFooter() {
    return `
<footer class="site-footer" id="shell-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">SUBBI<span>CLOTHES</span></div>
      <nav class="footer-nav">
        <a href="/r/mp"                data-si="mp">Marketplace</a>
        <a href="/guide/"              data-si="guide">Guide</a>
        <a href="/faq/"                data-si="faq">FAQ</a>
        <a href="/outfit-config-editor/" data-si="editor">Config Editor</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <p data-si-html="footer_contact">Questions? Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life.</p>
      <p class="footer-version" data-si-html="footer_version">Latest release: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 DEV: Early access</p>
    </div>
  </div>
</footer>`;
  }

  /* ── Inject ── */
  document.body.insertAdjacentHTML('afterbegin', buildNav(LOGO_SUB.en));
  document.body.insertAdjacentHTML('beforeend',  buildFooter());

  /* ── Mobile menu ── */
  function getMobileEl() { return document.getElementById('nav-mobile'); }
  function getHamburger() { return document.getElementById('nav-hamburger'); }

  /* ── Lang ── */
  window.__shell = {
    toggleMobile: function () {
      var m = getMobileEl(), btn = getHamburger();
      if (!m) return;
      var open = m.classList.toggle('open');
      if (btn) {
        btn.setAttribute('aria-expanded', open);
        btn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
      m.setAttribute('aria-hidden', !open);
    },
    closeMobile: function () {
      var m = getMobileEl(), btn = getHamburger();
      if (!m) return;
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('i').className = 'fa-solid fa-bars';
      }
    },
    setLang: function (lang) {
      if (!S[lang]) lang = 'en';
      var s = S[lang];

      document.documentElement.lang = lang;
      try { localStorage.setItem('site_lang', lang); } catch(e) {}

      var logoSubEl = document.querySelector('.logo-sub');
      if (logoSubEl) logoSubEl.textContent = LOGO_SUB[lang] || LOGO_SUB.en;

      /* nav + footer text */
      document.querySelectorAll('[data-si]').forEach(function (el) {
        var key = el.dataset.si;
        if (s[key] !== undefined) el.textContent = s[key];
      });
      document.querySelectorAll('[data-si-html]').forEach(function (el) {
        var key = el.dataset.siHtml;
        if (s[key] !== undefined) el.innerHTML = s[key];
      });

      /* lang switcher active state */
      document.querySelectorAll('.lang-switcher button').forEach(function (btn) {
        btn.classList.toggle('lang-active', btn.textContent.trim().toLowerCase() === lang);
      });

      /* delegate to page-level setLang if defined */
      if (typeof window.setLang === 'function') window.setLang(lang);
    }
  };

  /* ── Init on DOMContentLoaded (all page scripts have run by then) ── */
  document.addEventListener('DOMContentLoaded', function () {
    var saved = 'en';
    try { saved = localStorage.getItem('site_lang') || 'en'; } catch(e) {}
    window.__shell.setLang(saved);

    // Close mobile menu on outside click
    document.addEventListener('click', function (e) {
      var nav = document.getElementById('shell-nav');
      if (nav && !nav.contains(e.target)) window.__shell.closeMobile();
    });

    // Close mobile menu if viewport grows past breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 640) window.__shell.closeMobile();
    });

    // Close on first-link click (it's generated with data-si, no onclick added above)
    var mobile = getMobileEl();
    if (mobile) {
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { window.__shell.closeMobile(); });
      });
    }
  });

})();
