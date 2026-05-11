# RETROTERM.AI — GAMING SECTION · ROADMAP ESTRATÉGICO

## ESTADO ACTUAL (v2)
El código actual ya tiene una base muy sólida:
- ✅ Catálogo con 43 juegos en 4 categorías
- ✅ Sistema de filtros avanzados (plataforma, año, rating, estado)
- ✅ Panel lateral de detalle con trailer, datos, tags
- ✅ Comparativa de hasta 4 juegos
- ✅ Valoraciones de comunidad (localStorage)
- ✅ Sistema de estado personal (jugado/jugando/lista)
- ✅ Perfil "Wrapped" con estadísticas y logros
- ✅ DB Adapter con comentarios Supabase-ready
- ✅ EventBus desacoplado
- ✅ Exportar colección a .txt

---

## ENTREGABLES DE ESTA SESIÓN

### `gaming-data.js` — Capa de datos separada ★
El cambio más importante para facilitar la BD en el futuro.

**Cómo integrarlo en gaming.html:**
```html
<!-- En el <head> de gaming.html, ANTES del <script> inline -->
<script src="gaming-data.js"></script>

<!-- Luego en gaming.html, eliminar: -->
<!-- ► El bloque /* __JUEGOS_START__ */ ... /* __JUEGOS_END__ */ -->
<!-- ► La definición de CATS = [...] -->
<!-- ► Las constantes RATING_LABELS, ESTADO_LABELS, PLAT_LABELS -->
<!-- (ya están en gaming-data.js) -->
```

**Resultado:** gaming.html queda ~150KB más ligero. Los datos
están en un archivo separado que puedes versionar, editar y
migrar a BD sin tocar la UI.

---

## IDEAS DIFERENCIADORAS — RANKING DE IMPACTO

### 🥇 TIER 1 — Impacto alto, implementación viable

#### 1. SISTEMA DE GUÍAS COMPLETAS (`gaming-guia.html`)
**Por qué es diferenciador:** Ninguna web de recomendación personal
tiene guías integradas en el mismo estilo visual. La mayoría
te manda a IGN/Fandom. Tú puedes ofrecer guías con la estética
retro-terminal que es la firma del proyecto.

**Estructura de una guía:**
```javascript
// En gaming-data.js, añadir a un juego:
hasGuia: true,
guia: {
  version: "1.0",
  fechaUpdate: "2026-04-22",
  secciones: [
    {
      id: "inicio",
      titulo: "PRIMEROS PASOS",
      icono: "▶",
      contenido: `<p>HTML con la guía...</p>`
    },
    {
      id: "builds",
      titulo: "BUILDS RECOMENDADAS",
      icono: "⚙",
      contenido: `...`
    },
    {
      id: "secretos",
      titulo: "SECRETOS Y COLECCIONABLES",
      icono: "◈",
      contenido: `...`
    },
    {
      id: "finales",
      titulo: "TODOS LOS FINALES",
      icono: "◉",
      contenido: `...`
    }
  ],
  tips: [
    "Tip corto 1",
    "Tip corto 2"
  ]
}
```

**gaming-guia.html** leería `?id=cyberpunk`, buscaría el juego
en gaming-data.js y renderizaría la guía en el mismo estilo terminal
con índice lateral, barra de progreso de lectura y botón de volver.

**Workflow para ir añadiendo guías:**
1. En gaming-data.js → `hasGuia: true` al juego
2. Escribir el campo `guia: { secciones: [...] }`
3. La página gaming.html muestra automáticamente el botón "VER GUÍA"

---

#### 2. FILTRO DE TIEMPO ESTIMADO + MODO "¿CUÁNTO TIEMPO TENGO?"
**Por qué es diferenciador:** Pregunta real de cualquier gamer.
"Tengo 2 horas hoy, ¿qué puedo jugar?"

**Los datos ya están** en gaming-data.js (`tiempoHoras`).

