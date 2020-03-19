const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('User Endpoints', () => {
  let db;

  const {
    testUsers
  } = helpers.makeIngredientsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/user/', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers(db, testUsers)
    );

    it('responds 200 and the user', () => {
      const expectedUser = testUsers[0];
      delete expectedUser.password;
      expectedUser.carbs = parseFloat(expectedUser.carbs).toFixed(2);
      expectedUser.protein = parseFloat(expectedUser.protein).toFixed(2);
      expectedUser.sugar = parseFloat(expectedUser.sugar).toFixed(2);
      expectedUser.fiber = parseFloat(expectedUser.fiber).toFixed(2);
      expectedUser.fat = parseFloat(expectedUser.fat).toFixed(2);

      return supertest(app)
        .get('/api/user/demouser')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200, expectedUser);
    });
  });
});
