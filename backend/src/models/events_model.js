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
  city,
  country,
  cover_image
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
      city,
      country,
      cover_image
    })
    .returning('*')
    return event
  }

  const getEventById = (id) => {
    return db('events')
      .join('users', 'events.creator_id', 'users.id')
      .select('events.*', 'users.id as creator_user_id', 'users.username as creator_username', 'users.photo as creator_photo', 'users.about as creator_about')
      .where('events.id', id)
      .first()
  }

  const getAllEvents = async (limit, offset) => {
    const [events, countResult] = await Promise.all([
       db('events')
      .select('*')
      // .where('status', 'open')
      .orderBy('created_at','desc')
      .limit(limit)
      .offset(offset),
      db('events')
      .count('id as total')
      .first()
    ])
    const total = parseInt(countResult.total, 10)
    return {events, total}
  }

  const deleteEvent = (id) => {
    return db('events')
      .where('id', id)
      .del()
  }

  const updateEvent = async (
    event_id,
    title,
    description,
    event_start,
    duration,
    max_participants,
    place_name,
    latitude,
    longitude,
    status,
    city,
    country,
    cover_image
  ) => {
    const updateEvent = {}
    if(title !== undefined)
      updateEvent.title = title
    if(description !== undefined)
      updateEvent.description = description
    if(event_start !== undefined)
      updateEvent.event_start = event_start
    if(duration !== undefined)
      updateEvent.duration = duration
    if(max_participants !== undefined)
      updateEvent.max_participants = max_participants
    if(place_name !== undefined)
      updateEvent.place_name = place_name
    if(latitude !== undefined)
      updateEvent.latitude = latitude
    if(longitude !== undefined)
      updateEvent.longitude = longitude
    if(status !== undefined)
      updateEvent.status = status
    if(city !== undefined)
      updateEvent.city = city
    if(country !== undefined)
      updateEvent.country = country
    if(cover_image !== undefined)
      updateEvent.cover_image = cover_image
    updateEvent.updated_at = db.fn.now()
    
    const [newUpdateEvent] = await db('events')
      .where({id: event_id})
      .update(updateEvent)
      .returning('*')
    return newUpdateEvent  
  }


  const getMyEvents = (creator_id) => {
    return db('events')
    .where('creator_id', creator_id)
    .select('*')
    .orderBy('event_start','desc')
  }

  module.exports = {
    createEvent,
    getEventById,
    getAllEvents,
    deleteEvent,
    updateEvent,
    getMyEvents
  }