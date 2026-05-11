/**
 * ═══════════════════════════════════════════════════════════════
 *  RETROTERM.AI — GAMING DATA LAYER v3.0
 *  gaming-data.js
 *
 *  ARQUITECTURA:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  gaming-data.js  ◄──  Esta capa de datos               │
 *  │  gaming.html     ◄──  UI principal (consume este JS)   │
 *  │  gaming-ficha.html ◄── Ficha individual (consume este) │
 *  │  gaming-guia.html  ◄── Guías completas (PRÓXIMO)       │
 *  └─────────────────────────────────────────────────────────┘
 *
 *  MIGRACIÓN A BASE DE DATOS:
 *  Cuando conectes Supabase (o cualquier BD), solo tienes que:
 *  1. Sustituir el array JUEGOS por una llamada a tu API
 *  2. El resto de gaming.html no cambia
 *
 *  PARA AÑADIR UN JUEGO NUEVO:
 *  Copia una entrada del array, cambia los campos y ya.
 *  Los campos obligatorios están marcados con [REQ].
 *
 *  PARA AÑADIR UNA GUÍA:
 *  Añade el campo `guia` a la entrada del juego (ver estructura abajo).
 *  gaming-guia.html la leerá automáticamente.
 * ═══════════════════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────────────────────
   CATEGORÍAS — Añade aquí nuevas categorías si las necesitas
   ───────────────────────────────────────────────────────────── */
