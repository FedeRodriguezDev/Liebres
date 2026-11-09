/*
 * Google Analytics 4, Google Ads y píxeles de Meta de Comarca Las Liebres.
 * Solo se cargan en el dominio de producción, para no mezclar visitas de prueba
 * (GitHub Pages, localhost) con las estadísticas reales.
 * IDs tomados del sitio Wix (noviembre 2026).
 */
(function () {
  var host = location.hostname.replace(/^www\./, "");
  if (host !== "lasliebres.com.uy") return;

  var GA4 = "G-G98F0TN8K2";
  var ADS = "AW-603022624";
  var PIXELES = ["1764368313763021", "229256005638977"];

  // Google tag (GA4 + Ads)
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA4);
  gtag("config", ADS);

  // Meta Pixel
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  PIXELES.forEach(function (id) { fbq("init", id); });
  fbq("track", "PageView");
})();
