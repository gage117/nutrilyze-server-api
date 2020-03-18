const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Ingredients Endpoints', () => {
  let db;

  const {
    testUsers,
    testIngredients
  } = helpers.makeIngredientsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  
  after('kill connection to database', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/ingredients/', () => {
    context('Given no ingredients', () => {
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/ingredients')
          .expect(200, []);
      });
    });
    context('Given there are ingredients in database', () => {
      beforeEach('insert ingredients', () =>
        helpers.seedIngredientsTables(db, testUsers, testIngredients)
      );
      
      it('responds 200 and an array of ingredients', () => {
        const expectedIngredients = testIngredients.map(ingredient => 
          helpers.makeExpectedIngredient(testUsers, ingredient)
        );
        return supertest(app)
          .get('/api/ingredients')
          .expect(200, expectedIngredients);
      });
    });
  });
});