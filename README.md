# RETROTERM.AI

Proyecto web desarrollado para la asignatura de Desarrollo Web en el ciclo ASIR (Administración de Sistemas Informáticos en Red) del CDM FP, curso 2025/26.

La idea surgió de querer hacer algo diferente al típico portfolio. Me gustan las interfaces antiguas de terminal y quise combinar esa estética con lo que íbamos aprendiendo en clase.

---

## ¿Qué es?

Una plataforma web con estética de terminal retro que funciona como HUB central con varias secciones:

- **Modo Desarrollo** — editor de código integrado (HTML, CSS y JS con preview en tiempo real)
- **Asistente IA** — chat con inteligencia artificial
- **Gaming** — sección personal de videojuegos con fichas y trailers
- **DeFi** — terminal de criptomonedas con datos en tiempo real desde CoinGecko
- **Artículos** — publicaciones técnicas sobre Linux, SEO y el propio proyecto
- **Red de Proyectos** — enlaces a los proyectos de compañeros de clase

---

## Tecnologías usadas

- HTML5 semántico
- CSS3 (Flexbox, animaciones, media queries)
- JavaScript vanilla (sin frameworks)
- API pública de CoinGecko
- Cloudflare Workers (para el asistente IA)
- GitHub Pages (hosting)
- Google Search Console (indexación)

---

## Estructura de archivos

```
/
├── index.html              → HUB principal
├── articulos.html          → Listado de artículos
├── articulo-linux.html     → Artículo: comandos Linux
├── articulo-retroterm.html → Artículo: sobre el proyecto
├── articulo-seo.html       → Artículo: SEO técnico
├── gaming.html             → Sección gaming
├── defi.html               → Terminal DeFi
├── red.html                → Red de proyectos
├── editor.html             → Editor de código CODE_CRT
├── asistente.html          → Asistente IA (ARIA)
├── portal.html             → Portal interno
├── estilos.css             → Hoja de estilos principal
├── editor.css              → Estilos del editor
├── sitemap.xml             → Mapa del sitio
├── robots.txt              → Instrucciones para buscadores
└── /Imagenes/              → Recursos visuales
```

---

## Cosas que he aplicado del temario

- Estructura de SILO en tres niveles para mejorar el SEO interno
- Datos estructurados JSON-LD (Schema.org) con `@type: Article` y `@type: BreadcrumbList`
- Media queries para pantallas menores de 480px
- Metadatos Open Graph para redes sociales
- `sitemap.xml` y `robots.txt` correctamente configurados
- Lazy loading en imágenes
- Navegación CSS pura con `:target` sin JavaScript

---

## Lo que me gustaría añadir en el futuro

- Backend real con base de datos para los artículos
- Sistema de usuarios para la red de proyectos
- Modo claro para accesibilidad
- Más artículos técnicos

---

## Autor

**Iván Brihuega Crespo**  
1º ASIR — CDM FP 2025/26  
[ivanchux.github.io](https://ivanchux.github.io)
