const UserService = {
  getAllUsers(db) {
    return db
      .select('*')
      .from('users');
  },
  getUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('users')
      .where('id', id)
      .first();
  },
  deleteUser(db, id) {
    return db('users')
      .where({ id })
      .delete();
  },
  updateUser(db, id, newUserFields) {
    return db('users')
      .where({ id })
      .update(newUserFields);
  }
};

module.exports = UserService;