-- Seed maps
INSERT INTO maps (name, mode, active) VALUES
-- Control
('Ilios', 'Control', true),
('Lijiang Tower', 'Control', true),
('Oasis', 'Control', true),
('Nepal', 'Control', true),
('Busan', 'Control', true),
-- Escort
('Circuit Royal', 'Escort', true),
('Dorado', 'Escort', true),
('Route 66', 'Escort', true),
('Gibraltar', 'Escort', true),
('Junkertown', 'Escort', true),
-- Hybrid
('Midtown', 'Hybrid', true),
('King''s Row', 'Hybrid', true),
('Eichenwalde', 'Hybrid', true),
('Hollywood', 'Hybrid', true),
('Paraíso', 'Hybrid', true),
-- Push
('New Queen Street', 'Push', true),
('Colosseo', 'Push', true),
('Esperança', 'Push', true)
ON CONFLICT (name) DO NOTHING;

-- Seed heroes
INSERT INTO heroes (name, role) VALUES
-- Tanks
('Reinhardt', 'Tank'),
('Sigma', 'Tank'),
('Roadhog', 'Tank'),
('Zarya', 'Tank'),
('D.Va', 'Tank'),
('Junker Queen', 'Tank'),
('Orisa', 'Tank'),
('Wrecking Ball', 'Tank'),
('Doomfist', 'Tank'),
('Mauga', 'Tank'),
-- Damage
('Tracer', 'Damage'),
('Widowmaker', 'Damage'),
('Reaper', 'Damage'),
('Soldier: 76', 'Damage'),
('Genji', 'Damage'),
('Cassidy', 'Damage'),
('Junkrat', 'Damage'),
('Hanzo', 'Damage'),
('Symmetra', 'Damage'),
('Torbjörn', 'Damage'),
('Pharah', 'Damage'),
('Bastion', 'Damage'),
('Sombra', 'Damage'),
-- Supports
('Mercy', 'Support'),
('Ana', 'Support'),
('Lúcio', 'Support'),
('Zenyatta', 'Support'),
('Brigitte', 'Support'),
('Moira', 'Support'),
('Baptiste', 'Support'),
('Kiriko', 'Support'),
('Lifeweaver', 'Support'),
('Illari', 'Support')
ON CONFLICT (name) DO NOTHING;