**Implementación en gaming.html:**
```javascript
// Añadir chip de filtro de tiempo en la barra de filtros:
// < 10H · 10-30H · 30-60H · 60-100H · +100H

// En FilterState añadir:
tiempos: new Set(),

// En gameMatchesFilters añadir:
if (FilterState.tiempos.size) {
  const h = j.tiempoHoras || 0;
  const match = [...FilterState.tiempos].some(rango => {
    if (rango === 'micro')  return h <= 10;
    if (rango === 'corto')  return h > 10 && h <= 30;
    if (rango === 'medio')  return h > 30 && h <= 60;
    if (rango === 'largo')  return h > 60 && h <= 100;
    if (rango === 'epico')  return h > 100;
    return false;
  });
  if (!match) return false;
}
```

**En la card** mostrar el tiempo con un icono de reloj:
```html
<div class="g-card-tiempo">⏱ ~${j.tiempoHoras}H</div>
```

---

#### 3. FILTRO DE MODO DE JUEGO (SOLO / COOP / ONLINE)
Los datos ya están (`modoJuego`). Solo falta el UI.
Útil para: "busco algo para jugar con mi novia" → filtro COOP.

---

#### 4. FILTRO DE DIFICULTAD
Los datos ya están (`dificultad`). Solo falta el UI.
Chips: BAJA / MEDIA / ALTA / MUY ALTA

---

#### 5. BADGE "NUEVO" EN CARDS
Para juegos con `nuevo: true` (Crimson Desert, 007 First Light).
Similar al badge HOT que ya existe pero en color verde/azul distinto.

```javascript
// En makeCard, junto al badge HOT:
${j.nuevo ? '<div class="g-card-nuevo">★ NUEVO</div>' : ''}
```

---

### 🥈 TIER 2 — Muy diferenciadoras, más trabajo

#### 6. MODO "SORPRÉNDEME INTELIGENTE"
El botón sorpresa actual es aleatorio. Hacerlo inteligente:
- Detecta qué géneros has marcado como jugados
- Sugiere juegos de géneros/tags similares que NO hayas jugado
- "Porque jugaste Dishonored, prueba: Prey, Deathloop..."

```javascript
function getSorpresaInteligente() {
  const jugados = JUEGOS.filter(j => DB.getEstado(j.id) === 'jugado');
  if (!jugados.length) return JUEGOS[Math.floor(Math.random() * JUEGOS.length)];

  // Tags más frecuentes en jugados
  const tagCount = {};
  jugados.forEach(j => (j.tags||[]).forEach(t => {
    tagCount[t] = (tagCount[t]||0) + 1;
  }));

  // Juegos no jugados con más tags en común
  const nojugados = JUEGOS.filter(j => DB.getEstado(j.id) === 'ninguno');
  const scored = nojugados.map(j => ({
    j,
    score: (j.tags||[]).reduce((s,t) => s + (tagCount[t]||0), 0)
  })).sort((a,b) => b.score - a.score);

  // Top 5 con más afinidad, elegir uno al azar
  const pool = scored.slice(0, 5);
  return pool[Math.floor(Math.random() * pool.length)].j;
}
```

---

#### 7. VISTA "LÍNEA DEL TIEMPO"
Un modo de visualización alternativo (además del carrusel actual)
que ordena todos los juegos en una línea temporal de 1999 a 2026,
con marcadores visuales por año. Único entre páginas de gaming.

Activación: botón "TIMELINE" junto a los tabs actuales.
Implementación: `position: sticky` para el año, `flex-column` para el listado.

---

#### 8. COMPARATIVA EXPORTABLE COMO IMAGEN
La comparativa actual muestra un modal. Añadir botón "EXPORTAR PNG"
usando `html2canvas` (librería CDN, ~100KB):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

```javascript
document.getElementById('g-compare-export').addEventListener('click', async () => {
  const el = document.getElementById('g-compare-modal-grid');
  const canvas = await html2canvas(el, { backgroundColor: '#000' });
  const a = document.createElement('a');
  a.download = 'retroterm-comparativa.png';
  a.href = canvas.toDataURL();
  a.click();
  toastShow('⬇ IMAGEN EXPORTADA');
});
```

---

#### 9. SISTEMA DE LISTAS PERSONALIZADAS
En lugar de solo jugado/jugando/lista, permitir crear listas
con nombre propio: "Para jugar este verano", "Recomendados a Pablo"...

