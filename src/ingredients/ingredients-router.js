const express = require('express');
const ingredientsService = require('./ingredients-service');
const xss = require('xss')

const ingredientsRouter = express.Router();
const jsonBodyParser = express.json();

ingredientsRouter
  .route('/')
  .get((req, res, next) => {
    ingredientsService.getAllIngredients(req.app.get('db'))
      .then(ingredients => {
        for (const ingredient of ingredients) {
          ingredient.name = xss(ingredient.name);
        }
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