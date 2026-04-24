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

module.exports = {
  getParticipant,
  countParticipant,
  addParticipant
}