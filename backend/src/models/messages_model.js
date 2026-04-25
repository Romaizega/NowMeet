const db = require('../../db/db')

const createMessage = async (event_id, user_id, text) =>{
  const [message] = await db('messages')
  .insert({event_id, user_id, text})
  .returning('*')
  return message
}

const getHistoryMessages = (event_id) =>{
  return db('messages')
  .select('*')
  .where({event_id})
  .orderBy('created_at', 'asc')
}

module.exports = {
  createMessage,
  getHistoryMessages
}