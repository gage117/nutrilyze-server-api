# Nutrilyze Server API

Live Version: https://nutrilyze-client.now.sh/

[Github](https://github.com/gage117/nutrilyze-server-api)

## Summary
Server API meant to pair with the Nutrilyze React Client [Github](https://github.com/gage117/nutrilyze-client)

Interfaces the React Client with a postgres database and handles HTTP requests

## Routes and Services
There are 3 routes to the server; auth, ingredients, and users. All come after an /api path (e.g. localhost:8000/api/ingredients). Each route has a corresponding services file to handle the SQL statements for the database

### /auth Route
Consists of a POST method to be used to post credentials on login

### /ingredients Route
Has a GET method to retrieve all ingredients, and a POST method to post new ingredients

### /user Route
Has a GET method to retrieve a user by username, a POST method to post new users, and a PATCH method to update users in the database

## Set up

- Clone this repo `git clone https://github.com/gage117/nutrilyze-server-api.git`
- `cd` into the cloned repository
- Make a fresh start of the git history for this project with `rm -rf .git && git init`
- Install the node dependencies `npm install`
- Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
- This API works with postgres databases, you will need to set up a database to interface with. Name the database `nutrilyze` and the test database `nutrilyze-test`.
- There are migration files included in the /migrations folder that you can use to create the `users` and `ingredients` tables. There is also a seed file you can use in /seeds to seed the database.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Migrate tables: 
- to development database `npm run migrate`
- to test database `npm run migrate:test`
- to production database on Heroku `npm run migrate:production`

Audit packages before deploy `npm run predeploy`

Deploy to heroku `npm run deploy` (automatically runs predeploy)

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
