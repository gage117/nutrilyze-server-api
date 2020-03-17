const IngredientsService = {
  getAllIngredients(db) {
    return db
      .select('*')
      .from('ingredients');
  },
  insertIngredient(db, newIngredient) {
    return db
      .insert(newIngredient)
      .into('ingredients')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('ingredients')
      .where('id', id)
      .first();
  },
  deleteIngredient(db, id) {
    return db('ingredients')
      .where({ id })
      .delete();
  },
  updateIngredient(db, id, newIngredientFields) {
    return db('ingredients')
      .where({ id })
      .update(newIngredientFields);
  }
};

module.exports = IngredientsService;