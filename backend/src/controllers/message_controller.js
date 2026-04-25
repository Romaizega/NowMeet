const eventModel = require('../models/events_model')
const messageModel = require('../models/messages_model')
const eventParticipantModel = require('../models/event_participants_model')

const sendMessage = async (req, res) => {
  const {text} = req.body 
  if(!text) {
    return res.status(400).json({message: "A message not could be empty"})
  }
  try {
    const {id} = req.params
    const user_id = req.user.user_id
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    const existing = await eventParticipantModel.getParticipant(id, user_id)
    if(!existing && event.creator_id !== user_id ) {
      return res.status(400).json({message: "User is not a participant of the event"})
    }
    const message = await messageModel.createMessage(id, user_id, text)
    return res.status(201).json({message: "Message created "})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})
  }
}

const getMessage =  async (req, res) => {
  try {
    const {id} = req.params
    const user_id = req.user.user_id
    const event = await eventModel.getEventById(id)
    if(!event) {
      return res.status(404).json({message: "The event not found"})
    }
    const existing = await eventParticipantModel.getParticipant(id, user_id)
    if(!existing && event.creator_id !== user_id ) {
      return res.status(400).json({message: "User is not a participant of the event"})
    }
    const messagesUser = await messageModel.getHistoryMessages(id)
    return res.status(200).json({message: "You got a message", messagesUser})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})
  }
}


module.exports = {
  sendMessage,
  getMessage
}