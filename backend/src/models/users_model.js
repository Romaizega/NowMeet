const db = require('../../db/db')

const getUserByUsername = (username) => {
  return db('users').where({username}).first() 
};

const getUserByEmail = (email) => {
  return db('users').where({email}).first()
};

const getUserById = (id) => {
  return db('users').where({id}).first()
}

const createUser = async(username, email, password_hash) => {
  const [user] = await db('users')
    .insert({username, email, password_hash})
    .returning('*')
  return user
}

const updateUserprofile = async (
  user_id,
  first_name,
  last_name,
  date_of_birth,
  photo,
  about
) => {
  const updateProfile = {}
  
  if(first_name !== undefined)
    updateProfile.first_name = first_name
  if(last_name !== undefined)
    updateProfile.last_name =last_name
  if(date_of_birth !== undefined)
    updateProfile.date_of_birth = date_of_birth
  if(photo !== undefined)
    updateProfile.photo = photo
  if(about !== undefined)
    updateProfile.about = about
  
  updateProfile.updated_at = db.fn.now()
  
  const [newProfile] = await db('users')
    .where({id: user_id})
    .update(updateProfile)
    .returning('*')
  return newProfile
}

const updateUsername = async (user_id, newUsername) =>{
  return db('users')
    .where({id:user_id})
    .update({username: newUsername})
    .returning(['username'])
}

const updateEmail = async (user_id, newEmail) => {
  return db('users')
    .where({id: user_id})
    .update({email: newEmail})
    .returning(['email'])
}

const updatePassword = async (user_id, newPassword_hash) => {
  return db('users')
    .where({id: user_id})
    .update({password_hash: newPassword_hash})
}

const generateCode =  (user_id, code, expiresAt) => {
  return db('users')
    .where({id: user_id})
    .update({verification_code: code, code_expires_at: expiresAt})
}

const clearCode = (user_id) => {
  return db('users')
    .where({id: user_id})
    .update({
      is_verified: true,
      verification_code: null,
      code_expires_at: null
    })
}

const viewProfile = (id) => {
  return db('users')
  .where({id})
  .select('username', 'first_name', 'last_name', 'date_of_birth', 'photo', 'about', 'created_at')
  .first()
}

module.exports = {
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUserprofile,
  updateUsername,
  updateEmail,
  updatePassword,
  getUserById,
  generateCode,
  clearCode,
  viewProfile
}