const express = require('express');
const userService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
  .route('/:user_name')
  .get((req, res, next) => {
    const {user_name} = req.params;
    userService.getUserWithUserName(req.app.get('db'), user_name)
      .then(user => {
        delete user.password;
        res.json(user);
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const updatedUser = {...req.body};
    const {id} = updatedUser;
    ['id', 'name', 'user_name'].forEach(field => delete updatedUser[field]);
    userService.updateUser(req.app.get('db'), id, updatedUser)
      .then(user => res.status(200).json(user))
      .catch(next);
    
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newUser = {...req.body};
    userService.insertUser(req.app.get('db'), newUser)
      .then(user => res.status(201).json(user))
      .catch(next);
  });

module.exports = userRouter;