const CATS = [
  { id: "rpg",     label: "🌍 MUNDO ABIERTO / RPG",  color: "#00ff66" },
  { id: "accion",  label: "🗡️ ACCIÓN / AVENTURA",    color: "#ff6644" },
  { id: "comedia", label: "😂 COMEDIA / OTROS",       color: "#ffb000" },
  { id: "clasico", label: "🕹️ CLÁSICOS",             color: "#44aaff" },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS DE LOOKUP
   ───────────────────────────────────────────────────────────── */
const RATING_LABELS = { 1:'FLOJO', 2:'PASABLE', 3:'NOTABLE', 4:'MUY BUENO', 5:'IMPRESCINDIBLE' };
const ESTADO_LABELS = { ninguno:'· · ·', jugado:'● JUGADO', jugando:'◐ JUGANDO', lista:'○ EN LISTA' };
const PLAT_LABELS   = { pc:'PC', ps:'PS', xbox:'XBOX', mac:'MAC', movil:'MÓVIL', arcade:'ARCADE', dc:'DREAMCAST', switch:'SWITCH' };

/* ─────────────────────────────────────────────────────────────
   ESTRUCTURA DE UN JUEGO — Referencia completa
   Campos marcados con ★ son nuevos respecto a v2
   ───────────────────────────────────────────────────────────── */
/*
{
  // ── IDENTIFICACIÓN [REQ] ──────────────────────────────────
  id:        "string único",          // slug sin espacios: "cyberpunk", "rdr2"
  titulo:    "NOMBRE EN MAYÚSCULAS",
  cat:       "rpg|accion|comedia|clasico",
  catLabel:  "MUNDO ABIERTO / RPG",   // etiqueta visible

  // ── METADATOS [REQ] ───────────────────────────────────────
  genero:    "RPG · Mundo Abierto",
  anio:      "2020",                  // string para consistencia
  rating:    5,                       // 1-5 (rating editorial)
  plataformas: ["pc","ps","xbox"],
  img:       "Imagenes/Gaming/nombre.jpg",
  tags:      ["rpg","mundo-abierto"], // para búsqueda y filtros

  // ── DESCRIPCIÓN ──────────────────────────────────────────
  desc:      "Frase corta para la card",
  datos: [                            // tabla de datos del panel
    { k: "Desarrollador", v: "CD Projekt Red" },
  ],
  texto: `<p>HTML largo para el panel lateral</p>`, // acepta HTML

  // ── MEDIA ────────────────────────────────────────────────
  trailer:   "https://www.youtube.com/embed/ID?autoplay=1&mute=1",

  // ── ★ NUEVO: GUÍA COMPLETA ────────────────────────────────
  // Si existe, gaming-guia.html muestra un botón "Ver Guía"
  // Puede ser solo hasGuia:true (carga guia/{id}.html)
  // o inline con la estructura completa
  hasGuia:   false,                   // true cuando exista gaming-guia.html?id=...

  // ── ★ NUEVO: METADATOS EXTRA ──────────────────────────────
  tiempoHoras:  80,                   // horas estimadas para completar
  dificultad:   "ALTA",               // BAJA / MEDIA / ALTA / MUY ALTA
  modoJuego:    ["single","online"],  // single, online, coop, local
  esGratuito:   false,
  precioBase:   59.99,                // EUR
  linkCompra:   "",                   // URL opcional
  fechaAdd:     "2026-04-22",         // cuando se añadió al catálogo RT
  destacado:    false,                // aparece en sección "Destacados"
  nuevo:        false,                // badge "NUEVO" en la card (últimos 30 días)
}
*/

/* ═══════════════════════════════════════════════════════════════
   CATÁLOGO PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
/* __JUEGOS_START__ */
const JUEGOS = [

// ── MUNDO ABIERTO / RPG ───────────────────────────────────────

  {
    id: "cyberpunk",
    tags: ["rpg","mundo-abierto","cyberpunk","accion","narrativo","futurista"],
    titulo: "CYBERPUNK 2077",
    genero: "RPG · Mundo Abierto · Acción",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2020",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/cyberpunk_2077.jpg",
    desc: "Night City, 2077. Megacorporaciones, implantes y una historia que no te suelta.",
    datos: [
      { k: "Desarrollador", v: "CD Projekt Red" },
      { k: "Año", v: "2020" },
      { k: "Plataforma", v: "PC / PS5 / Xbox" },
      { k: "DLC", v: "Phantom Liberty" }
    ],
    trailer: "https://www.youtube.com/embed/UWye-NVcuuU?autoplay=1&mute=1",
    tiempoHoras: 60,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: true,
    destacado: true,
    fechaAdd: "2026-01-01",
    guia: {
      version: "1.0",
      fechaUpdate: "2026-05-09",
      secciones: [
        {
          id: "inicio",
          titulo: "PRIMEROS PASOS",
          icono: "▶",
          contenido: `
            <p>Cyberpunk 2077 puede abrumar al principio. Night City te lanza al vacío con decenas de sistemas, misiones y opciones. Aquí tienes lo esencial para no perder el tiempo.</p>
            <h4>ELIGE TU ORIGEN CON CABEZA</h4>
            <p>El origen (Nómada, Callejero, Corpo) solo cambia el prólogo y algunos diálogos, no el desarrollo central. <strong>Nómada</strong> es el más cinematográfico y el mejor para una primera partida. Corpo da más contexto si quieres entender la política corporativa. Callejero es el más típico "come-from-below".</p>
            <h4>ATRIBUTOS INICIALES — QUÉ SUBIR</h4>
            <p>Tienes 7 puntos para repartir al inicio. No te equivoques:</p>
            <ul>
              <li><strong>Cuerpo</strong> — necesario para forzar puertas y algunas líneas de diálogo brutales. Mínimo 6.</li>
              <li><strong>Inteligencia</strong> — si quieres jugar de Netrunner, empieza con 6-7. Desbloquea diálogos clave al final.</li>
              <li><strong>Reflejos</strong> — para builds de pistolero o espadas katana. Muy divertido.</li>
              <li><strong>Frío Sanguíneo</strong> — para sigilo y críticos. Potente pero menos visual.</li>
              <li><strong>Técnica</strong> — rifles y granadas inteligentes. Daño masivo, menos habilidad mecánica.</li>
            </ul>
            <h4>LO PRIMERO QUE DEBES HACER</h4>
            <p>Antes de lanzarte a la historia principal, haz esto:</p>
            <ul>
              <li>Completa las misiones de Jackie Welles — son el mejor prólogo emocional del juego.</li>
              <li>Habla con los fijadores del mapa (Padre, Regina, Wakako) para desbloquear contratos — son fuente de dinero y equipo.</li>
              <li>Sube el atributo Atletismo simplemente corriendo. Da stats de supervivencia que valen la pena desde el principio.</li>
              <li>No vendas la ropa al principio — los atributos que da la ropa importan más que el estilo.</li>
            </ul>
          `
        },
        {
          id: "builds",
          titulo: "BUILDS RECOMENDADAS",
          icono: "⚙",
          contenido: `
            <p>Cyberpunk no tiene clases fijas — construyes tu personaje combinando atributos y habilidades. Estas son las cuatro builds más divertidas y efectivas.</p>

            <h4>◈ NETRUNNER / HACKER</h4>
            <p><em>Atributos: Inteligencia 20 + Frío Sanguíneo 15+</em></p>
            <p>La build más poderosa del juego una vez que escala. Hackeas enemigos desde la distancia sin entrar en combate, sobrecalientas sistemas y te vuelves prácticamente invisible. El daño por "Cadena Rápida de Hack" con mejoras del árbol de Inteligencia hace que los enemigos exploten en cascada.</p>
            <p><strong>Habilidades clave:</strong> Cadena Rápida, Sobrecargar Protocolo, Síntesis Neuronal, Netwatch Netdriver MK.5 (implante de brazo).</p>
            <p><strong>Arma principal:</strong> Silenciada + pistola de respaldo para cuando hackear no es suficiente.</p>

            <h4>◈ SAMURAI DE FUERZA BRUTA</h4>
            <p><em>Atributos: Cuerpo 20 + Reflejos 15</em></p>
            <p>Katanas, brazos de gorila y entrar en cualquier puerta. Brutalmente divertida, muy cinemática. El árbol de Reflejos con la especialización en cuchillas te da evasiones y esquivas que hacen el combate cuerpo a cuerpo fluido y espectacular.</p>
            <p><strong>Habilidades clave:</strong> Mantis Blades o Gorilla Arms (implantes), árbol de Cuchillas, Adrenalina Rush, Amortiguador de Impacto.</p>
            <p><strong>Arma principal:</strong> Katana Satori (se consigue en el Helipad del capítulo 1) o Mantis Blades doradas.</p>

            <h4>◈ FANTASMA / PISTOLERO</h4>
            <p><em>Atributos: Reflejos 20 + Frío Sanguíneo 15</em></p>
            <p>Pistolas silenciadas, sigilo y headshots críticos. La más elegante. El árbol de Frío Sanguíneo amplifica el daño crítico hasta niveles absurdos, y las pistolas con silenciador permiten limpiar habitaciones completas sin que nadie reaccione.</p>
            <p><strong>Habilidades clave:</strong> Armas de Precisión, Frío Como el Hielo, Punto Débil, Especímenes Únicos.</p>
            <p><strong>Arma principal:</strong> Cometa (pistola icónica de Silverbard), Seraph o la pistola de Johnny Silverhand.</p>

            <h4>◈ INGENIERO DE COMBATE</h4>
            <p><em>Atributos: Técnica 20 + Cuerpo 12</em></p>
            <p>Rifles inteligentes que disparan a través de coberturas, granadas mejoradas y el mejor equipo del juego. Menos habilidad mecánica, más daño bruto. Perfecta para quien quiere sentirse overpowered sin demasiado entrenamiento en el combate.</p>
            <p><strong>Habilidades clave:</strong> Ingeniería de Armas, Rifles Inteligentes, Granada Mejorada.</p>
            <p><strong>Arma principal:</strong> Comisario (escopeta icónica), Raiju o cualquier rifle inteligente épico/legendario.</p>
          `
        },
        {
          id: "historia",
          titulo: "HISTORIA Y DECISIONES CLAVE",
          icono: "◉",
          contenido: `
            <p>Cyberpunk 2077 tiene una historia principal relativamente corta (15-20h) rodeada de contenido secundario de primera calidad. Aquí el orden y las decisiones que realmente importan.</p>

            <h4>ORDEN RECOMENDADO</h4>
            <ol>
              <li><strong>Prólogo + Acto 1</strong> — Completa las misiones de Jackie sin saltarte nada. El final del Acto 1 es el punto de inflexión emocional del juego.</li>
              <li><strong>Acto 2 temprano</strong> — Antes de avanzar en la historia, sube a nivel 15-20 haciendo contratos y misiones de los fijadores. El juego es más disfrutable con un personaje desarrollado.</li>
              <li><strong>Misiones de los románticos</strong> — Panam, Judy, River, Kerry. HAZLAS. No son opcionales si quieres ciertos finales y son de lo mejor que ofrece el juego narrativamente.</li>
              <li><strong>Phantom Liberty</strong> — Si tienes la expansión, juégala cuando llegues al nivel 30-35. Tiene su propio final que afecta al juego base.</li>
              <li><strong>Final de la historia principal</strong> — Cuando hayas completado lo anterior.</li>
            </ol>

            <h4>DECISIONES QUE CAMBIAN EL FINAL</h4>
            <p>Sin spoilers directos, estas son las decisiones que más importan:</p>
            <ul>
              <li>La elección que haces <em>durante la misión de Viktor</em> cerca del final del Acto 2.</li>
              <li>Completar o no las misiones de <strong>Panam Palmer</strong> y el clan Aldecaldos.</li>
              <li>Completar o no las misiones de <strong>Rogue Amendiares</strong> y la relación con Johnny.</li>
              <li>Tu <em>nivel de empatía con Johnny</em> durante las conversaciones a lo largo del juego — hay un indicador invisible que sube con ciertas respuestas.</li>
              <li>Si tienes Phantom Liberty: la decisión en el clímax de la expansión abre o cierra el 6º final.</li>
            </ul>

            <h4>MISIONES SECUNDARIAS QUE SON OBLIGATORIAS</h4>
            <p>Estas no son "secundarias" en calidad:</p>
            <ul>
              <li><strong>Buscando a Evelyn</strong> (Judy) — una de las mejores cadenas de misiones del juego.</li>
              <li><strong>Riders on the Storm</strong> (Panam) — imprescindible para el final de los Aldecaldos.</li>
              <li><strong>A Like Supreme</strong> (Kerry) — divertidísima y diferente al resto.</li>
              <li><strong>Chippin' In</strong> (Johnny/Rogue) — clave para desbloquear el final de la banda.</li>
            </ul>
          `
        },
        {
          id: "secretos",
          titulo: "SECRETOS Y ARMAS ICÓNICAS",
          icono: "◈",
          contenido: `
            <p>Night City está llena de armas únicas, vehículos especiales y easter eggs. Aquí los más destacados.</p>

            <h4>ARMAS ICÓNICAS QUE NO TE PUEDES PERDER</h4>
            <ul>
              <li><strong>Mantis Blades de Sasquatch</strong> — derrotando a la jefa en "Promesas de la Familia". Las mejores cuchillas del juego.</li>
              <li><strong>Pistola de Johnny Silverhand (Malorian 3516)</strong> — misión "Chippin' In". La más icónica del juego.</li>
              <li><strong>Katana Satori</strong> — en el tejado del helipad del Emissary Hotel justo después del prólogo. Ve antes de que desaparezca.</li>
              <li><strong>Cometa</strong> — en el cuerpo de Cyberpsycho "Silverbard" en Pacifica. Pistola smart devastadora.</li>
              <li><strong>Overture</strong> — pistola de River Ward, se consigue completando su arco de misiones.</li>
              <li><strong>Rifle Raiju</strong> — comprable en el vendedor de Watson después del nivel 30. El mejor rifle smart del juego.</li>
            </ul>

            <h4>VEHÍCULOS ESPECIALES</h4>
            <ul>
              <li><strong>Porsche 911 Turbo de Jackie</strong> — tras su muerte, busca el mensaje de Mama Welles. El coche te llegará por correo.</li>
              <li><strong>Quadra Turbo-R "Johnny"</strong> — en el garaje que se menciona en "Chippin' In". El coche rojo de la leyenda.</li>
              <li><strong>Aerodyne Villefort Columbus</strong> — completando todas las misiones de El Padre. El mejor vehículo todo-terreno.</li>
            </ul>

            <h4>EASTER EGGS DESTACADOS</h4>
            <ul>
              <li><strong>El cuerpo del depósito de agua</strong> — en el norte del mapa hay un depósito con un cuerpo en el fondo. Referencia a Breaking Bad.</li>
              <li><strong>El monolito de 2001</strong> — en el desierto al oeste, un monolito negro perfectamente colocado espera a quien explore.</li>
              <li><strong>Referencia a The Witcher</strong> — busca las tarjetas de personajes de Gwent en ciertos apartamentos abandonados.</li>
              <li><strong>El Joker / Batman</strong> — hay un grafiti en la Ciudad Fantasma que representa a dos figuras claramente inspiradas.</li>
            </ul>

            <h4>IMPLANTES QUE CAMBIAN EL JUEGO</h4>
            <ul>
              <li><strong>Sistema Nervioso — Berserk o Sandevistan</strong>: el Sandevistan ralentiza el tiempo, imprescindible para combate cuerpo a cuerpo de alto nivel.</li>
              <li><strong>Brazos — Gorilla Arms</strong>: para forzar puertas y golpes devastadores. Dan acceso a contenido exclusivo.</li>
              <li><strong>Sistema Ocular — Kiroshi Optics Mk.3</strong>: escáneres mejorados que revelan debilidades de enemigos.</li>
            </ul>
          `
        },
        {
          id: "finales",
          titulo: "TODOS LOS FINALES",
          icono: "◉",
          contenido: `
            <p>Cyberpunk 2077 tiene 6 finales (7 con Phantom Liberty). Aquí están todos, con cómo desbloquearlos y lo que implican. <em>Spoilers menores de nombres, no de detalles.</em></p>

            <h4>◈ FINAL "SOLO UN CAMINO" — El camino solitario</h4>
            <p><strong>Requisito:</strong> No completar las misiones de Panam NI las de Rogue/Johnny. Disponible siempre.</p>
            <p>V decide enfrentarse a Arasaka solo, sin aliados. El más trágico. Considerado por muchos el final "canon" para la primera partida.</p>

            <h4>◈ FINAL "ALDECALDOS" — El precio de la lealtad</h4>
            <p><strong>Requisito:</strong> Completar todas las misiones de Panam Palmer.</p>
            <p>V y los Aldecaldos van juntos a lo que sea. El final más esperanzador del juego base. Si tienes relación romántica con Panam, el epílogo cambia.</p>

            <h4>◈ FINAL "LA BANDA" — Donde está el corazón</h4>
            <p><strong>Requisito:</strong> Completar "Chippin' In" y tener alta empatía con Johnny.</p>
            <p>Johnny toma el control con el cuerpo de V. Rogue lidera el asalto. Cinematográficamente el más rockero. Tiene dos variantes según las relaciones.</p>

            <h4>◈ FINAL "ARASAKA" — Los caminos de la corporación</h4>
            <p><strong>Requisito:</strong> Aceptar la oferta de Hanako Arasaka en "Nocturno OP55N1".</p>
            <p>V se alía con la megacorporación. El final más moralmente ambiguo. Tiene el epílogo más extenso y gris.</p>

            <h4>◈ FINAL SECRETO — "Aquí hay dragones"</h4>
            <p><strong>Requisito:</strong> Llama a Rogue en "Nocturno OP55N1" (en lugar de Panam o Hanako) + haber completado "Chippin' In" + haber subido suficiente empatía con Johnny.</p>
            <p>Un final solo para quienes exploran cada diálogo. Diferente, íntimo y sorprendente.</p>

            <h4>◈ FINAL PHANTOM LIBERTY — "Nuevo amanecer / Perros de la guerra"</h4>
            <p><strong>Requisito:</strong> Tener la expansión + tomar la decisión correcta en el clímax de Dogtown.</p>
            <p>Reed y Myers entran en juego. Tiene el epílogo más largo y detallado de todos, con consecuencias en el juego base. Si quieres el final más completo narrativamente, este es.</p>

            <h4>CONSEJO FINAL</h4>
            <p>Guarda una partida antes de "Nocturno OP55N1" (la misión que desencadena el final). Desde ahí puedes acceder a todos los finales sin repetir 30 horas de juego.</p>
          `
        }
      ],
      tips: [
        "Sube Atletismo corriendo en los primeros minutos — da stats de supervivencia sin combate.",
        "Phantom Liberty se disfruta mejor con personaje nivel 30+ para ver todas las opciones.",
        "El coche de Jackie Welles se puede recuperar — busca el mensaje de Mama Welles después de su muerte.",
        "Guarda siempre antes de 'Nocturno OP55N1' — desde ahí puedes ver todos los finales.",
        "Las misiones de los fijadores (Padre, Regina, Wakako) son la mejor fuente de dinero al inicio.",
        "El Sandevistan (implante del sistema nervioso) hace el combate cuerpo a cuerpo espectacular.",
        "El árbol de Inteligencia con Cadena Rápida de Hack hace explotar enemigos en cascada.",
        "El 6º final solo está disponible si tienes Phantom Liberty — y merece la pena.",
        "El Porsche 911 Turbo de Johnny es el mejor vehículo del juego en control y velocidad.",
        "Las armaduras con el set completo de Militech dan bonus de sigilo brutales para builds fantasma."
      ]
    },
    texto: `
      <p>Night City, 2077. Una megalópolis controlada por megacorporaciones donde la vida humana vale lo que tu reputación en la calle. Encarnas a V, un mercenario que tras un golpe fallido acaba con el fantasma digital de una leyenda del rock grabado en su cabeza.</p>
      <h3>POR QUÉ MERECE LA PENA</h3>
      <p>El lanzamiento fue un desastre, sí. Pero tras años de parches y la expansión Phantom Liberty, Cyberpunk 2077 es uno de los mejores RPGs de mundo abierto que existen. La narrativa es brutal, Night City tiene una densidad de detalle que pocas ciudades virtuales han igualado y la banda sonora es de otro nivel.</p>
      <h3>LO MEJOR</h3>
      <p>La historia de Johnny Silverhand, la expansión Phantom Liberty y la cantidad de decisiones que realmente cambian el juego. Cada run es diferente según el origen que elijas al principio.</p>
    `
  },
  {
    id: "rdr",
    tags: ["rpg","mundo-abierto","western","narrativo","rockstar","inmersivo"],
    titulo: "RED DEAD REDEMPTION 2",
    genero: "Acción · Western · Inmersivo",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2018",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/red_dead_redemption2.jpg",
    desc: "El salvaje oeste más vivo que existe en un videojuego. Arthur Morgan es historia.",
    datos: [
      { k: "Desarrollador", v: "Rockstar Games" },
      { k: "RDR1", v: "2010" },
      { k: "RDR2", v: "2018" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" }
    ],
    trailer: "https://www.youtube.com/embed/MyaYlbizpvs?autoplay=1&mute=1",
    tiempoHoras: 60,
    dificultad: "MEDIA",
    modoJuego: ["single","online"],
    hasGuia: false,
    destacado: true,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Dos historias del salvaje oeste separadas por décadas pero conectadas por el mismo universo. RDR2 es la precuela: Arthur Morgan, forajido con más honor del que debería tener, intentando sobrevivir al fin de una era. RDR1 cierra la historia con John Marston y uno de los finales más recordados de los videojuegos.</p>
      <h3>POR QUÉ MERECE LA PENA</h3>
      <p>RDR2 es probablemente el juego con el mundo más vivo que existe. Los NPCs tienen rutinas reales, los animales se comportan de forma creíble y cada rincón del mapa tiene algo que descubrir.</p>
      <h3>LO MEJOR</h3>
      <p>El honor importa. Cada decisión afecta cómo te trata el mundo. Y el capítulo 6 de RDR2 es de las experiencias más emotivas que vas a tener delante de una pantalla.</p>
    `
  },
  {
    id: "nms",
    tags: ["rpg","mundo-abierto","exploracion","scifi","sandbox","supervivencia"],
    titulo: "NO MAN'S SKY",
    genero: "Exploración · Supervivencia · Sci-Fi",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2016",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/no_mans_sky.jpg",
    desc: "18 trillones de planetas y la historia de redención de un estudio que no se rindió.",
    datos: [
      { k: "Desarrollador", v: "Hello Games" },
      { k: "Año", v: "2016" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" },
      { k: "Updates", v: "+20 gratuitas" }
    ],
    trailer: "https://www.youtube.com/embed/A6-9PMgqBbQ?autoplay=1&mute=1",
    tiempoHoras: 100,
    dificultad: "BAJA",
    modoJuego: ["single","online","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Universo procedural con 18 trillones de planetas, cada uno único. Empiezas varado en un planeta aleatorio sin recursos y sin saber muy bien qué estás haciendo.</p>
      <h3>LA HISTORIA DE SU REDENCIÓN</h3>
      <p>El lanzamiento fue otro desastre histórico. Pero Hello Games, sin decir nada a nadie, durante años fue sacando actualizaciones gratuitas masivas que convirtieron el juego en algo completamente diferente.</p>
      <h3>LO MEJOR</h3>
      <p>La libertad total. Puedes pasarte horas solo explorando planetas sin hacer nada concreto y es perfectamente válido.</p>
    `
  },
  {
    id: "kcd2",
    tags: ["rpg","mundo-abierto","medieval","historico","realista"],
    titulo: "KINGDOM COME: DELIVERANCE 2",
    genero: "RPG · Medieval Realista",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2025",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/kingdom_come_deliverance.jpg",
    desc: "Sin magia, sin dragones. Solo Bohemia en el siglo XV y consecuencias reales.",
    datos: [
      { k: "Desarrollador", v: "Warhorse Studios" },
      { k: "Año", v: "2025" },
      { k: "Plataforma", v: "PC / PS5 / Xbox" },
      { k: "Ambientación", v: "Bohemia, s. XV" }
    ],
    trailer: "https://www.youtube.com/embed/8CuaPM70iu4?autoplay=1&mute=1",
    tiempoHoras: 70,
    dificultad: "ALTA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Continúa la historia de Henry de Skalitz. KCD2 amplía todo lo que hizo grande al primero con un mapa más grande, más opciones de diálogo y el mismo nivel de detalle histórico obsesivo.</p>
      <h3>POR QUÉ ES DIFERENTE</h3>
      <p>No hay elfos ni dragones. Es un RPG medieval realista en el que si te pillan robando te meten en la cárcel, si vas sucio la gente te trata peor y si no entrenas el combate pierdes los duelos.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de combate cuerpo a cuerpo, uno de los más realistas del género. Y la sensación de que cada decisión tiene consecuencias reales en el mundo.</p>
    `
  },
  {
    id: "fable",
    tags: ["rpg","fantasia","humor","sandbox"],
    titulo: "FABLE 2",
    genero: "RPG · Acción · Fantasía",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2008",
    rating: 4,
    plataformas: ["xbox"],
    img: "Imagenes/Gaming/fable.jpg",
    desc: "Albion y su humor británico. Y el reboot que viene por fin.",
    datos: [
      { k: "Desarrollador", v: "Lionhead Studios" },
      { k: "Año", v: "2008" },
      { k: "Plataforma", v: "Xbox 360" },
      { k: "Próximo", v: "Fable (2025)" }
    ],
    trailer: "https://www.youtube.com/embed/PEQRwpMYPaw?autoplay=1&mute=1",
    tiempoHoras: 25,
    dificultad: "BAJA",
    modoJuego: ["single","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Albion, un mundo de fantasía con mucho humor británico y una libertad inusual para la época. Puedes ser el héroe más noble o el villano más temido, casarte, tener hijos, comprar propiedades y hacerte rico alquilándolas.</p>
      <h3>POR QUÉ SIGUE SIENDO ESPECIAL</h3>
      <p>Fable 2 tiene un encanto que pocos juegos han vuelto a conseguir. El tono, el humor, la música de Russell Shaw y esa sensación de que el mundo reacciona a todo lo que haces.</p>
      <h3>EL NUEVO FABLE</h3>
      <p>Playground Games están desarrollando un reboot para Xbox Series X y PC. Las primeras imágenes muestran un Albion de cuento de hadas con un tono que recuerda al espíritu del original.</p>
    `
  },
  {
    id: "witcher3",
    tags: ["rpg","mundo-abierto","fantasia","narrativo","cdprojekt"],
    titulo: "THE WITCHER 3: WILD HUNT",
    genero: "RPG · Mundo Abierto · Fantasía Oscura",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2015",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/witcher3.jpg",
    desc: "Geralt de Rivia en el RPG de mundo abierto más completo jamás hecho. Sin discusión.",
    datos: [
      { k: "Desarrollador", v: "CD Projekt Red" },
      { k: "Año", v: "2015" },
      { k: "Plataforma", v: "PC / PS5 / Xbox" },
      { k: "DLC", v: "Hearts of Stone + Blood and Wine" }
    ],
    trailer: "https://www.youtube.com/embed/c0i88t0Kacs?autoplay=1&mute=1",
    tiempoHoras: 100,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    destacado: true,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Geralt de Rivia, un brujo cazamonstruos, busca a su hija adoptiva Ciri mientras el mundo se desmorona a su alrededor. The Witcher 3 redefinió lo que un RPG de mundo abierto podía ser.</p>
      <h3>POR QUÉ ES EL MEJOR</h3>
      <p>Cada quest secundaria tiene el peso de una misión principal de otro juego. Los NPCs tienen historia, motivaciones y consecuencias reales. Toussaint, la región de Blood and Wine, es probablemente la mejor expansión de pago en la historia de los videojuegos.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de decisiones sin respuestas correctas, la atmósfera, la banda sonora. Y el hecho de que diez años después sigue siendo referencia absoluta del género.</p>
    `
  },
  {
    id: "baldursgate3",
    tags: ["rpg","turnos","dnd","fantasia","cooperativo","larian"],
    titulo: "BALDUR'S GATE 3",
    genero: "RPG · Por Turnos · D&D",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2023",
    rating: 5,
    plataformas: ["pc", "ps"],
    img: "Imagenes/Gaming/baldursgate3.jpg",
    desc: "El mejor RPG por turnos en décadas. Larian Studios y D&D 5e en estado puro.",
    datos: [
      { k: "Desarrollador", v: "Larian Studios" },
      { k: "Año", v: "2023" },
      { k: "Plataforma", v: "PC / PS5" },
      { k: "Sistema", v: "D&D 5ª Edición" }
    ],
    trailer: "https://www.youtube.com/embed/tavPnYeFrV4?autoplay=1&mute=1",
    tiempoHoras: 100,
    dificultad: "ALTA",
    modoJuego: ["single","coop"],
    hasGuia: false,
    destacado: true,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Un parásito ceremórfido en tu cabeza, una ciudad en peligro y una cantidad absurda de libertad para hacer lo que quieras. BG3 es D&D 5ª edición llevado a los videojuegos con una fidelidad y un nivel de detalle que nadie esperaba.</p>
      <h3>POR QUÉ ES HISTÓRICO</h3>
      <p>Larian Studios demostró que un RPG de nicho puede ser el juego más vendido del año. Cada decisión tiene consecuencias reales varias horas después, y el juego recuerda absolutamente todo lo que haces.</p>
      <h3>LO MEJOR</h3>
      <p>La libertad total. Puedes resolver casi cualquier situación de formas que los desarrolladores probablemente no previeron. Y el Acto 3 en Baldur's Gate ciudad es una de las experiencias más densas del gaming moderno.</p>
    `
  },
  {
    id: "eldenring",
    tags: ["rpg","soulslike","fantasia","mundo-abierto","fromsoftware","dificil"],
    titulo: "ELDEN RING",
    genero: "Action RPG · Soulslike · Mundo Abierto",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2022",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/eldenring.jpg",
    desc: "FromSoftware + George R.R. Martin. El soulslike que conquistó al mundo.",
    datos: [
      { k: "Desarrollador", v: "FromSoftware" },
      { k: "Año", v: "2022" },
      { k: "Plataforma", v: "PC / PS5 / Xbox" },
      { k: "DLC", v: "Shadow of the Erdtree" }
    ],
    trailer: "https://www.youtube.com/embed/E3Huy2cdih0?autoplay=1&mute=1",
    tiempoHoras: 80,
    dificultad: "MUY ALTA",
    modoJuego: ["single","online"],
    hasGuia: false,
    destacado: true,
    fechaAdd: "2026-01-01",
    texto: `
      <p>The Lands Between. Un mundo vasto, hostil y absolutamente hermoso construido sobre el lore que George R.R. Martin desarrolló para FromSoftware.</p>
      <h3>POR QUÉ IMPORTA</h3>
      <p>Si nunca has jugado un soulslike, Elden Ring es el mejor punto de entrada porque el mundo abierto te permite explorar a tu ritmo.</p>
      <h3>LO MEJOR</h3>
      <p>El diseño de jefes, la densidad de secretos y Shadow of the Erdtree. Malenia se convirtió en icono cultural.</p>
    `
  },
  {
    id: "crimsondesert",
    tags: ["rpg","mundo-abierto","accion","fantasia","2026"],
    titulo: "CRIMSON DESERT",
    genero: "Action RPG · Mundo Abierto · Fantasía",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2026",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/crimsondesert.jpg",
    desc: "Pearl Abyss y el continente de Pywel. 2M de copias en 24h y mundo abierto con alma.",
    datos: [
      { k: "Desarrollador", v: "Pearl Abyss" },
      { k: "Año", v: "2026" },
      { k: "Plataforma", v: "PC / PS5 / Xbox Series" },
      { k: "Ventas", v: "+2M en 24 horas" }
    ],
    trailer: "https://www.youtube.com/embed/ZdmoGYg8tB0?autoplay=1&mute=1",
    tiempoHoras: 50,
    dificultad: "ALTA",
    modoJuego: ["single"],
    hasGuia: false,
    nuevo: true,
    fechaAdd: "2026-04-01",
    texto: `
      <p>Kliff y los Greymanes en el continente de Pywel. Lo que empezó como una precuela de Black Desert Online evolucionó hasta convertirse en un RPG de acción single-player con mundo abierto propio.</p>
      <h3>UN MUNDO QUE SE INSPIRA EN SICILIA</h3>
      <p>Pearl Abyss estudió la arquitectura histórica y los paisajes naturales de Sicilia para construir Pywel.</p>
      <h3>LO MEJOR</h3>
      <p>El combate visceral con cadenas de ataques, paradas y agarres. Y la escala del mundo.</p>
    `
  },
  {
    id: "starfield",
    tags: ["rpg","mundo-abierto","scifi","espacio","bethesda","exploracion"],
    titulo: "STARFIELD",
    genero: "RPG · Exploración Espacial · Sci-Fi",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2023",
    rating: 3,
    plataformas: ["pc", "xbox"],
    img: "Imagenes/Gaming/starfield.jpg",
    desc: "Bethesda en el espacio. 1000 planetas, ambición máxima, resultados divisivos.",
    datos: [
      { k: "Desarrollador", v: "Bethesda Game Studios" },
      { k: "Año", v: "2023" },
      { k: "Plataforma", v: "PC / Xbox Series" },
      { k: "Planetas", v: "+1000 explorables" }
    ],
    trailer: "https://www.youtube.com/embed/mlZDWlk1t6k?autoplay=1&mute=1",
    tiempoHoras: 80,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>El primer RPG espacial de Bethesda en décadas. Más de 1000 planetas, facciones, construcción de naves y la marca de la casa.</p>
      <h3>EL DEBATE</h3>
      <p>Starfield dividió a la comunidad como pocos juegos en años recientes. Los que esperaban un No Man's Sky narrativo se decepcionaron; los que querían Skyrim en el espacio encontraron exactamente eso.</p>
      <h3>LO MEJOR</h3>
      <p>El editor de naves es absurdamente bueno. Y la banda sonora de Inon Zur es de las mejores que ha puesto a un juego de Bethesda.</p>
    `
  },
  {
    id: "skyrim",
    titulo: "THE ELDER SCROLLS V: SKYRIM",
    genero: "RPG · Mundo Abierto · Fantasía",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2011",
    rating: 5,
    tags: ["rpg","mundo-abierto","fantasia","bethesda","dragons","exploracion","modding"],
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/skyrim.jpg",
    desc: "DOVAHKIIN. El RPG de mundo abierto más rejugado de la historia y el rey indiscutible del modding.",
    datos: [
      { k: "Desarrollador", v: "Bethesda Game Studios" },
      { k: "Año", v: "2011" },
      { k: "Plataforma", v: "PC / PS5 / Xbox / Switch" },
      { k: "DLC", v: "Dawnguard · Hearthfire · Dragonborn" }
    ],
    trailer: "https://www.youtube.com/embed/ZoYrflicbhI?autoplay=1&mute=1",
    tiempoHoras: 200,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Skyrim, la tierra de los Nords. Eres el Dovahkiin, el Sangre de Dragón, el único capaz de absorber las almas de los dragones que están volviendo a despertar.</p>
      <h3>POR QUÉ SIGUE SIENDO INSUSTITUIBLE</h3>
      <p>Bethesda lleva más de una década relanzando Skyrim en todas las plataformas imaginables porque el juego no ha tenido un sustituto real.</p>
      <h3>EL MODDING</h3>
      <p>La comunidad de mods de Skyrim en PC es probablemente la más activa de la historia del gaming. En 2026, con los mods adecuados, Skyrim sigue siendo uno de los juegos con mejor pinta de su generación.</p>
    `
  },
  {
    id: "falloutnv",
    titulo: "FALLOUT: NEW VEGAS",
    genero: "RPG · Postapocalíptico · Decisiones",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2010",
    rating: 5,
    tags: ["rpg","mundo-abierto","postapocaliptico","narrativo","decisiones","obsidian","western"],
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/falloutnv.jpg",
    desc: "El Mojave, 2281. El Fallout con la mejor narrativa de la saga. Obsidian en su mejor momento.",
    datos: [
      { k: "Desarrollador", v: "Obsidian Entertainment" },
      { k: "Publicado por", v: "Bethesda Softworks" },
      { k: "Año", v: "2010" },
      { k: "Plataforma", v: "PC / PS3 / Xbox 360" }
    ],
    trailer: "https://www.youtube.com/embed/l-x-1fm2cq8?autoplay=1&mute=1",
    tiempoHoras: 40,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>El Mojave Wasteland, 2281. Eres un mensajero al que le pegan un tiro en la cabeza y le dejan en una fosa. Sobrevives.</p>
      <h3>POR QUÉ ES EL MEJOR FALLOUT</h3>
      <p>Obsidian cogieron el motor de Fallout 3 y lo llenaron de profundidad narrativa. Cuatro facciones con motivaciones legítimas, decisiones sin respuestas correctas y un final que cambia radicalmente.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de karma y reputación por facción. Y el DLC Lonesome Road es de los mejores argumentos secundarios del género.</p>
    `
  },
  {
    id: "deathstranding",
    titulo: "DEATH STRANDING",
    genero: "Acción · Aventura · Experimental",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2019",
    rating: 4,
    tags: ["rpg","mundo-abierto","experimental","narrativo","kojima","scifi","cooperativo-asincrono"],
    plataformas: ["pc", "ps"],
    img: "Imagenes/Gaming/deathstranding.jpg",
    desc: "Kojima después de Konami. Un mundo roto, Norman Reedus y el poder de conectar.",
    datos: [
      { k: "Desarrollador", v: "Kojima Productions" },
      { k: "Año", v: "2019 PS4 / 2020 PC" },
      { k: "Plataforma", v: "PC / PS4 / PS5" },
      { k: "Director Cut", v: "2021" }
    ],
    trailer: "https://www.youtube.com/embed/voevWfKBy-M?autoplay=1&mute=1",
    tiempoHoras: 40,
    dificultad: "MEDIA",
    modoJuego: ["single","cooperativo-asincrono"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>América está fragmentada después de un evento catastrófico llamado la Death Stranding. Sam Porter Bridges tiene que cruzar un continente hostil cargado de paquetes para reconectar las ciudades supervivientes.</p>
      <h3>EL JUEGO MÁS DIVISIVO DE SU GENERACIÓN</h3>
      <p>Death Stranding no es para todo el mundo. Es lento, reflexivo y gran parte del tiempo simplemente caminas. Pero hay algo profundamente satisfactorio en construir infraestructura que otros jugadores anónimos van a usar.</p>
      <h3>LO MEJOR</h3>
      <p>El momento en que la música de Low Roar entra mientras cruzas un páramo nevado con el sol poniéndose.</p>
    `
  },
  {
    id: "reddeadredemption",
    titulo: "RED DEAD REDEMPTION 1",
    genero: "Acción · Western · Narrativo",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2010",
    rating: 5,
    tags: ["rpg","mundo-abierto","western","narrativo","rockstar","inmersivo","clasico"],
    plataformas: ["ps","xbox","pc"],
    img: "Imagenes/Gaming/red_dead_redemption.jpg",
    desc: "John Marston, el fin de una era y uno de los finales más devastadores del gaming.",
    datos: [
      { k: "Desarrollador", v: "Rockstar San Diego" },
      { k: "Año", v: "2010" },
      { k: "Plataforma", v: "PS3 / Xbox 360 / PC (2023)" },
      { k: "Secuela", v: "Red Dead Redemption 2 (2018)" }
    ],
    trailer: "https://www.youtube.com/embed/gI3ndb7KYLs?autoplay=1&mute=1",
    tiempoHoras: 20,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>John Marston es un forajido retirado al que el gobierno usa de perro de caza para capturar a sus antiguos compañeros.</p>
      <h3>POR QUÉ EL FINAL LO CAMBIA TODO</h3>
      <p>Sin spoilers: los últimos 20 minutos de Red Dead Redemption son de lo más impactante que ha dado el medio.</p>
      <h3>UNDEAD NIGHTMARE</h3>
      <p>El DLC que convierte el western en survival horror de zombis. Una rareza perfecta.</p>
    `
  },
  {
    id: "seaofstars",
    titulo: "SEA OF STARS",
    genero: "RPG · Turno · Pixel Art",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2023",
    rating: 4,
    tags: ["rpg","turno","pixel-art","indie","fantasia","narrativo"],
    plataformas: ["pc","ps","xbox"],
    img: "Imagenes/Gaming/seaofstars.jpg",
    desc: "El JRPG indie que rinde homenaje a Chrono Trigger con un sistema de combate de los mejores del género.",
    datos: [
      { k: "Desarrollador", v: "Sabotage Studio" },
      { k: "Año", v: "2023" },
      { k: "Plataforma", v: "PC / PS4-5 / Xbox / Switch" },
      { k: "Inspiración", v: "Chrono Trigger · Secret of Mana" }
    ],
    trailer: "https://www.youtube.com/embed/iJL0-lDuJn8?autoplay=1&mute=1",
    tiempoHoras: 35,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Dos guerreros de los solsticios deben detener a un alquimista maligno. Sea of Stars es un RPG por turnos con un pixel art extraordinario.</p>
      <h3>EL SISTEMA DE COMBATE</h3>
      <p>Cada ataque enemigo se puede mitigar con timing preciso. Los ataques propios tienen un bonus si pulsas en el momento correcto.</p>
      <h3>LO MEJOR</h3>
      <p>El arte. Sabotage creó algunos de los mejores sprites en 2D de los últimos años. Y la música, compuesta en parte por Yasunori Mitsuda.</p>
    `
  },
  {
    id: "outerwilds",
    titulo: "OUTER WILDS",
    genero: "Exploración · Misterio · Ciencia Ficción",
    cat: "rpg",
    catLabel: "MUNDO ABIERTO / RPG",
    anio: "2019",
    rating: 5,
    tags: ["exploracion","misterio","scifi","indie","narrativo","puzzle","espacio"],
    plataformas: ["pc","ps","xbox"],
    img: "Imagenes/Gaming/outerwilds.jpg",
    desc: "El juego de exploración espacial más singular que existe. Spoiler-free obligatorio.",
    datos: [
      { k: "Desarrollador", v: "Mobius Digital" },
      { k: "Año", v: "2019" },
      { k: "Plataforma", v: "PC / PS4-5 / Xbox" },
      { k: "DLC", v: "Echoes of the Eye (2021)" }
    ],
    trailer: "https://www.youtube.com/embed/d6LGnVCL1_A?autoplay=1&mute=1",
    tiempoHoras: 15,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    destacado: true,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Eres un explorador espacial en un sistema solar atrapado en un bucle de 22 minutos que termina siempre con la supernova de tu sol.</p>
      <h3>POR QUÉ ES DIFERENTE</h3>
      <p>Outer Wilds no tiene combate, no tiene puntuación, no tiene mecánicas de progresión tradicionales. El juego entero es un puzzle sobre astronomía, física y arqueología espacial.</p>
      <h3>AVISO</h3>
      <p>No busques nada. Ni guías, ni walkthroughs, ni spoilers. La primera partida de Outer Wilds es irrepetible.</p>
    `
  },

// ── ACCIÓN / AVENTURA ─────────────────────────────────────────

  {
    id: "mafia",
    tags: ["accion","narrativo","crimen","mundo-abierto","cinematografico"],
    titulo: "MAFIA 2 / 3 / THE OLD COUNTRY",
    genero: "Acción · Aventura · Crimen Organizado",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2010",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/mafia.jpg",
    desc: "La versión cinematográfica del crimen organizado. Mafia 2 es imprescindible.",
    datos: [
      { k: "Desarrollador", v: "Hangar 13 / 2K" },
      { k: "Mafia 2", v: "2010" },
      { k: "Mafia 3", v: "2016" },
      { k: "The Old Country", v: "2025" }
    ],
    trailer: "https://www.youtube.com/embed/wHoqwphzhzc?autoplay=1&mute=1",
    tiempoHoras: 12,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>La saga Mafia es la versión cinematográfica del crimen organizado en los videojuegos. Mafia 2 sigue a Vito Scaletta en una ciudad ficticia de los años 40-50.</p>
      <h3>MAFIA 2 — LA JOYA DE LA SAGA</h3>
      <p>El mejor de los tres sin discusión. La historia de Vito y Joe, la ambientación de época, la música y una narrativa sin concesiones.</p>
      <h3>THE OLD COUNTRY</h3>
      <p>La entrega más reciente vuelve a los orígenes europeos de la mafia siciliana.</p>
    `
  },
  {
    id: "ac",
    tags: ["accion","sigilo","historico","ubisoft","parkour"],
    titulo: "ASSASSIN'S CREED — SAGA EZIO",
    genero: "Acción · Sigilo · Histórico",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2009",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/assassins_creed.jpg",
    desc: "Ezio Auditore, el mejor protagonista de la franquicia. Tres juegos, un arco perfecto.",
    datos: [
      { k: "AC II", v: "2009 — Florencia" },
      { k: "Brotherhood", v: "2010 — Roma" },
      { k: "Revelations", v: "2011 — Estambul" },
      { k: "Desarrollador", v: "Ubisoft" }
    ],
    trailer: "https://www.youtube.com/embed/b2Ay0plpImA?autoplay=1&mute=1",
    tiempoHoras: 90,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Ezio Auditore da Firenze es el personaje más querido de toda la franquicia. Su arco narrativo atraviesa tres juegos y décadas de su vida.</p>
      <h3>POR QUÉ LA SAGA EZIO ES ESPECIAL</h3>
      <p>AC2 reinventó la franquicia con una ambientación en la Italia del Renacimiento impresionante. Brotherhood añadió Roma. Revelations cerró la historia.</p>
      <h3>EL RESTO DE LA SAGA</h3>
      <p>Black Flag sigue siendo un favorito por su ambientación pirata. Origins, Odyssey y Valhalla pivotaron hacia el RPG de mundo abierto.</p>
    `
  },
  {
    id: "dishonored",
    tags: ["accion","sigilo","steampunk","immersive-sim","poderes"],
    titulo: "DISHONORED 1/2 + EL FORASTERO",
    genero: "Acción · Sigilo · Immersive Sim",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2012",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/dishonored.jpg",
    desc: "Dunwall, poderes sobrenaturales y libertad total para decidir cómo resolver cada misión.",
    datos: [
      { k: "Desarrollador", v: "Arkane Studios" },
      { k: "Dishonored", v: "2012" },
      { k: "Dishonored 2", v: "2016" },
      { k: "El Forastero", v: "2017 — DLC" }
    ],
    trailer: "https://www.youtube.com/embed/d4-Tr1wABOA?autoplay=1&mute=1",
    tiempoHoras: 30,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Dunwall, una ciudad victoriana steampunk. Encarnas a Corvo Attano con poderes sobrenaturales otorgados por El Forastero.</p>
      <h3>LA LIBERTAD DEL SIGILO</h3>
      <p>Dishonored es uno de los mejores ejemplos de immersive sim: cada misión tiene múltiples soluciones. Puedes completar todo el juego sin matar a nadie.</p>
      <h3>LA MUERTE DEL FORASTERO</h3>
      <p>El DLC standalone protagonizado por Billie Lurk y Daud es posiblemente lo mejor que ha producido la saga.</p>
    `
  },
  {
    id: "gtav",
    tags: ["accion","mundo-abierto","crimen","rockstar","online"],
    titulo: "GTA V",
    genero: "Acción · Mundo Abierto · Crimen",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2013",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/gtav.jpg",
    desc: "Los Santos, tres protagonistas y el juego más rentable de la historia del entretenimiento.",
    datos: [
      { k: "Desarrollador", v: "Rockstar Games" },
      { k: "Año", v: "2013" },
      { k: "Plataforma", v: "PC / PS5 / Xbox" },
      { k: "GTA Online", v: "Activo desde 2013" }
    ],
    trailer: "https://www.youtube.com/embed/QkkoHAzjnUs?autoplay=1&mute=1",
    tiempoHoras: 30,
    dificultad: "MEDIA",
    modoJuego: ["single","online"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Los Santos, California ficticia. Tres protagonistas con historias entrelazadas: Michael, Trevor y Franklin. Y GTA Online, que lleva más de una década activo.</p>
      <h3>EL FENÓMENO CULTURAL</h3>
      <p>GTA V es el producto de entretenimiento más rentable de la historia, superando a cualquier película o álbum.</p>
      <h3>GTA VI</h3>
      <p>Rockstar lleva años trabajando en GTA VI, ambientado en Vice City y con la primera protagonista femenina principal de la saga.</p>
    `
  },
  {
    id: "watchdogs2",
    tags: ["accion","mundo-abierto","hacking","scifi","ubisoft","sigilo"],
    titulo: "WATCH DOGS 2",
    genero: "Acción · Mundo Abierto · Hacking",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2016",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/watchdogs2.jpg",
    desc: "San Francisco, DedSec y el hacking como mecánica de juego real. El mejor de la saga.",
    datos: [
      { k: "Desarrollador", v: "Ubisoft Montreal" },
      { k: "Año", v: "2016" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" },
      { k: "Ambientación", v: "San Francisco / Silicon Valley" }
    ],
    trailer: "https://www.youtube.com/embed/A_XUY_YJROI?autoplay=1&mute=1",
    tiempoHoras: 20,
    dificultad: "MEDIA",
    modoJuego: ["single","online"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Marcus Holloway y DedSec en San Francisco. Hackea coches, cámaras, semáforos, teléfonos y prácticamente cualquier dispositivo conectado a la red.</p>
      <h3>POR QUÉ ENCAJA AQUÍ</h3>
      <p>Si la estética de RETROTERM.AI te dice algo, Watch Dogs 2 es tu juego. La cultura hacker, los terminales y la crítica a las big tech están en el centro de toda la narrativa.</p>
      <h3>LO MEJOR</h3>
      <p>La libertad de enfoque. Puedes resolver misiones enteras sin disparar una sola bala, solo con el teléfono y los drones.</p>
    `
  },
  {
    id: "justcause4",
    tags: ["accion","sandbox","explosiones","mundo-abierto"],
    titulo: "JUST CAUSE 4",
    genero: "Acción · Sandbox · Explosiones",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2018",
    rating: 3,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/justcause4.jpg",
    desc: "Rico Rodriguez, un garfio con física mejorada y la pregunta de cuánto caos es demasiado.",
    datos: [
      { k: "Desarrollador", v: "Avalanche Studios" },
      { k: "Año", v: "2018" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" },
      { k: "Isla", v: "Solís, 1024 km²" }
    ],
    trailer: "https://www.youtube.com/embed/xXWU0ptx_B8?autoplay=1&mute=1",
    tiempoHoras: 15,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Rico Rodriguez en Solís, una isla sudamericana de más de 1000 km². El objetivo: desestabilizar un régimen militar usando un garfio con física avanzada.</p>
      <h3>LA FILOSOFÍA</h3>
      <p>Just Cause no pretende ser el GTA. Su propuesta es diferente: máxima verticalidad, máxima destrucción y la libertad de unir cualquier objeto a cualquier otro con el garfio.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de garfio mejorado con propulsores, globos y tensores personalizables.</p>
    `
  },
  {
    id: "maxpayne",
    tags: ["accion","noir","narrativo","thriller","bullet-time","remedy"],
    titulo: "MAX PAYNE 1 / 2",
    genero: "Acción · Noir · Bullet Time",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2001",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/maxpayne.jpg",
    desc: "Bullet time, Nueva York y una narración noir que no ha envejecido un día.",
    datos: [
      { k: "Desarrollador", v: "Remedy Entertainment" },
      { k: "Max Payne 1", v: "2001" },
      { k: "Max Payne 2", v: "2003" },
      { k: "Remake", v: "En desarrollo (Rockstar)" }
    ],
    trailer: "https://www.youtube.com/embed/KYT2_Ww6wtM?autoplay=1&mute=1",
    tiempoHoras: 10,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Max Payne, un detective de narcóticos al que le asesinan a la familia. Nueva York de noche, lluvia, Valkyr y el bullet time. Remedy Entertainment inventó una forma de narrar que mezclaba cómic, cine negro y acción de tercera persona.</p>
      <h3>LA INFLUENCIA</h3>
      <p>El bullet time de Max Payne influyó en prácticamente todo el action gaming de los 2000.</p>
      <h3>EL REMAKE</h3>
      <p>Rockstar Games tiene un remake de Max Payne 1 y 2 en desarrollo en Remedy.</p>
    `
  },
  {
    id: "007firstlight",
    tags: ["accion","espionaje","sigilo","2026","io-interactive"],
    titulo: "007 FIRST LIGHT",
    genero: "Acción · Espionaje · Sigilo",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2026",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/007firstlight.jpg",
    desc: "IO Interactive (Hitman) lleva a Bond de vuelta. Origen, espionaje y Lana Del Rey en los créditos.",
    datos: [
      { k: "Desarrollador", v: "IO Interactive" },
      { k: "Lanzamiento", v: "27 mayo 2026" },
      { k: "Plataforma", v: "PC / PS5 / Xbox Series" },
      { k: "Bond", v: "Patrick Gibson, 26 años" }
    ],
    trailer: "https://www.youtube.com/embed/maCgyDar4oE?autoplay=1&mute=1",
    tiempoHoras: 20,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    nuevo: true,
    fechaAdd: "2026-04-01",
    texto: `
      <p>James Bond tiene 26 años, acaba de ser reclutado por el MI6 y todavía no se ha ganado el 007. IO Interactive llevan la licencia de Bond de vuelta a los videojuegos.</p>
      <h3>HITMAN CON LICENCIA PARA MATAR</h3>
      <p>El ADN de Hitman está ahí: sigilo, disfraces, eliminar objetivos de formas creativas. Pero First Light lo mezcla con tiroteos y peleas.</p>
      <h3>LO MEJOR</h3>
      <p>Patrick Gibson como Bond joven funciona. Los escenarios tienen la escala de una película.</p>
    `
  },
  {
    id: "batman",
    titulo: "BATMAN: ARKHAM CITY",
    genero: "Acción · Aventura · Superhéroes",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2011",
    rating: 5,
    tags: ["accion","superhéroes","sigilo","mundo-abierto","narrativo","combate","dc"],
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/batman_arkham_city.jpg",
    desc: "El mejor juego de superhéroes hecho nunca. El sistema de combate Freeflow que copió toda la industria.",
    datos: [
      { k: "Desarrollador", v: "Rocksteady Studios" },
      { k: "Año", v: "2011" },
      { k: "Plataforma", v: "PC / PS3 / Xbox 360" },
      { k: "Precuela", v: "Arkham Asylum (2009)" }
    ],
    trailer: "https://www.youtube.com/embed/ZquCBrr2J6Q?autoplay=1&mute=1",
    tiempoHoras: 15,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Una sección de Gotham convertida en una prisión a cielo abierto. Arkham City es el estudio de caso definitivo de cómo hacer un juego de superhéroes.</p>
      <h3>EL SISTEMA FREEFLOW</h3>
      <p>Rocksteady creó un sistema de combate que parece ballet violento. Prácticamente todo el action-adventure moderno toma prestado de este sistema.</p>
      <h3>LO MEJOR</h3>
      <p>La narrativa del Joker. Mark Hamill en su despedida definitiva del personaje.</p>
    `
  },
  {
    id: "halflife2",
    titulo: "HALF-LIFE 2",
    genero: "FPS · Ciencia Ficción · Narrativo",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2004",
    rating: 5,
    tags: ["clasico","fps","scifi","narrativo","valve","fisicas","distopia"],
    plataformas: ["pc"],
    img: "Imagenes/Gaming/halflife2.jpg",
    desc: "City 17, Gordon Freeman y la gravedad como arma. El FPS que redefinió el género.",
    datos: [
      { k: "Desarrollador", v: "Valve" },
      { k: "Año", v: "2004" },
      { k: "Plataforma", v: "PC" },
      { k: "Motor", v: "Source Engine" }
    ],
    trailer: "https://www.youtube.com/embed/3BYd976mqA0?autoplay=1&mute=1",
    tiempoHoras: 12,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>City 17, un estado totalitario alienígena. Gordon Freeman llega en tren y en las siguientes horas la ciudad entera colapsa a su alrededor.</p>
      <h3>POR QUÉ CAMBIÓ LOS FPS</h3>
      <p>Antes de HL2, los shooters eran pasillos con enemigos. Valve demostró que un FPS podía tener narrativa ambiental, física que afectaba al gameplay y personajes con los que te importaba lo que pasaba.</p>
      <h3>LA GRAVITY GUN</h3>
      <p>El arma más icónica que ha dado el gaming. Ravenholm sigue siendo uno de los niveles más tensos de la historia del medio.</p>
    `
  },
  {
    id: "hades",
    titulo: "HADES",
    genero: "Roguelike · Acción · Narrativo",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2020",
    rating: 5,
    tags: ["accion","roguelike","narrativo","supergiant","mitologia","indie","combate"],
    plataformas: ["pc","ps","xbox"],
    img: "Imagenes/Gaming/hades.jpg",
    desc: "El roguelike que convirtió morir en parte de la narrativa. Supergiant en su mejor nivel.",
    datos: [
      { k: "Desarrollador", v: "Supergiant Games" },
      { k: "Año", v: "2020" },
      { k: "Plataforma", v: "PC / PS4-5 / Xbox / Switch" },
      { k: "Secuela", v: "Hades II (Early Access 2024)" }
    ],
    trailer: "https://www.youtube.com/embed/91t0ha9x0AE?autoplay=1&mute=1",
    tiempoHoras: 40,
    dificultad: "ALTA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Zagreus, hijo de Hades, intenta escapar del inframundo. Mueres. Vuelves a empezar. Pero cada muerte avanza la historia, desbloquea diálogos nuevos y profundiza las relaciones con los personajes.</p>
      <h3>POR QUÉ IMPORTA</h3>
      <p>En la mayoría de roguelikes, morir resetea todo el progreso. En Hades, morir es progreso.</p>
      <h3>LO MEJOR</h3>
      <p>La variedad de builds con las bendiciones de los dioses. La banda sonora de Darren Korb.</p>
    `
  },
  {
    id: "resi4",
    titulo: "RESIDENT EVIL 4 REMAKE",
    genero: "Survival Horror · Acción · Terror",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2023",
    rating: 5,
    tags: ["accion","terror","survival-horror","capcom","remake","sigilo","narrativo"],
    plataformas: ["pc","ps","xbox"],
    img: "Imagenes/Gaming/resi4.jpg",
    desc: "El remake que demuestra que se puede modernizar un clásico sin perder su alma. Leon S. Kennedy en forma.",
    datos: [
      { k: "Desarrollador", v: "Capcom" },
      { k: "Año", v: "2023 (original 2005)" },
      { k: "Plataforma", v: "PC / PS5 / Xbox Series" },
      { k: "Engine", v: "RE Engine" }
    ],
    trailer: "https://www.youtube.com/embed/gOHgt7_SJQE?autoplay=1&mute=1",
    tiempoHoras: 16,
    dificultad: "ALTA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Leon S. Kennedy viaja a España rural para rescatar a la hija del presidente. El remake de 2023 tomó el original de 2005 y lo reinventó sin perder lo que lo hacía grande.</p>
      <h3>POR QUÉ ES UN REMAKE MODELO</h3>
      <p>Capcom no se limitó a subir la resolución. Rediseñó el combate, amplió la historia de Ashley, añadió nuevas áreas.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de parry que añade profundidad al combate. La sección del castillo.</p>
    `
  },
  {
    id: "returnal",
    titulo: "RETURNAL",
    genero: "Roguelite · Bullet Hell · Sci-Fi",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2021",
    rating: 4,
    tags: ["accion","roguelike","scifi","terror","bullet-hell","narrativo"],
    plataformas: ["ps","pc"],
    img: "Imagenes/Gaming/returnal.jpg",
    desc: "La astronauta atrapada en un loop de muerte en un planeta alienígena. Difícil, visceral y adictivo.",
    datos: [
      { k: "Desarrollador", v: "Housemarque" },
      { k: "Año", v: "2021 (PC 2023)" },
      { k: "Plataforma", v: "PS5 / PC" },
      { k: "Duración", v: "20-40h según dificultad" }
    ],
    trailer: "https://www.youtube.com/embed/6VaVQxVWLMY?autoplay=1&mute=1",
    tiempoHoras: 30,
    dificultad: "MUY ALTA",
    modoJuego: ["single","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Selene Vassos aterriza en Atropos siguiendo una señal misteriosa y muere. Y vuelve a empezar. Returnal es un roguelite de bullet hell con producción de triple A.</p>
      <h3>POR QUÉ ES ESPECIAL</h3>
      <p>Housemarque combinó la precisión arcade de sus juegos anteriores con producción cinematográfica.</p>
      <h3>LO MEJOR</h3>
      <p>El ritmo del combate cuando dominas los controles. Los parásitos que modifican tu build de manera impredecible.</p>
    `
  },
  {
    id: "celeste",
    titulo: "CELESTE",
    genero: "Plataformas · Indie · Narrativo",
    cat: "accion",
    catLabel: "ACCIÓN / AVENTURA",
    anio: "2018",
    rating: 5,
    tags: ["accion","plataformas","indie","narrativo","pixel-art","salud-mental","dificil"],
    plataformas: ["pc","ps","xbox"],
    img: "Imagenes/Gaming/celeste.jpg",
    desc: "Un juego de plataformas sobre subir una montaña que en realidad es sobre salud mental. Perfecto.",
    datos: [
      { k: "Desarrollador", v: "Maddy Thorson & Noel Berry" },
      { k: "Año", v: "2018" },
      { k: "Plataforma", v: "PC / PS4 / Xbox / Switch" },
      { k: "Premio", v: "GOTY candidato en múltiples listas de 2018" }
    ],
    trailer: "https://www.youtube.com/embed/70d9irlxiB4?autoplay=1&mute=1",
    tiempoHoras: 10,
    dificultad: "ALTA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Madeline sube la montaña Celeste. El juego es una metáfora directa sobre la ansiedad y el síndrome del impostor.</p>
      <h3>EL DISEÑO DE NIVELES</h3>
      <p>Cada capítulo introduce una mecánica nueva y la desarrolla hasta sus consecuencias lógicas sin nunca repetirse.</p>
      <h3>LO MEJOR</h3>
      <p>La banda sonora de Lena Raine es una obra maestra por sí sola. Y el modo Assist que hace el juego accesible sin quitarle el alma.</p>
    `
  },
  {
    id: "princeofpersia",
    titulo: "PRINCE OF PERSIA: THE SANDS OF TIME",
    genero: "Plataformas · Acción · Narrativo",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2003",
    rating: 4,
    tags: ["clasico","plataformas","accion","narrativo","ubisoft","tiempo","fantasia"],
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/princeofpersia_sot.jpg",
    desc: "Las arenas del tiempo y el dagger que rebobina la historia. Ubisoft en su mejor época.",
    datos: [
      { k: "Desarrollador", v: "Ubisoft Montreal" },
      { k: "Año", v: "2003" },
      { k: "Plataforma", v: "PC / PS2 / Xbox / GameCube" },
      { k: "Remake", v: "En desarrollo (Ubisoft)" }
    ],
    trailer: "https://www.youtube.com/embed/WtCddzrsYF4?autoplay=1&mute=1",
    tiempoHoras: 10,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Un príncipe persa libera accidentalmente las Arenas del Tiempo. Con un dagger mágico capaz de rebobinar el tiempo, tiene que deshacer el daño.</p>
      <h3>LA NARRATIVA QUE LO HACE ESPECIAL</h3>
      <p>La historia está narrada por el propio Príncipe en pasado. Cuando mueres, el Príncipe dice "no, espera, no fue así" y el tiempo rebobina.</p>
      <h3>EL REMAKE</h3>
      <p>Ubisoft tiene un remake en desarrollo que vuelve a la dirección artística del original.</p>
    `
  },

// ── COMEDIA / OTROS ───────────────────────────────────────────

  {
    id: "southpark",
    tags: ["comedia","rpg","superhéroes","turnos","satira"],
    titulo: "SOUTH PARK: LA RETAGUARDIA EN PELIGRO",
    genero: "RPG · Comedia · Superhéroes",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2017",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/south_park.jpg",
    desc: "Superhéroes, redes sociales y South Park sin filtros. Episodios jugables.",
    datos: [
      { k: "Desarrollador", v: "Ubisoft San Francisco" },
      { k: "Año", v: "2017" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" },
      { k: "Predecesor", v: "El Palo de la Verdad" }
    ],
    trailer: "https://www.youtube.com/embed/aI3bjL7LUyg?autoplay=1&mute=1",
    tiempoHoras: 12,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Secuela de El Palo de la Verdad. Esta vez los niños de South Park han cambiado los RPG de fantasía por los superhéroes.</p>
      <h3>POR QUÉ FUNCIONA</h3>
      <p>Es exactamente lo que esperas de South Park: humor sin filtros, referencias constantes a la cultura pop y una sátira brutal de los clichés de superhéroes.</p>
      <h3>LO MEJOR</h3>
      <p>El sistema de combate por turnos con posicionamiento táctico es más profundo de lo que parece.</p>
    `
  },
  {
    id: "goat",
    tags: ["comedia","sandbox","absurdo","casual"],
    titulo: "GOAT SIMULATOR",
    genero: "Simulación · Caos · Sin sentido",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2014",
    rating: 3,
    plataformas: ["pc", "ps", "xbox", "movil"],
    img: "Imagenes/Gaming/goat.jpg",
    desc: "Eres una cabra. No hay más explicación necesaria.",
    datos: [
      { k: "Desarrollador", v: "Coffee Stain Studios" },
      { k: "Año", v: "2014" },
      { k: "Plataforma", v: "PC / Móvil / Consolas" },
      { k: "Objetivo", v: "Ninguno" }
    ],
    trailer: "https://www.youtube.com/embed/-t0VIf0GAl8?autoplay=1&mute=1",
    tiempoHoras: 4,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Eres una cabra. No hay objetivos, no hay historia, no hay ningún motivo concreto para hacer nada. Simplemente deambulas por un mapa destruyendo todo lo que encuentras.</p>
      <h3>LA ANALOGÍA ASIR</h3>
      <p>Goat Simulator es básicamente el simulador oficial del alumno de ASIR en su primer año: sin un objetivo claro, destruyendo configuraciones que funcionaban perfectamente.</p>
      <h3>POR QUÉ EXISTE</h3>
      <p>Coffee Stain Studios lo empezó como un prototipo interno, lo subieron como broma y la comunidad lo pidió como juego real.</p>
    `
  },
  {
    id: "southparkpalo",
    tags: ["comedia","rpg","fantasia","turnos","obsidian"],
    titulo: "SOUTH PARK: LA VARA DE LA VERDAD",
    genero: "RPG · Comedia · Fantasía",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2014",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/southparkpalo.jpeg",
    desc: "El mejor RPG de South Park. Trey Parker y Matt Stone como si fuese un episodio de 6 horas.",
    datos: [
      { k: "Desarrollador", v: "Obsidian Entertainment" },
      { k: "Año", v: "2014" },
      { k: "Plataforma", v: "PC / PS4 / Xbox" },
      { k: "Secuela", v: "La Retaguardia en Peligro" }
    ],
    trailer: "https://www.youtube.com/embed/ACsTNIBNt4U?autoplay=1&mute=1",
    tiempoHoras: 10,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Eres el chico nuevo en South Park y los niños están jugando a dragones y mazmorras. Obsidian Entertainment y Trey Parker desarrollaron juntos el juego más fiel a la serie que existe.</p>
      <h3>POR QUÉ ES EL MEJOR DE LOS DOS</h3>
      <p>El Palo de la Verdad tiene una coherencia narrativa y un ritmo que La Retaguardia en Peligro no siempre mantiene.</p>
      <h3>LO MEJOR</h3>
      <p>El momento en que la escala del juego empieza a revelar que no es solo una broma.</p>
    `
  },
  {
    id: "untitledgoose",
    tags: ["comedia","puzzle","casual","indie"],
    titulo: "UNTITLED GOOSE GAME",
    genero: "Puzzle · Comedia · Caos Controlado",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2019",
    rating: 4,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/untitledgoose.jpg",
    desc: "Eres un ganso. Tu objetivo es arruinarle el día a todo el pueblo. Es arte.",
    datos: [
      { k: "Desarrollador", v: "House House" },
      { k: "Año", v: "2019" },
      { k: "Plataforma", v: "PC / PS4 / Xbox / Switch" },
      { k: "BSO", v: "Debussy (piano adaptativo)" }
    ],
    trailer: "https://www.youtube.com/embed/9LL2AtHo1gk?autoplay=1&mute=1",
    tiempoHoras: 3,
    dificultad: "BAJA",
    modoJuego: ["single","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Un ganso sin nombre en un pueblo inglés tranquilo. Tienes una lista de tareas: robar el sombrero del jardinero, hacer que el niño se encierre en el gallinero.</p>
      <h3>EL GANSO VS GOAT SIMULATOR</h3>
      <p>Si Goat Simulator es el caos absoluto sin restricciones, Untitled Goose Game es el caos con diseño.</p>
      <h3>LO MEJOR</h3>
      <p>Dura unas tres horas. No tiene relleno. Es exactamente lo que promete.</p>
    `
  },
  {
    id: "stanley",
    tags: ["comedia","meta","narrativo","experimental","puzzle"],
    titulo: "THE STANLEY PARABLE",
    genero: "Meta · Narrativo · Experimental",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2013",
    rating: 5,
    plataformas: ["pc"],
    img: "Imagenes/Gaming/stanleyparable.jpg",
    desc: "Un juego sobre seguir instrucciones. O no seguirlas. O los dos. O ninguno.",
    datos: [
      { k: "Desarrollador", v: "Galactic Cafe / Crows Crows Crows" },
      { k: "Año", v: "2013 / Ultra Deluxe 2022" },
      { k: "Plataforma", v: "PC (Ultra Deluxe: consolas)" },
      { k: "Narrador", v: "Kevan Brighting" }
    ],
    trailer: "https://www.youtube.com/embed/pLbmZT70rtA?autoplay=1&mute=1",
    tiempoHoras: 4,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Stanley es el empleado 427. Todos sus compañeros han desaparecido. Un narrador omnisciente te explica lo que estás haciendo. Puedes seguirle o no.</p>
      <h3>META AL MÁXIMO</h3>
      <p>The Stanley Parable es un comentario sobre la narrativa en los videojuegos, sobre el libre albedrío, sobre la ilusión de elección.</p>
      <h3>ULTRA DELUXE</h3>
      <p>La versión Ultra Deluxe de 2022 añade nueva historia, nuevas bifurcaciones y más capas meta.</p>
    `
  },
  {
    id: "portal2",
    tags: ["comedia","puzzle","scifi","valve","cooperativo","fps"],
    titulo: "PORTAL 1 / 2",
    genero: "Puzzle · Sci-Fi · Humor Valve",
    cat: "comedia",
    catLabel: "COMEDIA / OTROS",
    anio: "2007",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/portal.jpg",
    desc: "Aperture Science, GLaDOS y la pistola de portales más satisfactoria de la historia.",
    datos: [
      { k: "Desarrollador", v: "Valve" },
      { k: "Portal 1", v: "2007" },
      { k: "Portal 2", v: "2011" },
      { k: "Plataforma", v: "PC / PS3 / Xbox 360" }
    ],
    trailer: "https://www.youtube.com/embed/tax4e4hBBZc?autoplay=1&mute=1",
    tiempoHoras: 8,
    dificultad: "MEDIA",
    modoJuego: ["single","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Aperture Science Laboratories. Chell, una cobaya humana. Una pistola que crea portales entre superficies. Y GLaDOS, una IA que te guía con un humor que oscila entre lo amenazante y lo absolutamente genial.</p>
      <h3>EL PUZZLE PERFECTO</h3>
      <p>Portal 1 es uno de los diseños de puzzle más elegantes de la historia. Portal 2 expande todo eso y tiene uno de los tramos finales más satisfactorios que Valve ha hecho jamás.</p>
      <h3>LO MEJOR</h3>
      <p>Still Alive. Want You Gone. La música de Jonathan Coulton al final de ambos juegos.</p>
    `
  },

// ── CLÁSICOS ──────────────────────────────────────────────────

  {
    id: "crazytaxi",
    tags: ["clasico","arcade","conduccion","sega","dreamcast"],
    titulo: "CRAZY TAXI",
    genero: "Arcade · Conducción · Clásico",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "1999",
    rating: 4,
    plataformas: ["arcade", "dc", "pc"],
    img: "Imagenes/Gaming/crazy_taxi.jpg",
    desc: "Sega, Dreamcast, The Offspring y ninguna norma de tráfico.",
    datos: [
      { k: "Desarrollador", v: "Hitmaker / Sega" },
      { k: "Año", v: "1999 Arcade / 2000 DC" },
      { k: "Plataforma", v: "Arcade / Dreamcast / PC" },
      { k: "BSO", v: "The Offspring / Bad Religion" }
    ],
    trailer: "https://www.youtube.com/embed/_dzL-0FwT7M?autoplay=1&mute=1",
    tiempoHoras: 5,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Llevas clientes de un punto a otro de la ciudad en el menor tiempo posible, ignorando absolutamente todas las normas de tráfico.</p>
      <h3>UN CLÁSICO DE RECREATIVA</h3>
      <p>Crazy Taxi nació en las recreativas y fue uno de los grandes éxitos de Dreamcast. Su mecánica de puntuación arcade y su ritmo frenético lo convirtieron en un referente.</p>
    `
  },
  {
    id: "spore",
    tags: ["clasico","sandbox","simulacion","estrategia","maxis"],
    titulo: "SPORE",
    genero: "Simulación · Estrategia · Evolución",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2008",
    rating: 4,
    plataformas: ["pc", "mac"],
    img: "Imagenes/Gaming/spore.jpg",
    desc: "De microorganismo a civilización espacial. Y el editor de criaturas más adictivo.",
    datos: [
      { k: "Desarrollador", v: "Maxis / EA" },
      { k: "Año", v: "2008" },
      { k: "Plataforma", v: "PC / Mac" },
      { k: "Fases", v: "5 etapas evolutivas" }
    ],
    trailer: "https://www.youtube.com/embed/zi2GvqboQfY?autoplay=1&mute=1",
    tiempoHoras: 20,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Empiezas siendo un microorganismo en el fondo del océano y acabas siendo una civilización espacial conquistando galaxias. Cinco fases completamente diferentes.</p>
      <h3>LA PROMESA Y LA REALIDAD</h3>
      <p>Will Wright prometió una simulación evolutiva revolucionaria. Lo que entregaron fue algo más superficial de lo esperado pero el conjunto y la creatividad del editor de criaturas lo convirtieron en una experiencia única.</p>
      <h3>EL EDITOR DE CRIATURAS</h3>
      <p>La herramienta más recordada del juego. Con unos pocos clics podías crear criaturas que iban desde lo adorable hasta lo perturbador.</p>
    `
  },
  {
    id: "sims",
    tags: ["clasico","simulacion","sandbox","maxis","casual"],
    titulo: "LOS SIMS",
    genero: "Simulación de Vida · Clásico",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2000",
    rating: 3,
    plataformas: ["pc", "mac"],
    img: "Imagenes/Gaming/sims.jpg",
    desc: "200M de copias vendidas y la piscina sin escalera más famosa de la historia.",
    datos: [
      { k: "Desarrollador", v: "Maxis / EA" },
      { k: "Sims 1", v: "2000" },
      { k: "Sims 4", v: "2014 — F2P 2022" },
      { k: "Sims 5", v: "En desarrollo" }
    ],
    trailer: "https://www.youtube.com/embed/WjPPjU8OARg?autoplay=1&mute=1",
    tiempoHoras: 999,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>La saga de simulación de vida más vendida de la historia. Creas personas, construyes sus casas, gestionas sus necesidades, sus relaciones y sus carreras. O las encierras en una piscina sin escalera.</p>
      <h3>POR QUÉ SIGUE SIENDO RELEVANTE</h3>
      <p>Los Sims 4 lleva más de una década activo y se hizo gratuito en 2022. Tiene una comunidad de mods enorme.</p>
      <h3>EL FUTURO</h3>
      <p>Project Rene, el nombre en clave de Los Sims 5, está en desarrollo con componentes multijugador opcionales.</p>
    `
  },
  {
    id: "gtasanandreas",
    tags: ["clasico","accion","mundo-abierto","rockstar","crimen"],
    titulo: "GTA SAN ANDREAS / VICE CITY",
    genero: "Acción · Mundo Abierto · Clásico",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2004",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/gtasa.jpg",
    desc: "CJ, Grove Street y la radio de los años 90. El GTA que definió una generación.",
    datos: [
      { k: "Desarrollador", v: "Rockstar Games" },
      { k: "San Andreas", v: "2004" },
      { k: "Vice City", v: "2002" },
      { k: "Plataforma", v: "PS2 / PC / Xbox" }
    ],
    trailer: "https://www.youtube.com/embed/H4rYVsJ4v9Y?autoplay=1&mute=1",
    tiempoHoras: 35,
    dificultad: "MEDIA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Carl Johnson vuelve a Los Santos después de años fuera para enterrar a su madre. San Andreas fue el GTA más ambicioso de su generación.</p>
      <h3>VICE CITY — EL OTRO CLÁSICO</h3>
      <p>Vice City llegó dos años antes y estableció la fórmula: Miami de los 80, Tommy Vercetti y una estética que el gaming nunca había visto.</p>
      <h3>LO MEJOR</h3>
      <p>La cantidad de cosas que San Andreas dejaba hacer en 2004: aprender a nadar, ir al gym, personalizar a CJ, pilotar aviones.</p>
    `
  },
  {
    id: "aoe2",
    tags: ["clasico","estrategia","rts","historico","multijugador"],
    titulo: "AGE OF EMPIRES II",
    genero: "Estrategia · Tiempo Real · Histórico",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "1999",
    rating: 5,
    plataformas: ["pc"],
    img: "Imagenes/Gaming/aoe2.jpg",
    desc: "1999. El RTS que todavía tiene torneos activos en 2026. Definición de clásico eterno.",
    datos: [
      { k: "Desarrollador", v: "Ensemble Studios / Forgotten Empires" },
      { k: "Año", v: "1999 / Definitive 2019" },
      { k: "Plataforma", v: "PC" },
      { k: "Estado", v: "Activo — torneos y DLC en 2026" }
    ],
    trailer: "https://www.youtube.com/embed/IreuXKVh68M?autoplay=1&mute=1",
    tiempoHoras: 500,
    dificultad: "ALTA",
    modoJuego: ["single","online","coop"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>27 años después de su lanzamiento, Age of Empires II tiene torneos activos con miles de espectadores, recibe DLC con nuevas civilizaciones y es el RTS más jugado en Steam.</p>
      <h3>POR QUÉ SIGUE VIVO</h3>
      <p>La Definitive Edition de 2019 modernizó los gráficos y la interfaz sin tocar la jugabilidad base.</p>
      <h3>LO MEJOR</h3>
      <p>Las campañas históricas: Juana de Arco, Gengis Khan, Saladino. Y el sonido del aldeano al recibir una orden.</p>
    `
  },
  {
    id: "bully",
    tags: ["clasico","accion","mundo-abierto","rockstar","humor"],
    titulo: "BULLY: SCHOLARSHIP EDITION",
    genero: "Acción · Aventura · Mundo Escolar",
    cat: "clasico",
    catLabel: "CLÁSICOS",
    anio: "2006",
    rating: 5,
    plataformas: ["pc", "ps", "xbox"],
    img: "Imagenes/Gaming/bully.jpg",
    desc: "Rockstar, pero en un internado. Jimmy Hopkins y la política de los pasillos de Bullworth.",
    datos: [
      { k: "Desarrollador", v: "Rockstar Vancouver" },
      { k: "Año", v: "2006 / Scholarship 2008" },
      { k: "Plataforma", v: "PS2 / Xbox 360 / PC" },
      { k: "Secuela", v: "Rumoreada, sin confirmación" }
    ],
    trailer: "https://www.youtube.com/embed/yqkynwFs9Hs?autoplay=1&mute=1",
    tiempoHoras: 18,
    dificultad: "BAJA",
    modoJuego: ["single"],
    hasGuia: false,
    fechaAdd: "2026-01-01",
    texto: `
      <p>Jimmy Hopkins llega a la Academia Bullworth, el internado más disfuncional del mundo. Matones, nerds, prepis, pijos y greasers.</p>
      <h3>ROCKSTAR EN MODO COMEDIA</h3>
      <p>Bully tiene el mismo ADN de GTA pero con la violencia desactivada y el humor al máximo. Ir a clase, hacer los deberes y mantener buenas notas tiene consecuencias reales en el juego.</p>
      <h3>LO MEJOR</h3>
      <p>La estructura de día escolar. La forma en que cada facción del colegio tiene su propio mundo y reglas.</p>
    `
  },

];
/* __JUEGOS_END__ */


/* ═══════════════════════════════════════════════════════════════
   HELPERS DE CONSULTA
   Funciones de utilidad para filtrar/buscar sobre JUEGOS
   ═══════════════════════════════════════════════════════════════ */

/** Devuelve un juego por su id */
function getJuegoById(id) {
  return JUEGOS.find(j => j.id === id) || null;
}

/** Devuelve todos los juegos de una categoría */
function getJuegosByCat(cat) {
  return JUEGOS.filter(j => j.cat === cat);
}

/** Devuelve todos los juegos que tienen hasGuia: true */
function getJuegosConGuia() {
  return JUEGOS.filter(j => j.hasGuia === true);
}

/** Devuelve los juegos marcados como destacados */
function getJuegosDestacados() {
  return JUEGOS.filter(j => j.destacado === true);
}

/** Devuelve los juegos nuevos (nuevo: true) */
function getJuegosNuevos() {
  return JUEGOS.filter(j => j.nuevo === true);
}

/** Devuelve juegos por tag */
function getJuegosByTag(tag) {
  return JUEGOS.filter(j => (j.tags || []).includes(tag));
}

/** Devuelve juegos por plataforma */
function getJuegosByPlat(plat) {
  return JUEGOS.filter(j => (j.plataformas || []).includes(plat));
}

/** Devuelve juegos por modo de juego */
function getJuegosByModo(modo) {
  return JUEGOS.filter(j => (j.modoJuego || []).includes(modo));
}

/** Devuelve juegos por dificultad */
function getJuegosByDificultad(dif) {
  return JUEGOS.filter(j => j.dificultad === dif);
}

/** Stats rápidos del catálogo */
function getCatalogStats() {
  return {
    total: JUEGOS.length,
    porCat: CATS.reduce((acc, c) => {
      acc[c.id] = JUEGOS.filter(j => j.cat === c.id).length;
      return acc;
    }, {}),
    conGuia: getJuegosConGuia().length,
    nuevos: getJuegosNuevos().length,
    destacados: getJuegosDestacados().length,
    ratings: {
      imprescindible: JUEGOS.filter(j => j.rating === 5).length,
      muyBueno: JUEGOS.filter(j => j.rating === 4).length,
      notable: JUEGOS.filter(j => j.rating === 3).length,
    }
  };
}

/*
 * ═══════════════════════════════════════════════════════════════
 *  GUÍA DE MIGRACIÓN A SUPABASE
 * ═══════════════════════════════════════════════════════════════
 *
 *  TABLA: games
 *  ┌─────────────────┬─────────────┬────────────────────────────┐
 *  │ Campo JS        │ Tipo SQL    │ Notas                      │
 *  ├─────────────────┼─────────────┼────────────────────────────┤
 *  │ id              │ text PK     │ slug único                 │
 *  │ titulo          │ text        │                            │
 *  │ cat             │ text        │ FK -> categories.id        │
 *  │ cat_label       │ text        │                            │
 *  │ genero          │ text        │                            │
 *  │ anio            │ text        │ string para consistencia   │
 *  │ rating          │ int2        │ 1-5                        │
 *  │ plataformas     │ text[]      │ array                      │
 *  │ tags            │ text[]      │ array                      │
 *  │ img             │ text        │ ruta o URL                 │
 *  │ desc            │ text        │                            │
 *  │ datos           │ jsonb       │ [{k,v}]                    │
 *  │ trailer         │ text        │ URL embed                  │
 *  │ texto           │ text        │ HTML                       │
 *  │ tiempo_horas    │ int4        │                            │
 *  │ dificultad      │ text        │ BAJA/MEDIA/ALTA/MUY ALTA  │
 *  │ modo_juego      │ text[]      │ single/online/coop/local   │
 *  │ has_guia        │ boolean     │                            │
 *  │ destacado       │ boolean     │                            │
 *  │ nuevo           │ boolean     │                            │
 *  │ fecha_add       │ date        │                            │
 *  └─────────────────┴─────────────┴────────────────────────────┘
 *
 *  CUANDO CONECTES SUPABASE:
 *  1. Crea la tabla con el schema de arriba
 *  2. Importa los datos del array JUEGOS con un script Node:
 *     const { createClient } = require('@supabase/supabase-js')
 *     const supabase = createClient(URL, KEY)
 *     await supabase.from('games').insert(JUEGOS.map(normalize))
 *  3. En gaming-data.js, sustituye "const JUEGOS = [...]" por:
 *     const { data: JUEGOS } = await supabase.from('games').select('*')
 *  4. El resto del código de gaming.html no necesita cambios
 *     porque ya consume JUEGOS como array en ambos casos.
 *
 * ═══════════════════════════════════════════════════════════════
 */
