const db = require('../../db/db')

const getUserByUsername = (username) => {
  return db('users').where({username}).first() 
};

const getUserByEmail = (email) => {
  return db('users').where({email}).first()
};

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


module.exports = {
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUserprofile,
  updateUsername,
  updateEmail
}