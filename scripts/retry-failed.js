// ═══════════════════════════════════════════════════════════════
// RETROTERM.AI — Reintento de los 6 juegos que fallaron
// Ejecutar: node scripts/retry-failed.js
// ═══════════════════════════════════════════════════════════════

const CLIENT_SECRET = 'trr2132qfivlqk7if9edjqz0ioofpu';
const CLIENT_ID     = 'jd9wfj36mgoc1n3fl17lm831b6ak5q';
const SUPA_URL      = 'https://kldtrfreyeiidkliahdy.supabase.co/rest/v1/';
const SUPA_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZHRyZnJleWVpaWRrbGlhaGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMyODEsImV4cCI6MjA5MTI1OTI4MX0.H8CCJkVI1Ir-JY7FrneFrdicXecEhGEWGFtJkRVpAKw';

// Juegos a reintentar: { id en Supabase: búsqueda en IGDB }
const RETRY = {
  'ac':                  "Assassin's Creed II",
  'dishonored':          'Dishonored',
  'gtasanandreas':       'Grand Theft Auto San Andreas',
  'reddeadredemption':   'Red Dead Redemption',
  'resi4':               'Resident Evil 4 Remake',
  'southpark':           'South Park The Fractured But Whole',
};

async function getToken() {
  const res  = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  const data = await res.json();
  if (!data.access_token) { console.error('❌ Token error:', data); process.exit(1); }
  return data.access_token;
}

async function searchIGDB(token, query) {
  const res     = await fetch('https://api.igdb.com/v4/games', {
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

async function sbPatch(gameId, body) {
  return fetch(SUPA_URL + `games?id=eq.${gameId}`, {
    method: 'PATCH',
    headers: {
      apikey:         SUPA_KEY,
      Authorization:  `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'return=minimal'
    },
    body: JSON.stringify(body)
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('🔑 Obteniendo token de Twitch...');
  const token = await getToken();
  console.log('✓ Token OK\n');
  console.log('─'.repeat(60));

  let ok = 0, fail = 0;
  const entries = Object.entries(RETRY);

  for (let i = 0; i < entries.length; i++) {
    const [gameId, query] = entries[i];
    const num = String(i + 1).padStart(2, '0');

    process.stdout.write(`[${num}/${entries.length}] ${query} ... `);

    try {
      const igdb = await searchIGDB(token, query);

      if (!igdb) {
        console.log('✗ No encontrado en IGDB');
        fail++;
        await sleep(400);
        continue;
      }

      const img         = igdbUrl(igdb.cover?.url, 't_cover_big_2x');
      const screenshots = (igdb.screenshots || [])
        .slice(0, 6)
        .map(s => igdbUrl(s.url, 't_screenshot_big'))
        .filter(Boolean);

      await sbPatch(gameId, { img, screenshots });
      console.log(`✓  ${img ? '🖼 portada' : '—'} + ${screenshots.length} screenshots`);
      ok++;
    } catch (err) {
      console.log(`✗ Error: ${err.message}`);
      fail++;
    }

    await sleep(400);
  }

  console.log('─'.repeat(60));
  console.log(`\n✅ Reintento completo — ${ok} OK, ${fail} errores`);

  if (ok === entries.length) {
    console.log('\n🎉 ¡Los 43 juegos tienen imágenes!');
    console.log('\nNo olvides ejecutar en Supabase SQL Editor:');
    console.log('  DROP POLICY "games_temp_update" ON games;');
  }
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1); });
