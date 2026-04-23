const db = require('../../db/db')

const createEvent = async(
  creator_id,
  title,
  description,
  event_start,
  duration,
  max_participants,
  place_name,
  latitude,
  longitude,
  status
) => {
    const [event] = await db('events')
    .insert({
      creator_id,
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
      status
    })
    .returning('*')
    return event
  }

  const getEventById = (id) => {
    return db('events')
      .where('id', id)
      .first()
  }

  const getAllEvents = () => {
    return db('events')
    .where('status', 'open')
    .select('*')
    .orderBy('created_at','desc')
  }

  const deleteEvent = (id) => {
    return db('events')
      .where('id', id)
      .del()
  }

  module.exports = {
    createEvent,
    getEventById,
    getAllEvents,
    deleteEvent
  }