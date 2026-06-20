const eventModel = require('../models/events_model')
const userModer = require('../models/users_model')
const eventParticipantsModel = require('../models/event_participants_model')

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
      city,
      country,
  } = req.body

  if(!title || !event_start || !place_name || !city){
    return res.status(400).json({message: "Title, event_start, place_name, and city are required to fill out"})
  }
  try {
    const minDurationInmin = 15
    const minMaxParicipant = 1
    const image_cover = req.file ? req.file.filename : undefined
    if(title !== undefined && title.length < 3){
      return res.status(400).json({message: "Event title must contain at least 3 characters"})
    }
    if(description !== undefined && description.length < 25){
      return res.status(400).json({message: "Description must contain at least 25 characters"})
    }
    if (new Date(event_start) < new Date()) {
      return res.status(400).json({message: "Event start date cannot be in the past"})
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
    if(city !== undefined  && city.length < 3) {
      return res.status(400).json({message: "City must contain at least 3 characters"})}
    if(country !== undefined && country.length < 3 ){
      return res.status(400).json({message: "Country must contain at least 3 characters"})}
    

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
      city,
      country,
      image_cover
    )
    const io = req.app.get('io')
    console.log('Emitting new_event', event)

    io.emit('new_event', event)
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
    const participants = await eventParticipantsModel.getEventParticipants(id)
    return res.status(200).json({message:"Event's details:", event, participants})
  } catch (error) {
    return res.status(500).json({message: "Server error", error:error.message}) 
  }
}

const getMyEvents =async (req, res) => {
  try {
    const creator_id = req.user.user_id
    const myEvents = await eventModel.getMyEvents(creator_id)
    if(!myEvents || myEvents.length === 0) {
      return res.status(404).json({message: "You haven't created any events yet"})
    }
    return res.status(200).json({message:"Your all events details:", myEvents})
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
      status,
      city,
      country,
      
    } = req.body || {}

    const minDurationInmin = 15
    const minMaxParicipant = 1
    const image_cover = req.file ? req.file.filename : undefined

    if(title !== undefined && title.length < 3){
      return res.status(400).json({message: "Event title must contain at least 3 characters"})
    }
    if(description !== undefined && description.length < 25){
      return res.status(400).json({message: "Description must contain at least 25 characters"})
    }
    if (event_start !== undefined && new Date(event_start) < new Date()) {
      return res.status(400).json({message: "Event start date cannot be in the past"})
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
   if (status !== undefined && !['open', 'closed', 'cancelled', 'expired'].includes(status))
      return res.status(400).json({message: "Invalid status value"})
    if(city !== undefined  && city.length < 3) {
      return res.status(400).json({message: "City must contain at least 3 characters"})}
    if(country !== undefined && country.length < 3 ){
      return res.status(400).json({message: "Country must contain at least 3 characters"})}

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
      status,
      city,
      country,
      image_cover
    )
    return res.status(200).json({message: "Event was update", editEvent})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})    
  }
}

const getGeoLocation = async (req, res) => {
  try {
    const {latitude, longitude} = req.body
    // console.log('lat, lng received:', latitude, longitude)
    
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY_BACKEND}`);
      // console.log('Google response status:', googleResponse.status)
    const googleData = await googleResponse.json();
    // console.log('Google data:', googleData)
    const googleResult = googleData.results[0]?.address_components
    const cityGoogle = googleResult.find((item) => {
      return item.types.includes('locality')
    })
    const city = cityGoogle?.long_name || "Unknown city"
    const countryGoogle = googleResult.find((item) => {
      return item.types.includes('country')
    })
    const country = countryGoogle?.long_name || "Unknown country"
    return res.status(200).json({message: "Country and city were recieved", city, country})

    } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})    
  }
}

const getGeoHeader = async (req, res) => {
  try {
    const {latitude, longitude} = req.body
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY_BACKEND}`);
    const googleData = await googleResponse.json();
    const cityGoogle = googleResult.find((item) => {
      return item.types.includes('locality')
    })
    const city = cityGoogle?.long_name || "y"
    const countryGoogle = googleResult.find((item) => {
      return item.types.includes('country')
    })
    const counrty = countryGoogle?.long_name || ""
    const navbarLocation = city && country ? `${city}, ${country}` : city || country || "Unknown location"
    return res.status(200).json({message: "Get location for navbar", navbarLocation})
  
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})    
  }
}
 
module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent,
  updateEventContr,
  getMyEvents,
  getGeoLocation,
  getGeoHeader

}