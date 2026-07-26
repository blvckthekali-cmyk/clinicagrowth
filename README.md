# ClinicAI Growth — Landing page

Landing page one-page, responsive y lista para producción para **ClinicAI Growth**, una
agencia que instala sistemas de IA y automatización en clínicas médicas y estéticas.
Objetivo único de la página: **que el dueño de la clínica agende un diagnóstico gratuito.**

Construida con **HTML5 + CSS + JavaScript vanilla** (sin build, sin dependencias que instalar).
Rápida, limpia, accesible y fácil de mantener.

---

## 🚀 Cómo levantarla en local

> ❗ **No abras `index.html` con doble clic.** Con `file://` el navegador NO carga
> los estilos ni el chatbot, y la web se ve “rota” (texto negro sin diseño). Usa
> siempre un servidor local (cualquiera de las opciones de abajo).

### Opción 1 — Doble clic en `abrir-web.bat` (la más fácil) ✅
Haz **doble clic en `abrir-web.bat`**. Se abre una ventana negra (el servidor) y tu
navegador se abre solo en `http://localhost:8080/` con la web completa y el chatbot.
Para apagarlo, cierra la ventana negra.

### Opción 2 — Servidor con Node a mano
En una terminal, dentro de la carpeta del proyecto:

```bash
node server.js
```

Abre la URL que aparece (`http://localhost:8080/`).

### Opción 3 — Con `npx serve` o Python
```bash
npx serve .            # abre http://localhost:3000
# o, si tienes Python:
python -m http.server 8000   # abre http://localhost:8000
```

---

## ☁️ Publicar en internet (Vercel)

El proyecto ya está listo para Vercel (`vercel.json` + `.vercelignore`; la CLI de Vercel
está instalada). Para conseguir una URL pública tipo `https://clinicai-growth.vercel.app`:

**La forma fácil:** doble clic en **`desplegar-vercel.bat`**. La primera vez te pedirá
iniciar sesión en Vercel (se abre el navegador, un clic) y hará unas preguntas simples;
al terminar te muestra la URL pública.

**A mano** (en una terminal, dentro de la carpeta):
```bash
vercel login     # solo la primera vez (se abre el navegador)
vercel --prod    # despliega y devuelve la URL pública
```
En el primer despliegue Vercel pregunta: *Set up and deploy?* → **Y**; *Link to existing
project?* → **N**; nombre del proyecto → p. ej. `clinicai-growth`; directorio → **Enter**;
*Override settings?* → **N**. Los siguientes despliegues son solo `vercel --prod`.

> Todo funciona igual en producción (Typebot, Calendly, Google Maps van por HTTPS).
> Para un dominio propio (p. ej. `clinicaigrowth.com`) o auto-despliegue al hacer cambios,
> se conecta el proyecto a GitHub desde el panel de Vercel — dímelo y te guío.

---

## 🤖 Chatbot de Typebot — ya conectado

El chatbot (instancia **autoalojada**) ya está integrado de dos formas:

- **Embebido** en la sección **“Pruébalo tú mismo”**.
- **Burbuja flotante** en toda la página, con tu icono y mensaje de bienvenida.

La configuración vive al principio de **`js/main.js`**:

```js
var TYPEBOT_ID = 'w2svp9sdtqsvzlhl61rndds3';
var TYPEBOT_API_HOST = 'https://typebot-typebot-viewer.yffpiv.easypanel.host';
```

> ⚠️ Para que el bot cargue, ábrela con un servidor local (Opción 2 o 3), no con
> doble clic en `file://`. Si algún día cambias de bot, actualiza esos dos valores
> (los obtienes en Typebot → **Share / Publicar → Embed**). Si el embed fallara,
> se mantiene visible el marcador de posición como respaldo.

---

## ✉️ Conectar el formulario de diagnóstico

El formulario **valida en cliente** y muestra el estado de éxito
(*“✅ ¡Recibido! Te contactamos en menos de 24 h.”*). El envío al backend está marcado
como **TODO** (ahora solo registra los datos en la consola del navegador).

Para conectarlo de verdad, abre **`js/main.js`**, busca el comentario `--- TODO: enviar
los datos a tu backend / CRM / email ---` y sustituye el `console.log` por una llamada
`fetch` a tu webhook (Make, Zapier, n8n, tu CRM, etc.). El objeto `payload` ya está listo.

---

## 🎨 Sistema de diseño

