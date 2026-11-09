/*
 * Formularios del sitio (Eventos, Consultas del Barrio).
 *
 * Mientras no haya un servicio de envío configurado, el formulario arma un mensaje
 * con los datos y lo abre en WhatsApp (número en data-whatsapp).
 * Cuando se defina el envío por mail (PHP del hosting, Formspree, Web3Forms, etc.),
 * alcanza con poner la URL en el atributo action del <form>: los datos se envían por POST
 * y se muestra el mensaje de data-gracias.
 *
 * Marcado esperado:
 *   <form class="form-liebres" action="" data-whatsapp="598..." data-asunto="Consulta eventos"
 *         data-gracias="¡Gracias por su consulta!"> ... <div class="form-mensaje"></div> </form>
 *   Cada campo con name y, opcionalmente, data-etiqueta (texto que se usa en el mensaje).
 */
(function () {
  "use strict";

  function campos(form) {
    var lineas = [];
    form.querySelectorAll("input, textarea, select").forEach(function (el) {
      if (!el.name || el.type === "submit" || el.type === "hidden" || el.name === "_gotcha") return;
      var v = (el.value || "").trim();
      if (!v) return;
      var etiqueta = el.getAttribute("data-etiqueta") || el.name;
      lineas.push(etiqueta + ": " + v);
    });
    return lineas;
  }

  function mensaje(form, texto, ok) {
    var box = form.querySelector(".form-mensaje");
    if (!box) return;
    box.textContent = texto;
    box.className = "form-mensaje " + (ok ? "ok" : "error");
  }

  document.querySelectorAll("form.form-liebres").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var accion = (form.getAttribute("action") || "").trim();
      var gracias = form.getAttribute("data-gracias") || "¡Gracias por su consulta!";

      if (!accion || accion === "#") {
        var numero = form.getAttribute("data-whatsapp");
        var asunto = form.getAttribute("data-asunto") || "Consulta desde la web";
        var texto = "¡Hola! " + asunto + "\n\n" + campos(form).join("\n");
        window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
        mensaje(form, "Se abrió WhatsApp con su consulta. Solo resta enviar el mensaje.", true);
        return;
      }

      var boton = form.querySelector("[type=submit]");
      if (boton) boton.disabled = true;
      fetch(accion, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          mensaje(form, gracias, true);
        })
        .catch(function () {
          mensaje(form, "No se pudo enviar. Por favor, escríbanos por WhatsApp.", false);
        })
        .then(function () { if (boton) boton.disabled = false; });
    });
  });
})();
