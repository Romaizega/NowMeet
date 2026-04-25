const interestsModel = require('../models/interests_model')

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

module.exports = {
  getAllInterests,
  addInterestUser
}