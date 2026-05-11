-- ═══════════════════════════════════════════════════════════════
-- RETROTERM.AI — Schema para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════

-- ── TABLA: games ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id           text        PRIMARY KEY,
  titulo       text        NOT NULL,
  cat          text,
  cat_label    text,
  genero       text,
  anio         text,
  rating       int2,
  plataformas  text[]      DEFAULT '{}',
  tags         text[]      DEFAULT '{}',
  img          text,
  descripcion  text,
  datos        jsonb       DEFAULT '[]',
  trailer      text,
  texto        text,
  tiempo_horas int4,
  dificultad   text,
  modo_juego   text[]      DEFAULT '{}',
  has_guia     boolean     DEFAULT false,
  destacado    boolean     DEFAULT false,
  nuevo        boolean     DEFAULT false,
  fecha_add    date
);

-- ── TABLA: reviews ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         bigserial   PRIMARY KEY,
  game_id    text        NOT NULL,
  session_id text,
  score      int2        NOT NULL CHECK (score >= 1 AND score <= 10),
  nick       text,
  text       text,
  created_at timestamptz DEFAULT now()
);

-- ── TABLA: user_estados ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_estados (
  session_id text        NOT NULL,
  game_id    text        NOT NULL,
  estado     text,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (session_id, game_id)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────
ALTER TABLE games        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_estados ENABLE ROW LEVEL SECURITY;

-- Games: lectura pública
CREATE POLICY "games_public_read"
  ON games FOR SELECT USING (true);

-- Reviews: lectura e inserción pública (anónima por session_id)
CREATE POLICY "reviews_public_read"
  ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_public_insert"
  ON reviews FOR INSERT WITH CHECK (true);

-- User estados: acceso completo (identificado por session_id del cliente)
CREATE POLICY "estados_public_read"
  ON user_estados FOR SELECT USING (true);
CREATE POLICY "estados_public_insert"
  ON user_estados FOR INSERT WITH CHECK (true);
CREATE POLICY "estados_public_update"
  ON user_estados FOR UPDATE USING (true);

-- ── VISTA OPCIONAL: ranking de juegos ────────────────────────────
-- Úsala desde gaming.html cuando quieras mostrar un top público
CREATE OR REPLACE VIEW game_rankings AS
SELECT
  game_id,
  ROUND(AVG(score)::numeric, 1) AS avg_score,
  COUNT(*)                       AS total_votes
FROM reviews
GROUP BY game_id
ORDER BY avg_score DESC;
