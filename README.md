# Comarca Las Liebres — sitio web

Sitio estático (HTML + CSS + JS) sobre la plantilla *Paradise*. Se publica con **GitHub Pages desde la rama `contenido-wix`**: cada `push` a esa rama se publica solo en uno o dos minutos.

## Editar en VS Code

1. Abrí la carpeta del repo en VS Code. Si aparece el aviso, instalá las extensiones recomendadas (**Live Server** y **EditorConfig**).
2. Para ver el sitio mientras editás: clic derecho en `index.html` → **Open with Live Server**. Se abre en `http://127.0.0.1:5500` y se recarga solo al guardar.
   > Si abrís el `.html` con doble clic el sitio carga, pero el plano de lotes no: los datos se leen con `fetch()` y eso necesita un servidor.
3. Al terminar: **Source Control** (Ctrl+Shift+G) → mensaje → **Commit** → **Sync / Push**.

## Páginas

| Archivo | Sección |
|---|---|
| `index.html` | Home (hero de video + presentación) |
| `hotel.html` | Hotel: intro, casas, espacios, tarifas y reservas |
| `casa-principal.html`, `casa-del-aljibe.html`, `casa-de-la-vendimia.html` | Suites de cada casa |
| `restaurant.html` | Restaurant, huerta, salón de té, reservas |
| `carta.html` | La carta (texto fijo) |
| `vina.html` | La viña y nuestros vinos |
| `productos.html` | Productos para llevar (sin precios) |
| `eventos.html` | Salones, empresariales/particulares y formulario |
| `barrio.html` | Barrio Village, masterplan, plano de lotes, staff, consultas |
| `barrio-arquitectura.html` | Casa MEL, modelos de casas, interiorismo |
| `contacts.html` | Contacto, mapa, opiniones |
| `privacidad.html` | Política de privacidad (**la URL la usa Meta, no cambiarla**) |
| `agradecimiento.html` | Página después de reservar en Cloudbeds (**no cambiar la URL**) |
| `recorrido-virtual.html` | Tour 360° de CloudPano |

Los `index-2.html` … `index-11.html`, `room-*`, `news-*`, etc. son páginas de ejemplo de la plantilla: no están enlazadas y se pueden borrar.

## Cambios frecuentes

### Menú o footer
El header y el footer están **copiados en cada página**. Para cambiarlos en todas a la vez: **Ctrl+Shift+H** (buscar y reemplazar en todos los archivos), filtrando por `*.html`.

### Marcar un lote vendido / reservado
`data/lotes.json` → buscar el lote (ej. `"02-03-04"`) → cambiar `"estado"` a `"vendido"`, `"reservado"` o `"disponible"`. No hay que tocar imágenes.

### Teléfonos de WhatsApp
Están dentro de los links `https://wa.me/598...`. Buscá el número con Ctrl+Shift+F.
- Hotel: `59896120040`
- Restaurant (y eventos): `59896112660`
- Barrio: `59895392945` (también en `data-whatsapp` de `barrio.html`)

### Formularios (Eventos y Barrio)
`js/formularios.js`. Mientras el `action` del `<form>` esté vacío, la consulta se abre en WhatsApp. Para que se envíe por mail, completá `action` con la URL del servicio de envío (PHP del hosting, Formspree, Web3Forms…).

### Analytics y píxeles
`js/seguimiento.js` (GA4 `G-G98F0TN8K2`, Google Ads `AW-603022624` y dos píxeles de Meta). Solo se activan en `lasliebres.com.uy`.

### Imágenes
Todas las imágenes del sitio están en el repo, en dos tamaños:
- `img/sitio/g/` (1600 px): imágenes grandes, galerías ampliadas, planos y planchetas.
- `img/sitio/m/` (900 px): miniaturas y tarjetas.

Para agregar una foto nueva, guardala en esas carpetas con un tamaño similar (no subas originales de varios MB) y usá la ruta en el HTML. Los videos de Wix están en `video/*-720.mp4`.

## Estructura

```
css/custom.css      estilos propios del sitio (lo demás es de la plantilla)
css/plano-lotes.css estilos del plano de lotes
js/plano-lotes.js   plano de lotes interactivo
js/formularios.js   envío de formularios
js/seguimiento.js   analytics y píxeles
data/lotes.json     lotes: posición, estado y plancheta
img/  video/        recursos de la plantilla y logos
```
 