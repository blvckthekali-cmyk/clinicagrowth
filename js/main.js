/* =====================================================================
   ClinicAI Growth — interacciones
   ===================================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------------------
     CONFIGURACIÓN DEL CHATBOT (Typebot — instancia autoalojada)
     - TYPEBOT_ID:       ID PÚBLICO del bot (el del enlace de Share).
     - TYPEBOT_API_HOST: host de tu instancia de Typebot.
     Si el bot no carga, comprueba estos dos valores en Typebot →
     Share / Publicar → Embed, y que el bot esté PUBLICADO.
  ------------------------------------------------------------------- */
  var TYPEBOT_ID = 'demo-anti-fugas-cl-nica-1rndds3';
  var TYPEBOT_API_HOST = 'https://typebot-typebot-viewer.yffpiv.easypanel.host';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== Pantalla de carga ===================== */
  // Marca + pulso del logo dibujándose. Se desvanece cuando la página
  // termina de cargar: mínimo PRELOADER_MIN_MS (para que se aprecie sin
  // parpadeo) y máximo PRELOADER_MAX_MS (nunca hace esperar de más).
  // Solo se muestra una vez por sesión.
  var PRELOADER_MIN_MS = 900;
  var PRELOADER_MAX_MS = 2500;

  (function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;
    if (preloader.hasAttribute('hidden')) { preloader.remove(); return; }

    document.documentElement.classList.add('preloading');
    var shownAt = performance.now();
    var done = false;
    var inner = preloader.querySelector('.preloader-inner');

    /* Interacción con el cursor: brillo que lo sigue + paralaje sutil */
    function onPointerMove(e) {
      preloader.classList.add('has-cursor');
      preloader.style.setProperty('--px', (e.clientX / window.innerWidth * 100) + '%');
      preloader.style.setProperty('--py', (e.clientY / window.innerHeight * 100) + '%');
      if (inner) {
        var dx = (e.clientX - window.innerWidth / 2) * 0.02;
        var dy = (e.clientY - window.innerHeight / 2) * 0.02;
        inner.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      }
    }
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      preloader.addEventListener('mousemove', onPointerMove);
    }

    function hidePreloader() {
      if (done) return;
      done = true;
      preloader.removeEventListener('mousemove', onPointerMove);
      if (inner) inner.style.transform = ''; // deja la salida a la transición CSS
      preloader.classList.add('preloader-hide');
      document.documentElement.classList.remove('preloading');
      try { sessionStorage.setItem('cagLoaderShown', '1'); } catch (e) { /* modo privado */ }
      setTimeout(function () { preloader.remove(); }, 550);
    }

    if (prefersReducedMotion) { hidePreloader(); return; }

    function onLoaded() {
      var elapsed = performance.now() - shownAt;
      setTimeout(hidePreloader, Math.max(0, PRELOADER_MIN_MS - elapsed));
    }

    if (document.readyState === 'complete') { onLoaded(); }
    else { window.addEventListener('load', onLoaded); }
    setTimeout(hidePreloader, PRELOADER_MAX_MS);
  })();

  /* ============ Botones magnéticos + brillo que sigue al cursor ============ */
  // El botón se desplaza sutilmente hacia el cursor (máx. ~5 px) y el brillo
  // (::after en CSS) se posiciona con --bx/--by. Solo con ratón real.
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var relX = e.clientX - r.left;
        var relY = e.clientY - r.top;
        btn.style.setProperty('--bx', (relX / r.width * 100).toFixed(1) + '%');
        btn.style.setProperty('--by', (relY / r.height * 100).toFixed(1) + '%');
        var dx = (relX - r.width / 2) / (r.width / 2) * 5;
        var dy = (relY - r.height / 2) / (r.height / 2) * 4;
        btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = ''; // vuelve suave gracias a la transición CSS
      });
    });
  }

  /* ===================== Idioma (i18n) ===================== */
  var LANG_KEY = 'clinicai-lang';
  var currentLang = 'es';

  function t(key) {
    var dict = window.I18N && window.I18N[currentLang];
    return (dict && dict[key]) ? dict[key] : key;
  }

  function applyLang(lang) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) return;
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    if (dict['meta.title']) document.title = dict['meta.title'];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });

    var cur = document.getElementById('lang-current');
    if (cur) cur.textContent = lang.toUpperCase();
    document.querySelectorAll('#lang-menu [data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    // El chat demo se reinicia en el idioma nuevo
    if (window.DemoChat) window.DemoChat.setLang(lang);

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* modo privado */ }
  }

  // Desplegable del selector
  var langBtn = document.getElementById('lang-btn');
  var langMenu = document.getElementById('lang-menu');

  function closeLangMenu() {
    if (!langMenu.hidden) {
      langMenu.hidden = true;
      langBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = langMenu.hidden;
      langMenu.hidden = !willOpen;
      langBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    langMenu.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
        closeLangMenu();
      });
    });
    document.addEventListener('click', function (e) {
      if (!langMenu.hidden && !e.target.closest('#lang-switch')) closeLangMenu();
    });
  }

  // Idioma guardado de una visita anterior
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved && saved !== 'es' && window.I18N && window.I18N[saved]) applyLang(saved);
  } catch (e) { /* sin localStorage */ }

  /* ===================== Lenis (smooth scrolling) ===================== */
  var lenis = null;
  if (!prefersReducedMotion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    document.documentElement.classList.add('lenis-smooth');
    var rafLoop = function (time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    };
    requestAnimationFrame(rafLoop);
  }

  /* ===================== Header sticky (compacta) ===================== */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ Anclas: scroll suave con Lenis (con offset) ============ */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link || link.classList.contains('skip-link')) return;
    var hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    var target = document.querySelector(hash);
    if (!target) return;
    if (lenis) {
      e.preventDefault();
      var headerH = header ? header.getBoundingClientRect().height : 0;
      lenis.scrollTo(target, { offset: -(headerH + 14) });
      if (history.replaceState) history.replaceState(null, '', hash);
    }
    // Sin Lenis: comportamiento nativo (scroll-behavior + scroll-padding en CSS)
  });

  /* ===================== Menú móvil ===================== */
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }
  function openMenu() {
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
  }

  navToggle.addEventListener('click', function () {
    if (mobileMenu.hidden) { openMenu(); } else { closeMenu(); }
  });

  // Cerrar el menú al pulsar un enlace
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape (menú móvil y selector de idioma)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!mobileMenu.hidden) {
        closeMenu();
        navToggle.focus();
      }
      if (langMenu && !langMenu.hidden) {
        closeLangMenu();
        langBtn.focus();
      }
    }
  });

  /* ===================== Scroll-reveal ===================== */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ===================== Contador animado de métricas ===================== */
  var counters = document.querySelectorAll('.metric-number[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    var start = null;
    var duration = 1400;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ===================== Año del footer ===================== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ===================== Validación del formulario ===================== */
  var form = document.getElementById('form-diagnostico');
  var successBox = document.getElementById('form-success');

  function isValidContact(value) {
    var v = value.trim();
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // Acepta email o teléfono (mínimo 7 dígitos)
    var digits = v.replace(/[^\d]/g, '');
    return emailRe.test(v) || digits.length >= 7;
  }

  function setError(field, message) {
    var wrap = field.closest('.field');
    var errEl = wrap.querySelector('.field-error');
    wrap.classList.add('invalid');
    if (errEl) errEl.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }
  function clearError(field) {
    var wrap = field.closest('.field');
    wrap.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
  }

  function validateField(field) {
    var value = field.value.trim();
    if (field.id === 'nombre') {
      if (value.length < 2) { setError(field, t('err.name')); return false; }
    } else if (field.id === 'clinica') {
      if (value.length < 2) { setError(field, t('err.clinic')); return false; }
    } else if (field.id === 'contacto') {
      if (!isValidContact(value)) { setError(field, t('err.contact')); return false; }
    } else if (field.id === 'problema') {
      if (!value) { setError(field, t('err.problem')); return false; }
    }
    clearError(field);
    return true;
  }

  if (form) {
    var fields = ['nombre', 'clinica', 'contacto', 'problema'].map(function (id) {
      return document.getElementById(id);
    });

    // Limpia el error en cuanto el usuario corrige
    fields.forEach(function (field) {
      var evt = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(evt, function () {
        if (field.closest('.field').classList.contains('invalid')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      fields.forEach(function (field) {
        var ok = validateField(field);
        if (!ok && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // --- TODO: enviar los datos a tu backend / CRM / email ---
      // Ejemplo de payload listo para conectar (fetch / webhook / Zapier / Make):
      var payload = {
        nombre: document.getElementById('nombre').value.trim(),
        clinica: document.getElementById('clinica').value.trim(),
        contacto: document.getElementById('contacto').value.trim(),
        problema: document.getElementById('problema').value,
        idioma: currentLang,
        enviadoEn: new Date().toISOString()
      };
      console.log('[ClinicAI Growth] Diagnóstico solicitado (envío simulado):', payload);

      // Estado de éxito
      var formChildren = form.querySelectorAll('.field, .form-submit, .form-microcopy');
      formChildren.forEach(function (el) { el.style.display = 'none'; });
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ===================== Chat DEMO interactivo ===================== */
  // El chat de la sección "Pruébalo tú mismo" es nativo (js/demo-chat.js):
  // respuestas guionizadas al instante, sin dependencias externas.
  if (window.DemoChat) {
    window.DemoChat.init(currentLang);
  }

  /* ===================== Integración Typebot ===================== */
  function initTypebot() {
    // Burbuja flotante en toda la página (librería JS de Typebot).
    import('https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js')
      .then(function (mod) {
        var Typebot = mod.default;

        Typebot.initBubble({
          typebot: TYPEBOT_ID,
          apiHost: TYPEBOT_API_HOST,
          previewMessage: {
            message: 'Reservo tu cita en segundos ⚡',
            autoShowDelay: 6000,
            avatarUrl: 'https://typebot-minio.yffpiv.easypanel.host/typebot/public/workspaces/cmqwmdhwx0000tc1n4uotg7nf/typebots/w2svp9sdtqsvzlhl61rndds3/hostAvatar?v=1785006189240'
          },
          theme: {
            button: {
              backgroundColor: '#0A1A2F',
              customIconSrc: 'https://typebot-minio.yffpiv.easypanel.host/typebot/public/workspaces/cmqwmdhwx0000tc1n4uotg7nf/typebots/w2svp9sdtqsvzlhl61rndds3/bubble-icon?v=1785006333765'
            },
            previewMessage: {
              backgroundColor: '#FFFFFF',
              textColor: '#0A1A2F',
              closeButtonBackgroundColor: '#0A1A2F',
              closeButtonIconColor: '#FFFFFF'
            }
          }
        });
      })
      .catch(function (err) {
        console.warn('[ClinicAI Growth] No se pudo cargar la burbuja de Typebot:', err);
        // El embed de la demo (iframe) es independiente y sigue funcionando.
      });
  }

  if (TYPEBOT_ID) {
    initTypebot();
  }
})();
