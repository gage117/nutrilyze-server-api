BEGIN;

TRUNCATE
  ingredients,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, name, password)
VALUES
  ('demouser', 'Demo', '$2a$10$bfLdoElJnlxI9.cSS97P6OmRz7TrgTWaGh9nK7YyBFfmp0cmT7dge');

INSERT INTO ingredients (user_id, name, calories, protein, carbs, sugar, fiber, fat, sodium, serving_size, unit_of_measure)
VALUES
  (1, 'Banana', 89, 1.1, 22.8, 12.2, 2.6, 0.3, 0, '100', 'g'),
  (1, 'Broccoli', 31, 2.5, 6, 1.5, 2.4, 0.4, 0, '1', 'cups'),
  (1, 'White Rice', 68, 1.42, 14.84, 0.03, 0.2, .04, 1, '1/3', 'cups'),
  (1, 'Spaghetti Noodles', 200, 7, 42, 2, 2, 1, 0, '2', 'oz'),
  (1, 'Pasta Sauce', 68, 1.42, 14.84, .03, .2, .04, 1, '1/3', 'cups'),
  (1, '1LB 80/20 Ground Beef', 307, 30.5, 0, 0, 0, 19.6, 103, '1', 'lb'),
  (1, 'Tangerine (Mandarin Orange)', 40, 0.6, 10.1, 8, 1.4, 0.2, 2, '1', 'each'),
  (1, 'White Bread Slice', 90, 3, 17, 2, 1, 1, 180, '1', 'each'),
  (1, 'Smooth Peanut Butter', 190, 7, 8, 3, 2, 16, 140, '2', 'tbsp'),
  (1, 'Hazelnut Spread', 200, 2, 22, 21, 1, 11, 15, '2', 'tbsp'),
  (1, '1% Milk', 110, 8, 13, 12, 0, 2.5, 125, '1', 'cups'),
  (1, 'Strawberry Yogurt', 150, 6, 25, 19, 0, 2, 90, '1', 'container');

COMMIT;