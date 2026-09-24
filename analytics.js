(function () {
  'use strict';
  window.__fantasiaAnalyticsLoader = true;

  const measurementId = 'G-SS6SGR5H7P';
  const consentKey = 'fantasia-analytics-consent';

  function startAnalytics() {
    if (window.__fantasiaAnalyticsStarted) return;
    window.__fantasiaAnalyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function remember(choice) {
    try { localStorage.setItem(consentKey, choice); } catch (_) {}
  }

  function showConsent() {
    const panel = document.createElement('aside');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Preferencias de analítica');
    panel.style.cssText = 'position:fixed;z-index:99999;left:18px;right:18px;bottom:18px;max-width:760px;margin:auto;padding:18px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:#14111f;color:#f8f5ff;box-shadow:0 16px 48px rgba(0,0,0,.4);font:15px/1.45 system-ui,sans-serif';
    panel.innerHTML = '<strong style="display:block;margin-bottom:6px">Tu privacidad importa</strong><span>Usamos analítica opcional para entender cómo se utiliza la web y mejorarla. Puedes aceptar o continuar solo con las funciones necesarias. <a href="politica-de-privacidad.html" style="color:#9fc3ff">Más información</a>.</span><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button type="button" data-consent="necessary" style="padding:10px 14px;border:1px solid #827a96;border-radius:10px;background:transparent;color:#fff;cursor:pointer">Solo necesarias</button><button type="button" data-consent="analytics" style="padding:10px 14px;border:0;border-radius:10px;background:#695cff;color:#fff;font-weight:700;cursor:pointer">Aceptar analítica</button></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-consent="necessary"]').addEventListener('click', function () {
      remember('necessary');
      panel.remove();
    });
    panel.querySelector('[data-consent="analytics"]').addEventListener('click', function () {
      remember('analytics');
      panel.remove();
      startAnalytics();
    });
  }

  let choice = null;
  try { choice = localStorage.getItem(consentKey); } catch (_) {}
  if (choice === 'analytics') startAnalytics();
  else if (!choice) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showConsent);
    else showConsent();
  }
})();
