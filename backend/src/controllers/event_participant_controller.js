const eventModel = require('../models/events_model')
const userModer = require('../models/users_model')
const eventParticipant = require ('../models/event_participants_model')


const joinEvent = async (req, res) => {
  try {
    const {id} = req.params
    const user_id = req.user.user_id
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    if(event.creator_id == user_id){
      return res.status(400).json({message: "You cannot join your own event"})
    }
    const existing = await eventParticipant.getParticipant(id, user_id)
    if(existing) {
      return res.status(400).json({message: "User already joined"})
    }
    const result = await eventParticipant.countParticipant(id)
    const count = parseInt(result.count)
    if(count >= event.max_participants){
      return res.status(400).json({message: "There is no available room"})
    }
    const addParticipant = await eventParticipant.addParticipant(id, user_id)
    const participants = await eventParticipant.getEventParticipants(id)
    return res.status(200).json({message: "You was joined to the event", participants})
  } catch (error) {
    return res.status(500).json({message: "Server error", error:error.message})
  }
}

const cancelEvent = async (req, res) => {
  try {
    const {id} = req.params
    const user_id = req.user.user_id
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    if(event.creator_id == user_id){
      return res.status(400).json({message: "You cannot join your own event"})
    }
    const existing = await eventParticipant.getParticipant(id, user_id)
    if(!existing) {
      return res.status(400).json({message: "User did not join"})
    }
    const cancelResult = await eventParticipant.cancelEvent(id, user_id)
    const participants = await eventParticipant.getEventParticipants(id)
    return res.status(200).json({message: "You was cancled event", participants})
  } catch (error) {
    return res.status(500).json({message: "Server error", error:error.message})
  }
}

module.exports = {
  joinEvent,
  cancelEvent
}
