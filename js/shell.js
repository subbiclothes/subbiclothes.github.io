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
      editor:  'Config Editor',
      mp:      'Marketplace',

      footer_contact: 'Questions? Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life.',
      footer_version: 'Latest release: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 in development',
    },
    es: {
      home:    'Inicio',
      guide:   'Guía',
      editor:  'Editor de Config',
      mp:      'Marketplace',
      footer_contact: '¿Preguntas? Escribe a <strong>Souwind</strong> o <strong>Aratx</strong> en Second Life.',
      footer_version: 'Última versión: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 en desarrollo',
    }
  };

  /* ── Logo SVG ── */
  const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="34" height="34" aria-hidden="true">
    <defs><linearGradient id="shell-sg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff2d78"/><stop offset="100%" stop-color="#aa0040"/>
    </linearGradient></defs>
    <rect width="52" height="52" rx="7" fill="#0d0018" stroke="#ff2d78" stroke-width="1" stroke-opacity="0.45"/>
    <polyline points="0,9 0,0 9,0"   fill="none" stroke="#ff2d78" stroke-width="1.8" stroke-opacity="0.85"/>
    <polyline points="43,0 52,0 52,9" fill="none" stroke="#ff2d78" stroke-width="1.8" stroke-opacity="0.85"/>
    <polyline points="0,43 0,52 9,52" fill="none" stroke="#ff2d78" stroke-width="1.8" stroke-opacity="0.85"/>
    <polyline points="43,52 52,52 52,43" fill="none" stroke="#ff2d78" stroke-width="1.8" stroke-opacity="0.85"/>
    <path d="M 39 9 L 15 9 Q 9 9 9 15 L 9 22 Q 9 28 15 28 L 37 28 Q 43 28 43 34 L 43 41 Q 43 43 37 43 L 13 43"
      stroke="url(#shell-sg)" stroke-width="6" stroke-linecap="butt" stroke-linejoin="round" fill="none"/>
  </svg>`;

  /* ── Read page meta config ── */
  function meta(name, fallback) {
    return document.querySelector('meta[name="' + name + '"]')?.content ?? fallback;
  }

  /* ── Build nav HTML ── */
  function buildNav(logoSub) {
    var isHome = location.pathname === '/' || location.pathname === '/index.html';
    var firstLink = isHome
      ? '<a href="/guide/" data-si="guide">Guide</a>'
      : '<a href="/" data-si="home">Home</a>';
    return `
<nav class="site-nav" id="shell-nav">
  <div class="nav-inner">
    <a href="/" class="site-logo">
      <div class="logo-icon">${LOGO_SVG}</div>
      <div class="logo-wordmark">
        <b>SUBBI</b><span class="logo-pink">CLOTHES</span>
        <span class="logo-sub">${logoSub}</span>
      </div>
    </a>
    <div class="nav-links">
      ${firstLink}
      <a href="/outfit-config-editor/" data-si="editor">Config Editor</a>
      <a href="/r/mp" class="nav-cta"><span data-si="mp">Marketplace</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </div>
    <div class="lang-switcher">
      <button data-lang="en" onclick="window.__shell.setLang('en')">EN</button>
      <button data-lang="es" onclick="window.__shell.setLang('es')">ES</button>
    </div>
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
        <a href="/outfit-config-editor/" data-si="editor">Config Editor</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <p data-si-html="footer_contact">Questions? Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life.</p>
      <p class="footer-version" data-si-html="footer_version">Latest release: <strong>v3.3D</strong> &nbsp;·&nbsp; 4.0 in development</p>
    </div>
  </div>
</footer>`;
  }

  /* ── Inject ── */
  var logoSub = meta('shell-logo-sub', "Second Life's RLV Wardrobe");
  document.body.insertAdjacentHTML('afterbegin', buildNav(logoSub));
  document.body.insertAdjacentHTML('beforeend',  buildFooter());

  /* ── Lang ── */
  window.__shell = {
    setLang: function (lang) {
      if (!S[lang]) lang = 'en';
      var s = S[lang];

      document.documentElement.lang = lang;
      try { localStorage.setItem('site_lang', lang); } catch(e) {}

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
  });

})();
