CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  password TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein DECIMAL(7, 2) NOT NULL DEFAULT 0,
  carbs DECIMAL(7, 2) NOT NULL DEFAULT 0,
  sugar DECIMAL(7, 2) NOT NULL DEFAULT 0,
  fiber DECIMAL(7, 2) NOT NULL DEFAULT 0,
  fat DECIMAL(7, 2) NOT NULL DEFAULT 0,
  sodium INTEGER NOT NULL DEFAULT 0
);