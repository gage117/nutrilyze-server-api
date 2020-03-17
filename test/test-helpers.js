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
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20
    },
    {
      id: 2,
      name: 'Demo2',
      user_name: 'demouser2',
      password: 'password',
      calories: 666,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20
    },
    {
      id: 3,
      name: 'Demo3',
      user_name: 'demouser3',
      password: 'password',
      calories: 666,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20
    },
    {
      id: 4,
      name: 'Demo4',
      user_name: 'demouser4',
      password: 'password',
      calories: 666,
      protein: 20,
      carbs: 40,
      sugar: 20,
      fiber: 10,
      fat: 30,
      sodium: 20
    },
  ]
}

function makeIngredientsArray(users) {
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
  ]
}
function makeExpectedThing(users, thing, reviews=[]) {
  const user = users
    .find(user => user.id === thing.user_id)

  const thingReviews = reviews
    .filter(review => review.thing_id === thing.id)

  const number_of_reviews = thingReviews.length
  const average_review_rating = calculateAverageReviewRating(thingReviews)

  return {
    id: thing.id,
    image: thing.image,
    title: thing.title,
    content: thing.content,
    date_created: thing.date_created,
    number_of_reviews,
    average_review_rating,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  }
}

function calculateAverageReviewRating(reviews) {
  if(!reviews.length) return 0

  const sum = reviews
    .map(review => review.rating)
    .reduce((a, b) => a + b)

  return Math.round(sum / reviews.length)
}

function makeExpectedThingReviews(users, thingId, reviews) {
  const expectedReviews = reviews
    .filter(review => review.thing_id === thingId)

  return expectedReviews.map(review => {
    const reviewUser = users.find(user => user.id === review.user_id)
    return {
      id: review.id,
      text: review.text,
      rating: review.rating,
      date_created: review.date_created,
      user: {
        id: reviewUser.id,
        user_name: reviewUser.user_name,
        full_name: reviewUser.full_name,
        nickname: reviewUser.nickname,
        date_created: reviewUser.date_created,
      }
    }
  })
}

function makeMaliciousThing(user) {
  const maliciousThing = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedThing = {
    ...makeExpectedThing([user], maliciousThing),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousThing,
    expectedThing,
  }
}

function makeThingsFixtures() {
  const testUsers = makeUsersArray()
  const testThings = makeThingsArray(testUsers)
  const testReviews = makeReviewsArray(testUsers, testThings)
  return { testUsers, testThings, testReviews }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      thingful_things,
      thingful_users,
      thingful_reviews
      RESTART IDENTITY CASCADE`
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(u => ({
    ...u,
    password: bcrypt.hashSync(u.password, 1)
  }))
  return db.into('thingful_users').insert(preppedUsers)
    .then(() => {
      `SELECT setval('thingful_users_id_seq', ?)`,
      [users[users.length - 1].id]
    })
}

function seedThingsTables(db, users, things, reviews=[]) {
  return seedUsers(db, users)
    .then(() =>
      db
        .into('thingful_things')
        .insert(things)
    )
    .then(() =>
      reviews.length && db.into('thingful_reviews').insert(reviews)
    )
}

function seedMaliciousThing(db, user, thing) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('thingful_things')
        .insert([thing])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeThingsArray,
  makeExpectedThing,
  makeExpectedThingReviews,
  makeMaliciousThing,
  makeReviewsArray,

  makeThingsFixtures,
  cleanTables,
  seedThingsTables,
  seedMaliciousThing,
  makeAuthHeader,
  seedUsers
}

