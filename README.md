# RETROTERM.AI

> Entorno web retrofuturista de administración, desarrollo, gaming, inteligencia artificial y mercados financieros.

![Estado](https://img.shields.io/badge/estado-activo-00ff88?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=flat-square&logo=javascript)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-00ff66?style=flat-square&logo=github)
![Licencia](https://img.shields.io/badge/licencia-propietaria-ff3860?style=flat-square)

---

## ¿Qué es RETROTERM.AI?

RETROTERM.AI es un entorno web personal con estética de terminal retrofuturista inspirada en los sistemas de los años 80 y 90. Combina funcionalidad real con narrativa inmersiva — cada sección del sistema tiene identidad propia, desde un editor de código hasta un módulo de ajedrez con inteligencia artificial oculta tras una historia real.

No es una web. Es un sistema.

---

## Módulos

### HUB Principal (`index.html`)
- Panel de navegación central hacia todos los módulos
- Minijuegos integrados: **SNAKE_CRT** y **TYPE_CRT** con controles táctiles
- Sección GAMING con pestañas: Arcade y Guías
- Enlace directo a DEFI_TERMINAL para mercados en tiempo real

### DEFI_TERMINAL (`defi.html`)
- **Ticker en tiempo real** con las 50 monedas desplazándose en la parte superior
- **Precios vía Binance WebSocket** — stream continuo sin límite de peticiones, con flash visual en cada actualización
- **Meta datos vía CoinGecko** — capitalización, suministro, dominancia y ranking (actualización cada 5 minutos)
- Tabla de mercado con 50 monedas, buscador, filtros por categoría (L1/L2/DeFi/Meme/Stable) y ordenación por columnas
- Modal por moneda con stats completas, descripción y noticias relacionadas filtradas
- Pestaña **DOMINANCIA** — barras de dominancia de las 10 principales + Fear & Greed Index (alternative.me)
- Pestaña **NOTICIAS** — feed en tiempo real de CoinDesk, CoinTelegraph y Decrypt vía RSS, con filtro por fuente
- Pestaña **GLOSARIO** — 40 términos DeFi con buscador en tiempo real

### Portal SILO (`portal.html`)
- Acceso por boot screen animado con logs de sistema
- Navegación inmersiva entre secciones con efectos typewriter
- Puzzle de autenticación con hash SHA-256 y sistema de intentos con cuenta atrás
- Hack overlay al acertar el código — transición al módulo CORE
- **CORE MODULE** — datos globales en tiempo real desbloqueados tras autenticación:
  - Actividad sísmica mundial (USGS, M2.5+)
  - Clima actual con geolocalización automática (Open-Meteo)
  - Posición en tiempo real de la ISS (wheretheiss.at)
  - Mercados crypto con variación 24h (CoinGecko)
- Zona RESTRICTED con acceso al Turco Mecánico

### Asistente IA (`asistente.html`)
- Interfaz de chat con **ARIA**, asistente de inteligencia artificial
- Conectado a modelo LLaMA 3.1 vía Cloudflare Workers + Groq API
- Historial de conversación, typing indicator y protección XSS

### Editor (`editor.html`)
- Editor de código **CODE_CRT v0.2** con numeración de líneas
- Autoguardado en localStorage, exportación de archivos
- Resaltado de sintaxis básico en estética terminal

### El Turco Mecánico (`turco.html`)
- Partida de ajedrez contra una IA con motor minimax (profundidad 3, alpha-beta pruning)
- Narrativa progresiva que revela la historia real del Turco Mecánico (1770)
- Cara ASCII animada que reacciona a los movimientos
- Al terminar: galería histórica con modal de artículos sobre Von Kempelen, Napoleón y el legado en Amazon Mechanical Turk

### Artículos (`articulos.html`)
- Colección de artículos sobre tecnología, redes, SEO y sistemas
- Filtrado por categorías con tablas de referencia OSI y SEO

### Red de Proyectos (`red.html`)
- Directorio de proyectos con tarjetas de preview
- Estado online/offline por proyecto

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| IA / Backend | Cloudflare Workers + Groq API (LLaMA 3.1) |
| Precios crypto | Binance WebSocket API (tiempo real) |
| Meta crypto | CoinGecko API |
| Noticias | CoinDesk · CoinTelegraph · Decrypt (RSS vía rss2json) |
| Datos globales | USGS · Open-Meteo · WhereTheISS · Alternative.me |
| Tipografía | Courier New (monospace nativa) |
| Hosting | GitHub Pages |
| Control de versiones | Git + GitHub |

---

## Estructura de archivos

```
retroterm-ai/
├── index.html              # HUB principal — navegación y minijuegos
├── defi.html               # DEFI_TERMINAL — mercados, noticias y glosario
├── portal.html             # SILO — puzzle, CORE y zona RESTRICTED
├── turco.html              # Ajedrez con IA y narrativa histórica
├── asistente.html          # Chat con ARIA (IA)
├── editor.html             # Editor de código CODE_CRT
├── articulos.html          # Artículos con filtros por categoría
├── red.html                # Red de proyectos
├── estilos.css             # CSS global compartido con responsive
├── worker_divine-river.js  # Cloudflare Worker para la IA
├── favicon.ico
└── Imagenes/
    ├── turco_grabado.jpg
    ├── turco_gabinete.jpg
    ├── turco_napoleon.jpg
    ├── turco_amazon.jpg
    └── preview_*.jpg       # Capturas de webs para red.html
```

---

## Despliegue

El proyecto corre directamente en **GitHub Pages** sin servidor ni build. Solo HTML, CSS y JS vanilla.

```
https://ivanchux.github.io/retroterm-ai
```

La IA (ARIA) requiere un **Cloudflare Worker** activo con una variable de entorno `GROQ_API_KEY` configurada. Sin él, el asistente no responde pero el resto del sistema funciona con normalidad.

---

## Instalación local

No requiere instalación. Clona el repositorio y abre `index.html` en el navegador:

```bash
git clone https://github.com/Ivanchux/retroterm-ai.git
cd retroterm-ai
# Abre index.html en tu navegador
```

Para desarrollo con live reload:
```bash
npx serve .
```

---

## Capturas

> Próximamente

---

## Roadmap

- [ ] Controles táctiles swipe para Snake en móvil
- [ ] Gráficos de precio histórico en modal de moneda (DEFI_TERMINAL)
- [ ] Modo estética ámbar — toggle verde / ámbar en todo el sistema
- [ ] Más artículos y guías en la sección GAMING
- [ ] Sistema de logros desbloqueables en el portal SILO

---

## Autor

**Ivan Brihuega Crespo** — Proyecto personal desarrollado durante el primer año de ASIR Grado Superior.

- GitHub: [@Ivanchux](https://github.com/Ivanchux)
- Web: [ivanchux.github.io/retroterm-ai](https://ivanchux.github.io/retroterm-ai)

---

## Licencia

© 2025 Ivan Brihuega Crespo. Todos los derechos reservados.

Este proyecto es de autoría propia e intelectual del autor. Queda expresamente prohibida su copia total o parcial, distribución, modificación o uso comercial sin autorización escrita del autor.

El código fuente se comparte públicamente con fines de portfolio y demostración técnica únicamente.

---

*RETROTERM.AI — La máquina siempre tuvo un humano dentro.*
