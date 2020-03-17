DROP TYPE IF EXISTS units;
CREATE TYPE units AS ENUM (
  'lb',
  'oz',
  'g',
  'cups',
  'tspn',
  'tbsp',
  'container',
  'each',
  'other'
);

CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(5, 2) NOT NULL,
  carbs DECIMAL(5, 2) NOT NULL,
  sugar DECIMAL(5, 2) NOT NULL,
  fiber DECIMAL(5, 2) NOT NULL,
  fat DECIMAL(5, 2) NOT NULL,
  sodium INTEGER NOT NULL,
  serving_size TEXT NOT NULL,
  unit_of_measure units NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL
);