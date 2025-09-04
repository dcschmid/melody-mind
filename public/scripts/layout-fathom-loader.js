// layout-fathom-loader.js
// Safe client-side loader for Fathom analytics with a local stub fallback.
(function () {
  function applySiteVisuals() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('motion-reduce');
      }
      document.body.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    } catch (e) {
      // non-fatal
      console.warn('layout init failed', e);
    }
  }

  function installFathomStub() {
    try {
      if (!window.fathom) {
        window.fathom = {
          _q: [],
          trackEvent: function (name) {
            try {
              this._q.push(['trackEvent', name]);
            } catch (err) {
              // ignore
            }
          },
          trackPageview: function () {
            try {
              this._q.push(['trackPageview']);
            } catch (err) {
              // ignore
            }
          },
        };
      }
    } catch (err) {
      // ignore
    }
  }

  function loadFathomScript() {
    try {
      var s = document.createElement('script');
      s.src = 'https://cdn.usefathom.com/script.js';
      s.async = true;
      s.defer = true;
      s.crossOrigin = 'anonymous';
      s.setAttribute('data-site', 'RKHOWTTO');
      s.setAttribute('data-spa', 'auto');
      s.setAttribute('data-auto', 'false');

      s.onload = function () {
        try {
          if (window.fathom && typeof window.fathom.trackPageview === 'function') {
            window.fathom.trackPageview();
          }
        } catch (err) {
          console.warn('fathom onload error', err);
        }
      };

      s.onerror = function (e) {
        installFathomStub();
        console.warn('Fathom failed to load from CDN, installed stub fallback.', e);
      };

      document.head.appendChild(s);
    } catch (err) {
      installFathomStub();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applySiteVisuals();
      loadFathomScript();
    });
  } else {
    applySiteVisuals();
    loadFathomScript();
  }
})();