Estructura en localStorage (o Supabase después):
```javascript
// Nuevo en DB:
getListas() { return JSON.parse(localStorage.getItem('rt_listas')) || []; },
crearLista(nombre) {
  const listas = this.getListas();
  const id = 'lista_' + Date.now();
  listas.push({ id, nombre, juegos: [], creadaEl: new Date().toISOString() });
  localStorage.setItem('rt_listas', JSON.stringify(listas));
  return id;
},
addToLista(listaId, gameId) { ... }
```

---

#### 10. MODO OSCURO / VERDE TOGGLE (Amber mode)
La paleta actual es verde (#00ff66). Añadir modo ámbar (#ffb000)
que cambia toda la paleta. Ya tienes `--amber` definido.

```javascript
document.getElementById('btn-amber-mode').addEventListener('click', () => {
  document.documentElement.classList.toggle('amber-mode');
  localStorage.setItem('rt_colormode',
    document.documentElement.classList.contains('amber-mode') ? 'amber' : 'green');
});
```

```css
.amber-mode { --g: #ffb000; --g2: #ffcc55; --dim: #331a00; }
```

---

### 🥉 TIER 3 — Futuribles con BD

#### 11. RANKINGS COMUNITARIOS EN TIEMPO REAL
Cuando conectes Supabase, el sistema de reviews ya está preparado.
El siguiente paso es un ranking público de los juegos mejor valorados
por la comunidad, ordenado por `avg_score` desde la BD.

```sql
-- Vista Supabase:
CREATE VIEW game_rankings AS
SELECT game_id,
       AVG(score) as avg_score,
       COUNT(*) as total_votes
FROM reviews
GROUP BY game_id
ORDER BY avg_score DESC;
```

#### 12. PERFIL DE USUARIO CON AUTH
Supabase Auth (Google/GitHub OAuth). Una vez con usuario:
- Estado de juegos sincronizado entre dispositivos
- Reviews asociadas a perfil real
- Ver colección de otros usuarios
- "X amigos han jugado este juego"

#### 13. NOTIFICACIONES DE JUEGOS NUEVOS
Sistema de newsletter/notificación cuando se añade un juego
al catálogo con `nuevo: true`. Con Supabase realtime o
simplemente un RSS feed generado desde los datos.

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
FASE 1 — Esta semana (sin BD):
  [x] gaming-data.js separado (YA HECHO)
  [ ] Integrar gaming-data.js en gaming.html (ver instrucciones arriba)
  [ ] Añadir filtros: tiempo, modo, dificultad
  [ ] Badge NUEVO en cards
  [ ] Sorpréndeme inteligente

FASE 2 — Próximas semanas (sin BD):
  [ ] Primera guía completa (elige Cyberpunk o Witcher 3)
  [ ] gaming-guia.html (estructura de página de guía)
  [ ] Vista timeline
  [ ] Modo amber toggle

FASE 3 — Cuando tengas BD:
  [ ] Migrar JUEGOS a Supabase (el script de migración ya está en gaming-data.js)
  [ ] Reviews reales con auth
  [ ] Rankings públicos
  [ ] Notificaciones

FASE 4 — Largo plazo:
  [ ] Perfiles de usuario
  [ ] Listas personalizadas compartibles
  [ ] Comparativa exportable como imagen
```

---

## AÑADIR UN JUEGO NUEVO — Checklist

1. Consigue la imagen (600x800px aprox, relación 3:4) → `Imagenes/Gaming/nombre.jpg`
2. Copia la estructura de un juego similar en `gaming-data.js`
3. Rellena todos los campos, especialmente los nuevos:
   - `tiempoHoras`, `dificultad`, `modoJuego`
   - `hasGuia: false` (cambiar a true cuando escribas la guía)
   - `nuevo: true` si es un lanzamiento reciente
   - `destacado: true` si quieres que aparezca en sección de destacados
4. El catálogo lo recoge automáticamente

---

*Generado: 2026-04-22 | RETROTERM.AI Gaming Section v3.0*
