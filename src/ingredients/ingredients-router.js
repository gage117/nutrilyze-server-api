const express = require('express');
const ingredientsService = require('./ingredients-service');

const ingredientsRouter = express.Router();
const jsonBodyParser = express.json();

ingredientsRouter
  .route('/')
  .get((req, res, next) => {
    ingredientsService.getAllIngredients(req.app.get('db'))
      .then(ingredients => {
        res.json(ingredients);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newIngredient = {...req.body};

    for (const [key, value] of Object.entries(newIngredient))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    res.send(newIngredient)
  });

module.exports = ingredientsRouter;