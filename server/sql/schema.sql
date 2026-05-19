-- Maps table
CREATE TABLE maps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  mode VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Heroes table
CREATE TABLE heroes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  map_id INTEGER NOT NULL REFERENCES maps(id) ON DELETE RESTRICT,
  result VARCHAR(10) NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match heroes junction table (up to 3 heroes per match)
CREATE TABLE match_heroes (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  hero_id INTEGER NOT NULL REFERENCES heroes(id) ON DELETE RESTRICT,
  hero_order INTEGER NOT NULL CHECK (hero_order IN (1, 2, 3)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, hero_order)
);

-- Indexes for common queries
CREATE INDEX idx_matches_map_id ON matches(map_id);
CREATE INDEX idx_matches_played_at ON matches(played_at);
CREATE INDEX idx_match_heroes_match_id ON match_heroes(match_id);
CREATE INDEX idx_match_heroes_hero_id ON match_heroes(hero_id);
