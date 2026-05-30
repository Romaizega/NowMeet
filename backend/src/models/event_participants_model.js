const db = require('../../db/db')

const getParticipant = async (event_id, user_id) => {
  return db ('event_participants')
  .where({event_id, user_id}).first()
}

const countParticipant = async(event_id) => {
  return db ('event_participants')
  .where({event_id}).count('id as count').first()
}

const addParticipant = async (event_id, user_id) => {
  return db ('event_participants')
  .insert({event_id, user_id})
  .returning('*')
}

const getEventParticipants = async (event_id) => {
  return db('event_participants')
  .join('users', 'event_participants.user_id', 'users.id')
  .select('users.id','username', 'first_name', 'last_name', 'date_of_birth', 'photo', 'about')
  .where({event_id})
  .orderBy('username', 'asc')
}

const cancelEvent = async(event_id, user_id) => {
  return db('event_participants')
  .where({event_id, user_id})
  .del()
}


module.exports = {
  getParticipant,
  countParticipant,
  addParticipant,
  getEventParticipants,
  cancelEvent
}