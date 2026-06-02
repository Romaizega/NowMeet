const db = require('../../db/db')

const getAllInterests = () => {
  return db('interests')
  .orderBy('name', 'desc')
}

const addInterestToUser = async (user_id, interest_id) => {
  const [addInterestUser] = await db ('user_interests')
  .insert({user_id, interest_id })
  .returning('*')
  return addInterestUser
}

const addInterestToEvent = async(event_id, interest_id) => {
  const [addInterestEvent] = await db('event_interests')
  .insert({event_id, interest_id})
  .returning("*")
  return addInterestEvent
}

const getInterestByUserId = async (user_id) => {
  return db('user_interests')
  .join('interests', 'user_interests.interest_id', '=', 'interests.id')
  .where({user_id})
  .select('interests.id', 'interests.name')
  .orderBy('name', 'desc')
}

const getInterestByEventId = async (event_id) => {
  return db('event_interests')
  .join('interests','event_interests.interest_id', 'interests.id' )
  .where({event_id})
  .orderBy('name', 'desc')
}

module.exports = {
  addInterestToUser,
  addInterestToEvent,
  getAllInterests,
  getInterestByEventId,
  getInterestByUserId
}