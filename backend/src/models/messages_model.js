const db = require('../../db/db')

const createMessage = async (event_id, user_id, text) =>{
  const [message] = await db('messages')
  .insert({event_id, user_id, text})
  .returning('*')
  return db('messages')
  .join('users', 'messages.user_id', 'users.id')
  .select('messages.*', 'users.username', 'users.photo')
  .where('messages.id', message.id)
  .first()
}

const getHistoryMessages = (event_id) =>{
  return db('messages')
  .join('users', 'messages.user_id', 'users.id')
  .select('messages.*', 'users.username', 'users.photo')
  .where({event_id})
  .orderBy('created_at', 'asc')
}

module.exports = {
  createMessage,
  getHistoryMessages
}