const interestsModel = require('../models/interests_model')
const eventModel = require('../models/events_model')

const getAllInterests = async (req, res) => {
  try {
    const interests = await interestsModel.getAllInterests()
    return res.status(200).json({message: "All interests", interests})
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const addInterestUser = async (req, res) => {
  const user_id = req.user.user_id
  const {interest_id} = req.body

  if(!interest_id){
    return res.status(400).json({message: "Interest not selected"})
  }
  try {
    const addInterestUser = await interestsModel.addInterestToUser(user_id, interest_id)
    return res.status(201).json({message: "Interest added", addInterestUser})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})
  }
}

const addInterestEvent = async (req, res) => {
  const {interest_id} = req.body
  const creator_id = req.user.user_id
  const {id} = req.params
  if(!interest_id){
    return res.status(400).json({message: "Interest not selected"})
  }
  try {
    const event = await eventModel.getEventById(id)
    if(!event){
      return res.status(404).json({message: "The event not found"})
    }
    if(creator_id !== event.creator_id){
      return res.status(403).json({message: "You can add interest only for your own events"})
    }
    const addInterestEvent = await interestsModel.addInterestToEvent(id, interest_id)
    return res.status(201).json({message: "Interest added"})
  } catch (error) {
     return res.status(500).json({message: "Server error", error: error.message})    
  }
}

module.exports = {
  getAllInterests,
  addInterestUser,
  addInterestEvent
}