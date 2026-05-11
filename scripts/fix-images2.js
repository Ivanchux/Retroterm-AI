// Fix imágenes incorrectas usando queries exactas de IGDB
// node scripts/fix-images2.js

const CLIENT_ID     = 'jd9wfj36mgoc1n3fl17lm831b6ak5q';
const CLIENT_SECRET = 'trr2132qfivlqk7if9edjqz0ioofpu';
const SUPA_URL      = 'https://kldtrfreyeiidkliahdy.supabase.co/rest/v1/';
const SUPA_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZHRyZnJleWVpaWRrbGlhaGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMyODEsImV4cCI6MjA5MTI1OTI4MX0.H8CCJkVI1Ir-JY7FrneFrdicXecEhGEWGFtJkRVpAKw';

// Queries exactas — "where name" es más fiable que "search"
const FIXES = [
  {
    id:    'witcher3',
    label: 'The Witcher 3',
    body:  'fields name,cover.url,screenshots.url; where name = "The Witcher 3: Wild Hunt"; limit 1;'
  },
  {
    id:    'kcd2',
    label: 'Kingdom Come: Deliverance II',
    body:  'fields name,cover.url,screenshots.url; where name = "Kingdom Come: Deliverance II"; limit 1;'
  },
  {
    id:    'resi4',
    label: 'Resident Evil 4 Remake',
    body:  'fields name,cover.url,screenshots.url; where name = "Resident Evil 4" & first_release_date >= 1672531200; limit 1;'
    //                                                                                  ↑ después del 1 enero 2023
  },
  {
    id:    'sims',
    label: 'Los Sims 4',
    body:  'fields name,cover.url,screenshots.url; where name = "The Sims 4"; limit 1;'
  },
];

async function getToken() {
  const r = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  ).then(r => r.json());
  if (!r.access_token) { console.error('❌ Token error:', r); process.exit(1); }
  return r.access_token;
}

async function igdbQuery(token, body) {
  const r = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
    body
  }).then(r => r.json());
  return Array.isArray(r) ? r[0] : null;
}

function igdbUrl(url, size) {
  return url ? 'https:' + url.replace('t_thumb', size) : null;
}

async function sbPatch(gameId, body) {
  // Necesitamos política de update activa — añádela si falta
  await fetch(`${SUPA_URL}games?id=eq.${gameId}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal'
    },
    body: JSON.stringify(body)
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('🔑 Token...');
  const token = await getToken();
  console.log('✓ OK\n');

  for (const fix of FIXES) {
    process.stdout.write(`[${fix.label}] buscando... `);
    const game = await igdbQuery(token, fix.body);
    if (!game) {
      console.log('✗ No encontrado en IGDB');
      await sleep(400);
      continue;
    }
    const img  = igdbUrl(game.cover?.url, 't_cover_big_2x');
    const ss   = (game.screenshots || []).slice(0, 6).map(s => igdbUrl(s.url, 't_screenshot_big')).filter(Boolean);
    await sbPatch(fix.id, { img, screenshots: ss });
    console.log(`✓  "${game.name}" → ${img ? '🖼' : '—'} + ${ss.length} ss`);
    await sleep(400);
  }

  console.log('\n✅ Listo. Recuerda: DROP POLICY "games_temp_update" ON games; si la reactivaste.');
})();
