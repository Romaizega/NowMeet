const db = require('../db/db')

const getUserByUsername = (username) => {
  return db('users').where({username}).first() 
};

const getUserByEmail = (email) => {
  return db('users').where({email}).first()
};

const createUser = async(username, email, password_hash, role) => {
  const [user] = await db('users')
    .insert({username, email, password_hash, role})
    .returning('*')
  return user
}

module.exports = {
  getUserByUsername,
  getUserByEmail,
  createUser
}