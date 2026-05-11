const CID = 'jd9wfj36mgoc1n3fl17lm831b6ak5q';
const CS  = 'trr2132qfivlqk7if9edjqz0ioofpu';
const SU  = 'https://kldtrfreyeiidkliahdy.supabase.co/rest/v1/';
const SK  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZHRyZnJleWVpaWRrbGlhaGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMyODEsImV4cCI6MjA5MTI1OTI4MX0.H8CCJkVI1Ir-JY7FrneFrdicXecEhGEWGFtJkRVpAKw';

const GAMES = [
  { id: 'dishonored', q: 'Dishonored 2' },
  { id: 'resi4',      q: 'Resident Evil 4' },
];

(async () => {
  const tok = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CID}&client_secret=${CS}&grant_type=client_credentials`,
    { method: 'POST' }
  ).then(r => r.json());
  const token = tok.access_token;
  console.log('Token OK');

  for (const g of GAMES) {
    const results = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: { 'Client-ID': CID, Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
      body: `search "${g.q}"; fields name,cover.url,screenshots.url; limit 1;`
    }).then(r => r.json());

    const d = results[0];
    if (!d) { console.log(`✗ ${g.q} — no encontrado`); continue; }

    const img = d.cover?.url ? 'https:' + d.cover.url.replace('t_thumb', 't_cover_big_2x') : null;
    const ss  = (d.screenshots || []).slice(0, 6).map(s => 'https:' + s.url.replace('t_thumb', 't_screenshot_big'));

    await fetch(`${SU}games?id=eq.${g.id}`, {
      method: 'PATCH',
      headers: { apikey: SK, Authorization: `Bearer ${SK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ img, screenshots: ss })
    });
    console.log(`✓ ${g.q} — portada: ${!!img} + ${ss.length} screenshots`);
  }
  console.log('Listo. Ahora ejecuta en Supabase: DROP POLICY "games_temp_update" ON games;');
})();
