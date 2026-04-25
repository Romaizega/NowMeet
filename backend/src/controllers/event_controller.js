const eventModel = require('../models/events_model')
const userModer = require('../models/users_model')

const createEvent = async (req, res) => {
  const creator_id = req.user.user_id
  const  {
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
  } = req.body

  if(!title || !event_start || !place_name){
    return res.status(400).json({message: "Title, event_start, and place_name are required to fill out"})
  }
  try {
    const event = await eventModel.createEvent(
      creator_id,
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
    )
    return res.status(201).json({message: "Event created", event})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})
  }
}

const getEventById = async (req, res) => {
  try {
    const {id} = req.params
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    return res.status(200).json({message:"Event's details:", event})
  } catch (error) {
    return res.status(500).json({message: "Server error", error:error.message}) 
  }
}

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents()
    return res.status(200).json({message: "Got all events", events}) 
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const deleteEvent = async (req, res) => {
  try {
    const creator_id = req.user.user_id
    const {id} = req.params
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    if(creator_id !== event.creator_id){
      return res.status(403).json({message: "You can only delete your own events"})
    }
    const delEvent = await eventModel.deleteEvent(id)
    return res.status(200).json({message: "The event was deleted successfully", delEvent})
  } catch (error) {
    return res.status(500).json({message: "Server error", error:error.message})
  }
}

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent
}