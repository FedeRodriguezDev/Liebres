/*!
 * Plano de lotes interactivo — Comarca Las Liebres
 * Lee data/lotes.json y dibuja un marcador por lote sobre el plano.
 * Color según estado (disponible / reservado / vendido); al hacer clic abre la plancheta.
 *
 * Uso:
 *   <link rel="stylesheet" href="css/plano-lotes.css">
 *   <div class="plano-lotes" data-etapa="village" data-whatsapp="59895392945"></div>
 *   <script src="js/plano-lotes.js" defer></script>
 *
 * Atributos opcionales:
 *   data-src       ruta al JSON (por defecto "data/lotes.json")
 *   data-whatsapp  número para el botón "Consultar por este lote" (sin + ni espacios)
 *
 * Nota: el JSON se carga con fetch(), así que la página tiene que servirse por http(s)
 * (GitHub Pages, hosting, o un servidor local). Abriendo el .html con doble clic no carga.
 */
(function () {
  "use strict";

  var ESTADOS = {
    disponible: { texto: "Disponible", clic: true },
    reservado: { texto: "Reservado", clic: true },
    vendido: { texto: "Vendido", clic: false }
  };
  var cache = {};

  function cargar(src) {
    if (!cache[src]) {
      cache[src] = fetch(src, { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar " + src + " (" + r.status + ")");
        return r.json();
      });
    }
    return cache[src];
  }

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- Ventana de la plancheta (una sola para toda la página) ---------- */
  var modal, modalImg, modalTit, modalEst, modalCta, ultimoFoco;

  function crearModal() {
    if (modal) return;
    modal = el("div", "pl-modal", { role: "dialog", "aria-modal": "true", "aria-labelledby": "pl-modal-tit", hidden: "" });
    modal.innerHTML =
      '<div class="pl-modal__fondo" data-cerrar></div>' +
      '<div class="pl-modal__caja">' +
      '<button type="button" class="pl-modal__cerrar" data-cerrar aria-label="Cerrar">&times;</button>' +
      '<div class="pl-modal__cab"><h3 id="pl-modal-tit" class="pl-modal__tit"></h3><span class="pl-modal__estado"></span></div>' +
      '<div class="pl-modal__img"><img alt=""></div>' +
      '<a class="pl-modal__cta" target="_blank" rel="noopener">Consultar por este lote</a>' +
      "</div>";
    document.body.appendChild(modal);
    modalImg = modal.querySelector("img");
    modalTit = modal.querySelector(".pl-modal__tit");
    modalEst = modal.querySelector(".pl-modal__estado");
    modalCta = modal.querySelector(".pl-modal__cta");
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-cerrar")) cerrarModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) cerrarModal();
    });
  }

  function abrirModal(lote, etapa, whatsapp) {
    crearModal();
    ultimoFoco = document.activeElement;
    modalTit.textContent = "Lote " + lote.lote;
    modalEst.textContent = ESTADOS[lote.estado].texto;
    modalEst.className = "pl-modal__estado pl--" + lote.estado;
    modalImg.src = lote.plancheta;
    modalImg.alt = "Plancheta del lote " + lote.lote + " — " + etapa.nombre;
    if (whatsapp) {
      var msg = "Hola, me interesa el lote " + lote.lote + " de " + etapa.nombre + " (Comarca Las Liebres).";
      modalCta.href = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(msg);
      modalCta.hidden = false;
    } else {
      modalCta.hidden = true;
    }
    modal.hidden = false;
    document.documentElement.classList.add("pl-sin-scroll");
    modal.querySelector(".pl-modal__cerrar").focus();
  }

  function cerrarModal() {
    modal.hidden = true;
    modalImg.removeAttribute("src");
    document.documentElement.classList.remove("pl-sin-scroll");
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  /* ---------- Plano ---------- */
  function dibujar(cont, datos) {
    var clave = cont.getAttribute("data-etapa");
    var etapa = datos.etapas && datos.etapas[clave];
    if (!etapa) throw new Error('No existe la etapa "' + clave + '" en el JSON');
    var whatsapp = cont.getAttribute("data-whatsapp") || "";

    cont.innerHTML = "";
    var scroll = el("div", "pl-scroll");
    var lienzo = el("div", "pl-lienzo");
    if (etapa.tam_marcador) lienzo.style.setProperty("--pl-tam", etapa.tam_marcador + "%");
    var img = el("img", "pl-plano", { src: etapa.plano, alt: "Plano de lotes — " + etapa.nombre });
    lienzo.appendChild(img);

    var cuenta = { disponible: 0, reservado: 0, vendido: 0 };
    etapa.lotes.forEach(function (l) {
      var est = ESTADOS[l.estado] ? l.estado : "disponible";
      l.estado = est;
      cuenta[est]++;
      var b = el("button", "pl-lote pl--" + est, {
        type: "button",
        style: "left:" + l.x + "%;top:" + l.y + "%",
        "aria-label": "Lote " + l.lote + ", " + ESTADOS[est].texto.toLowerCase(),
        "data-lote": l.lote
      });
      // Número corto dentro del marcador (último tramo del código: "02-05-07" -> "7")
      b.appendChild(el("span", "pl-lote__num", { "aria-hidden": "true" })).textContent = String(+l.lote.split("-").pop());
      b.appendChild(el("span", "pl-lote__tip")).textContent = l.lote + " · " + ESTADOS[est].texto;
      if (ESTADOS[est].clic) {
        b.addEventListener("click", function () { abrirModal(l, etapa, whatsapp); });
      } else {
        b.setAttribute("aria-disabled", "true");
      }
      lienzo.appendChild(b);
    });
    scroll.appendChild(lienzo);
    cont.appendChild(scroll);

    var ley = el("ul", "pl-leyenda");
    Object.keys(ESTADOS).forEach(function (k) {
      var li = el("li", "pl-leyenda__item");
      li.innerHTML = '<span class="pl-punto pl--' + k + '"></span>' + ESTADOS[k].texto + " <b>" + cuenta[k] + "</b>";
      ley.appendChild(li);
    });
    cont.appendChild(ley);
    cont.appendChild(el("p", "pl-ayuda")).textContent = "Hacé clic en un lote para ver su plancheta.";
  }

  function iniciar() {
    document.querySelectorAll(".plano-lotes").forEach(function (cont) {
      var src = cont.getAttribute("data-src") || "data/lotes.json";
      cargar(src)
        .then(function (d) { dibujar(cont, d); })
        .catch(function (err) {
          cont.innerHTML = '<p class="pl-error">No se pudo cargar el plano de lotes.</p>';
          if (window.console) console.error("[plano-lotes]", err);
        });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
