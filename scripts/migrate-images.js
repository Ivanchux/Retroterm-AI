// ═══════════════════════════════════════════════════════════════
// RETROTERM.AI — Migración de imágenes desde IGDB
// Ejecutar: node scripts/migrate-images.js
// Requiere Node.js 18+ (fetch nativo)
// ═══════════════════════════════════════════════════════════════

// ── CONFIGURA AQUÍ TU SECRET ────────────────────────────────────
const CLIENT_SECRET = 'trr2132qfivlqk7if9edjqz0ioofpu';
// ───────────────────────────────────────────────────────────────

const CLIENT_ID = 'jd9wfj36mgoc1n3fl17lm831b6ak5q';
const SUPA_URL  = 'https://kldtrfreyeiidkliahdy.supabase.co/rest/v1/';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZHRyZnJleWVpaWRrbGlhaGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMyODEsImV4cCI6MjA5MTI1OTI4MX0.H8CCJkVI1Ir-JY7FrneFrdicXecEhGEWGFtJkRVpAKw';

// Nombres alternativos para búsquedas difíciles
const IGDB_SEARCH_OVERRIDE = {
  'cyberpunk':          'Cyberpunk 2077',
  'rdr2':               'Red Dead Redemption 2',
  'rdr1':               'Red Dead Redemption',
  'nms':                'No Man\'s Sky',
  'kcd2':               'Kingdom Come Deliverance II',
  'witcher3':           'The Witcher 3 Wild Hunt',
  'bg3':                'Baldur\'s Gate 3',
  'eldenring':          'Elden Ring',
  'skyrim':             'The Elder Scrolls V Skyrim',
  'fallout-nv':         'Fallout New Vegas',
  'death-stranding':    'Death Stranding',
  'sea-of-stars':       'Sea of Stars',
  'outer-wilds':        'Outer Wilds',
  'mafia':              'Mafia II',
  'ac-ezio':            'Assassin\'s Creed II',
  'dishonored':         'Dishonored',
  'gtav':               'Grand Theft Auto V',
  'watch-dogs-2':       'Watch Dogs 2',
  'just-cause-4':       'Just Cause 4',
  'max-payne':          'Max Payne',
  'batman-arkham':      'Batman Arkham City',
  'half-life-2':        'Half-Life 2',
  'hades':              'Hades',
  're4':                'Resident Evil 4',
  'returnal':           'Returnal',
  'celeste':            'Celeste',
  'pop-sot':            'Prince of Persia The Sands of Time',
  'south-park-stick':   'South Park The Stick of Truth',
  'south-park-frac':    'South Park The Fractured But Whole',
  'goat-simulator':     'Goat Simulator',
  'untitled-goose':     'Untitled Goose Game',
  'stanley-parable':    'The Stanley Parable',
  'portal':             'Portal 2',
  'crazy-taxi':         'Crazy Taxi',
  'spore':              'Spore',
  'sims':               'The Sims 4',
  'gta-sa':             'Grand Theft Auto San Andreas',
  'aoe2':               'Age of Empires II Definitive Edition',
  'bully':              'Bully',
  'crimson-desert':     'Crimson Desert',
  'starfield':          'Starfield',
  '007':                'James Bond 007 First Light',
};

// ── HELPERS ─────────────────────────────────────────────────────

async function getToken() {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  const data = await res.json();
  if (!data.access_token) {
    console.error('❌ Error obteniendo token:', data);
    process.exit(1);
  }
  return data.access_token;
}

async function searchIGDB(token, query) {
  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID':     CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'text/plain'
    },
    body: `search "${query}"; fields name,cover.url,screenshots.url; limit 1;`
  });
  const results = await res.json();
  return Array.isArray(results) ? results[0] : null;
}

function igdbUrl(url, size) {
  if (!url) return null;
  return 'https:' + url.replace('t_thumb', size);
}

async function sbGet(path) {
  const res = await fetch(SUPA_URL + path, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
  });
  return res.json();
}

async function sbPatch(path, body) {
  return fetch(SUPA_URL + path, {
    method: 'PATCH',
    headers: {
      apikey:          SUPA_KEY,
      Authorization:   `Bearer ${SUPA_KEY}`,
      'Content-Type':  'application/json',
      Prefer:          'return=minimal'
    },
    body: JSON.stringify(body)
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── MAIN ─────────────────────────────────────────────────────────

async function main() {
  if (CLIENT_SECRET === 'PEGA_AQUÍ_TU_CLIENT_SECRET') {
    console.error('❌ Edita el script y pon tu Client Secret en la línea 11');
    process.exit(1);
  }

  console.log('🔑 Obteniendo token de Twitch...');
  const token = await getToken();
  console.log('✓ Token OK\n');

  console.log('📦 Cargando juegos de Supabase...');
  const games = await sbGet('games?select=id,titulo&order=titulo.asc');
  console.log(`✓ ${games.length} juegos encontrados\n`);
  console.log('─'.repeat(60));

  let ok = 0, fail = 0;

  for (let i = 0; i < games.length; i++) {
    const game   = games[i];
    const num    = String(i + 1).padStart(2, '0');
    const query  = IGDB_SEARCH_OVERRIDE[game.id] || game.titulo;

    process.stdout.write(`[${num}/${games.length}] ${game.titulo} ... `);

    try {
      const igdb = await searchIGDB(token, query);

      if (!igdb) {
        console.log('✗ No encontrado en IGDB');
        fail++;
        await sleep(300);
        continue;
      }

      const img         = igdbUrl(igdb.cover?.url,        't_cover_big_2x');
      const screenshots = (igdb.screenshots || [])
        .slice(0, 6)
        .map(s => igdbUrl(s.url, 't_screenshot_big'))
        .filter(Boolean);

      await sbPatch(`games?id=eq.${game.id}`, { img, screenshots });

      console.log(`✓  ${img ? '🖼 portada' : '—'} + ${screenshots.length} screenshots`);
      ok++;
    } catch (err) {
      console.log(`✗ Error: ${err.message}`);
      fail++;
    }

    await sleep(300); // Respetar rate limit de IGDB (~4 req/s)
  }

  console.log('─'.repeat(60));
  console.log(`\n✅ Migración completa — ${ok} OK, ${fail} errores`);
  console.log('\nRecuerda: ve al SQL Editor de Supabase y ejecuta:');
  console.log('  DROP POLICY "games_temp_update" ON games;');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
