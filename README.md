# RETROTERM.AI

> Sistema web retrofuturista con estética de terminal de los 80/90 y funcionalidades modernas.

**Proyecto personal** desarrollado durante el ciclo ASIR (Administración de Sistemas Informáticos en Red) en CDM FP, curso 2025/26. Empezó como ejercicio de clase y evolucionó en una plataforma completa con IA, base de datos en tiempo real, autenticación y sistema de gaming.

🌐 **[retroterm.ai — ver en vivo](https://ivanchux.github.io/Retroterm-AI/)**

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **HUB** | Página principal con bento grid animado y fondo de nodos/ondas |
| **ARIA** | Asistente IA con streaming en tiempo real, markdown, slash commands y exportación |
| **Editor** | Editor de código con syntax highlight y preview en vivo |
| **Gaming** | Colección de 43 juegos con fichas, capturas IGDB, estados, reviews y stats de usuario |
| **Artículos** | Publicaciones técnicas: Linux, redes, SQL, SEO |
| **DeFi** | Terminal de criptomonedas con precios en tiempo real |
| **Terminal** | Shell interactiva en el navegador |
| **Wonder IV** | Juego de puzzles: 7 maravillas del mundo digital |
| **Mural** | Sistema de mensajes en tiempo real entre usuarios |
| **Perfil** | Perfil de usuario con stats de gaming, XP y logros |
| **Red** | Red de proyectos de compañeros de clase |
| **Roadmap** | Hoja de ruta pública del proyecto |

---

## Stack técnico

### Frontend
- HTML5 semántico + CSS3 + JavaScript vanilla (sin frameworks)
- Markdown renderizado con **marked.js** + syntax highlight con **highlight.js**
- Canvas API para animaciones de fondo (nodos, ondas, partículas)
- Diseño responsive con media queries y bento grid

### Backend / Servicios
- **Firebase Auth** — autenticación con email/contraseña y Google OAuth
- **Firebase Firestore** — datos de usuario y perfil
- **Supabase** — base de datos PostgreSQL para gaming (juegos, estados, reviews, capturas)
- **IGDB API** (Twitch) — portadas y capturas de pantalla de los 43 juegos
- **Groq API** (Llama 3.1) — modelo de lenguaje para ARIA, 100% gratuito
- **Cloudflare Workers** — proxy para la API de IA con streaming SSE
- **GitHub Pages** — hosting estático con CI/CD via GitHub Actions

### CI/CD
- GitHub Actions genera `firebase-config.js` desde secrets en cada push a `main`
- Deploy automático a GitHub Pages

---

## Arquitectura ARIA

```
Usuario → asistente.html → Cloudflare Worker → Groq API (Llama 3.1)
                ↑                                       ↓
         SSE streaming ←————————————————————————————————
```

- Conversaciones persistidas en **localStorage** (hasta 15, 30 mensajes c/u)
- Contexto del sitio inyectado en cada conversación (ARIA conoce la web)
- Sistema de navegación: ARIA puede dirigir al usuario a cualquier sección
- Slash commands: `/new`, `/export`, `/clear`, `/help`
- Atajos de teclado: `Ctrl+N`, `Ctrl+E`, `Ctrl+B`, `Ctrl+?`
- Export de conversaciones como `.md`

---

## Estructura de archivos

```
/
├── index.html                  → HUB principal
├── asistente.html              → ARIA (asistente IA)
├── editor.html                 → Editor de código
├── gaming.html                 → Colección de juegos
├── gaming-ficha.html           → Ficha detallada de juego
├── gaming-guia.html            → Guías de juego
├── articulos.html              → Listado de artículos
├── articulo-*.html             → Artículos técnicos
├── defi.html                   → Terminal DeFi
├── terminal.html               → Shell interactiva
├── wonder.html                 → Juego Wonder IV
├── mural.html                  → Mural de mensajes
├── perfil.html                 → Perfil de usuario
├── red.html                    → Red de proyectos
├── roadmap.html                → Roadmap del proyecto
├── login.html                  → Autenticación
├── portal.html                 → Portal interno
├── herramientas.html           → Herramientas (subnet, etc.)
├── 404.html                    → Página de error personalizada
│
├── css/
│   ├── estilos.css             → Estilos globales
│   ├── editor.css              → Estilos del editor
│   └── accesibilidad.css       → Accesibilidad
│
├── js/
│   ├── firebase-config.js      → Config Firebase (generado por CI, no en repo)
│   ├── auth.js                 → Lógica de autenticación
│   ├── middleware.js           → Guard de rutas protegidas
│   ├── gaming-data.js          → Datos estáticos de juegos
│   ├── nav-auth.js             → Estado de sesión en navegación
│   └── worker_divine-river.js  → Código original del Worker (referencia)
│
├── scripts/
│   ├── migrate-images.js       → Migración masiva de imágenes IGDB → Supabase
│   ├── fix-images2.js          → Corrección de imágenes con queries exactas
│   └── worker-aria-streaming.js → Worker de Cloudflare con streaming SSE
│
├── admin/
│   ├── migrate-games.html      → Herramienta de migración de juegos
│   └── check-images.html       → Verificación visual de portadas
│
├── .github/workflows/
│   └── deploy.yml              → CI/CD: genera config + despliega en Pages
│
├── sitemap.xml
├── robots.txt
└── favicon.ico
```

---

## SEO aplicado

- Estructura de SILO en tres niveles para enlazado interno
- Datos estructurados JSON-LD (`@type: Article`, `@type: BreadcrumbList`)
- Open Graph y Twitter Cards en todas las páginas
- `sitemap.xml` y `robots.txt` configurados
- Canonical URLs
- Lazy loading en imágenes
- Google Search Console integrado

---

## Cómo ejecutar en local

```bash
# Clonar el repositorio
git clone https://github.com/Ivanchux/Retroterm-AI.git
cd Retroterm-AI

# Servidor local (requiere Python)
python -m http.server 8181

# Abrir en http://localhost:8181
```

> **Nota:** Las funciones que requieren Firebase/Supabase/Groq necesitan las claves de entorno correspondientes. El Worker de Cloudflare se despliega por separado.

---

## Autor

**Iván Brihuega Crespo**  
1º ASIR — CDM FP · Madrid · 2025/26  
[ivanchux.github.io/Retroterm-AI](https://ivanchux.github.io/Retroterm-AI/)

---

## Licencia

Licencia propia — ver [LICENSE](LICENSE)  
Código disponible para consulta y referencia educativa. Prohibida la copia o uso comercial sin autorización expresa del autor.
