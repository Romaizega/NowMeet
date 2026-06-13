const db = require('../../db/db')

const sendPrivateMessage = async(sender_user_id, recipient_user_id, text) => {
  const [privateMessage] = await db('private_messages')
  .insert({sender_user_id, recipient_user_id, text})
  .returning('*')
  const fullMessage = await db('private_messages')
  .join('users', 'private_messages.sender_user_id', 'users.id')
  .select('private_messages.id as id', 'private_messages.*', 'users.username', 'users.photo')
  .where('private_messages.id', privateMessage.id)
  .first()
  return fullMessage
}

const getAllMessages = async(user_id_1, user_id_2) => {
  return db('private_messages')
  .join('users', 'private_messages.sender_user_id', 'users.id')
  .select('private_messages.*', 'users.username', 'users.photo')
  .where({sender_user_id: user_id_1, recipient_user_id: user_id_2})
  .orWhere({sender_user_id: user_id_2, recipient_user_id:user_id_1})
  .orderBy('created_at', 'asc')
}

module.exports = {
  sendPrivateMessage,
  getAllMessages
}