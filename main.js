/* INSPAX – main.js (no dependencies) */
(function () {
  'use strict';

  var desktop = window.matchMedia('(min-width: 64em)');
  var nav = document.getElementById('primary-nav');
  var toggle = document.querySelector('.nav-toggle');

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* ---------- Submenus (touch + keyboard; hover handled in CSS on desktop) ---------- */
  var subToggles = document.querySelectorAll('.sub-toggle');

  function setSub(btn, open) {
    var list = btn.parentElement.querySelector('.sub-list');
    btn.setAttribute('aria-expanded', String(open));
    if (list) list.classList.toggle('is-open', open);
  }

  function closeAllSubs(except) {
    subToggles.forEach(function (b) { if (b !== except) setSub(b, false); });
  }

  subToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      closeAllSubs(btn);
      setSub(btn, open);
    });
  });

  /* Close on Escape, return focus to the toggle that owns the open menu */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openBtn = document.querySelector('.sub-toggle[aria-expanded="true"]');
    if (openBtn) { setSub(openBtn, false); openBtn.focus(); return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* Close submenus when clicking/tabbing outside */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeAllSubs(null);
  });
  document.addEventListener('focusin', function (e) {
    if (desktop.matches && !e.target.closest('.has-sub')) closeAllSubs(null);
  });

  /* Reset state when crossing the desktop breakpoint */
  function onBreakpoint() {
    setMenu(false);
    closeAllSubs(null);
  }
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  else desktop.addListener(onBreakpoint);

  /* ---------- Back to top ---------- */
  var topBtn = document.querySelector('.to-top');
  if (topBtn) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        topBtn.hidden = window.scrollY < 800;
        ticking = false;
      });
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();