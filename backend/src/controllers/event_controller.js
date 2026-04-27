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

const updateEventContr = async (req, res) => {
  try {
    const {id} = req.params
    const creator_id = req.user.user_id
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    if(creator_id !== event.creator_id){
      return res.status(403).json({message: "You can  update only your own events"})
    }
    const {
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
      status
    } = req.body || {}

    const minDurationInmin = 15
    const minMaxParicipant = 1
    if(title !== undefined && title.length < 3){
      return res.status(400).json({message: "Event title must contain at least 3 characters"})
    }
    if(description !== undefined && description.length < 25){
      return res.status(400).json({message: "Description must contain at least 25 characters"})
    }
    if (duration !== undefined && (isNaN(Number(duration)) || Number(duration) < minDurationInmin))
      return res.status(400).json({message: "Duration must be at least 15 minutes"})
    if(max_participants !== undefined && (isNaN(Number(max_participants)) || Number(max_participants) < minMaxParicipant))
      return res.status(400).json({message: "Maximum participants must be a positive number"})
    if(place_name !== undefined && place_name.length < 3)
      return res.status(400).json({message: "Place name must be at least 3 characters"})
    if(latitude !== undefined && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90))
      return res.status(400).json({message: "Latitude must be a number between -90 and 90"})
    if(longitude !== undefined && (isNaN(Number(longitude)) || Number(longitude) <-180 || Number(longitude) > 180))
      return res.status(400).json({message: "Longitude must be a number between -180 and 180"})
    if (status !== undefined && status !== 'open' && status !== 'closed')
      return res.status(400).json({message: "Status must be open or closed"})

    const editEvent = await eventModel.updateEvent(
      id,      
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
      status
    )
    return res.status(200).json({message: "Event was update", editEvent})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})    
  }
}

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent,
  updateEventContr
}