Todos los tokens están definidos como variables CSS en `css/styles.css` (`:root`):

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#FFFFFF` | Fondo principal |
| `--bg-alt` | `#F6F9FC` | Secciones alternas |
| `--ink` | `#0A1A2F` | Texto / fondos oscuros |
| `--accent` | `#1E6BE6` | Acción, tecnología, confianza |
| `--gold` | `#C8A96E` | Premium (badges, garantía) |
| `--green` | `#16A37B` | Métricas positivas |
| `--text-2` | `#475569` | Texto secundario |
| `--line` | `#E6EBF1` | Bordes / líneas |

Tipografía: **Sora** (titulares) + **Inter** (cuerpo/UI), vía Google Fonts.
Iconografía: **Lucide** (SVG de línea, inline).

---

## 📁 Estructura

```
.
├── index.html        # Estructura y copy de todas las secciones
├── css/
│   └── styles.css     # Sistema de diseño + componentes + responsive + animaciones
├── js/
│   └── main.js        # Header sticky, menú, scroll-reveal, contadores, form, Typebot
└── README.md
```

---

## ✅ Incluido

- **Fondo ambiental premium** (fijo, en `css/styles.css`): base near-white en frío con
  halos sutiles de luz (azul de marca + dorado) y una retícula de precisión casi
  imperceptible que se difumina hacia los bordes. Las bandas alternas son un lavado frío
  translúcido; las secciones oscuras lo cubren para marcar el ritmo. Sustituye al blanco plano.
- **Pantalla de carga de marca** (sin recursos externos): el pulso del logo se dibuja en
  bucle sobre fondo claro, con el wordmark y una línea de progreso fina. Se desvanece al
  cargar la página (mínimo 0,9 s, máximo 2,5 s — ajustable en `PRELOADER_MIN_MS` /
  `PRELOADER_MAX_MS` de `js/main.js`). Solo se muestra una vez por sesión y se omite con
  `prefers-reduced-motion` o sin JavaScript.
- Header sticky que se compacta al hacer scroll, con CTA siempre visible (también en móvil).
- **Selector de idioma ES / EN / CA** (desplegable en el header; recuerda la elección; traduce toda la página, formulario y mensajes de error incluidos). Textos en `js/i18n.js`.
- **Smooth scrolling con Lenis** (CDN, con fallback nativo y respeto a `reduce-motion`).
- **Sección "Reserva directamente en el calendario"** con Calendly embebido
  (`https://calendly.com/aclinicaigrowth/nueva-reunion`) + botón de reserva en el CTA final y enlace en el nav.
- **Mapa de Google Maps embebido** (sección "Dónde estamos"): Viladecans, 08840 Barcelona, con enlace "Cómo llegar".
- Contacto real: `aclinicaigrowth@gmail.com` · WhatsApp `+34 623 16 31 64`.
- Animaciones scroll-reveal sutiles + micro-lifts en hover. Respeta `prefers-reduced-motion`.
- Mockup del hero (chat + métricas) hecho con CSS/SVG, sin fotos de stock.
- Contadores animados en la barra de métricas.
- Formulario con validación en cliente (mensajes traducidos) y estado de éxito.
- **Chat DEMO interactivo nativo** en "Pruébalo tú mismo" (`js/demo-chat.js`): respuestas
  guionizadas (citas, precios, horarios, tratamientos, urgencias, ubicación), botones de
  respuesta rápida, indicador de escritura, flujo completo de reserva simulada. Solo
  responde temas de clínica; trilingüe (ES/EN/CA). El **tiempo de respuesta es proporcional
  a la longitud del mensaje** (~0,9–2,6 s, con "escribiendo…"), para que se sienta humano y
  no instantáneo-robótico. No depende de servicios externos: funciona siempre.
- **Red neuronal interactiva en el hero** (`js/neural.js`, canvas): nodos que se conectan
  con líneas finas e impulsos "eléctricos" (azul, y dorado ocasional) recorriéndolas; el
  cursor actúa como una neurona más. Minimalista, se pausa fuera de pantalla y con
  `reduce-motion`.
- **Escena "El coste de no responder"** (`js/story.js`): motion-graphic nativo de ~14 s en
  dos actos (sin sistema → paciente perdido / con ClinicAI → cita confirmada), con
  autoplay al entrar en pantalla, pausa y barra de progreso. Trilingüe. Alternativa ligera
  a un vídeo mp4; si tienes uno real grabado, se sustituye fácilmente.
- Burbuja flotante de Typebot en toda la página (bot real autoalojado).
- Mobile-first, HTML semántico, foco visible, contraste cuidado.
