const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      name: 'Demo',
      user_name: 'demouser',
      password: 'password',
      calories: 666,
      protein: 20.00,
      carbs: 40.00,
      sugar: 20.00,
      fiber: 10.00,
      fat: 30.00,
      sodium: 20
    },
    {
      id: 2,
      name: 'Demo2',
      user_name: 'demouser2',
      password: 'password',
      calories: 666,
      protein: 20.00,
      carbs: 40.00,
      sugar: 20.00,
      fiber: 10.00,
      fat: 30.00,
      sodium: 20
    },
    {
      id: 3,
      name: 'Demo3',
      user_name: 'demouser3',
      password: 'password',
      calories: 666,
      protein: 20.00,
      carbs: 40.00,
      sugar: 20.00,
      fiber: 10.00,
      fat: 30.00,
      sodium: 20
    },
    {
      id: 4,
      name: 'Demo4',
      user_name: 'demouser4',
      password: 'password',
      calories: 666,
      protein: 20.00,
      carbs: 40.00,
      sugar: 20.00,
      fiber: 10.00,
      fat: 30.00,
      sodium: 20
    },
  ];
}

function makeIngredientsArray() {
  return [
    {
      id: 1,
      name: 'First test thing!',
      calories: 500,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20,
      serving_size: '1',
      unit_of_measure: 'cups',
      user_id: 1
    },
    {
      id: 2,
      name: 'Second test thing!',
      calories: 500,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20,
      serving_size: '1',
      unit_of_measure: 'cups',
      user_id: 1
    },
    {
      id: 3,
      name: 'Third test thing!',
      calories: 500,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20,
      serving_size: '1',
      unit_of_measure: 'cups',
      user_id: 1
    },
    {
      id: 4,
      name: 'Fourth test thing!',
      calories: 500,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20,
      serving_size: '1',
      unit_of_measure: 'cups',
      user_id: 1
    },
  ];
}
function makeExpectedIngredient(users, ingredient) {
  const user = users
    .find(user => user.id === ingredient.user_id);

  return {
    id: ingredient.id,
    name: ingredient.name,
    calories: ingredient.calories,
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fiber: ingredient.fiber,
    fat: ingredient.fat,
    sodium: ingredient.sodium,
    serving_size: ingredient.serving_size,
    unit_of_measure: ingredient.unit_of_measure,
    user_id: ingredient.user_id
  };
}

function makeMaliciousIngredient(user) {
  const maliciousIngredient = {
    id: 911,
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    calories: 500,
    protein: 20,
    carbs: 40,
    sugar: 20,
    fiber: 10,
    fat: 30,
    sodium: 20,
    serving_size: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    unit_of_measure: 'cups',
    user_id: user.id,
  };
  const expectedIngredient = {
    ...makeExpectedIngredient([user], maliciousIngredient),
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    serving_size: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousIngredient,
    expectedIngredient,
  };
}

function makeIngredientsFixtures() {
  const testUsers = makeUsersArray();
  const testIngredients = makeIngredientsArray();
  return { testUsers, testIngredients };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      ingredients,
      users
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(u => ({
    ...u,
    password: bcrypt.hashSync(u.password, 1)
  }));
  return db.into('users').insert(preppedUsers)
    .then(() => {
      `SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id];
    });
}

function seedIngredientsTables(db, users, ingredients) {
  return seedUsers(db, users)
    .then(() => {
      return db
        .into('ingredients')
        .insert(ingredients)
    });
}

function seedMaliciousIngredient(db, user, ingredient) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('ingredients')
        .insert([ingredient])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeIngredientsArray,
  makeExpectedIngredient,
  makeMaliciousIngredient,
  makeIngredientsFixtures,
  cleanTables,
  seedIngredientsTables,
  seedMaliciousIngredient,
  makeAuthHeader,
  seedUsers
};

