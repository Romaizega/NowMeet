const userModel = require('../models/users_model')


const updateProfileUser = async (req, res) => {
  try {
    const user_id = req.user.user_id
    if(!user_id) {
      return res.status(403).json({message: "User is unauthorized"})
    }
    const {
      first_name,
      last_name,
      date_of_birth,
      photo,
      about
    } = req.body || {}

    const minAge = 18

    if(first_name !== undefined && first_name.trim().length < 2){
      return res.status(400).json({message: "First name must be at least 2 characters"})
    }
    if(last_name !== undefined && last_name.trim().length < 2){
      return res.status(400).json({message: "Last name must be at least 2 characters"})
    }
    if(date_of_birth !== undefined && new Date(date_of_birth) > new Date() || new Date().getFullYear() - new Date(date_of_birth).getFullYear() < minAge) {
      return res.status(400).json({message: "Date of birth cannot be in the future and you must be at least 18"})
    }
    if(about !== undefined && about.length < 25) {
      return res.status(400).json({message: "Section about must be at least 25 characters"})
    }
    const updateProfile = await userModel.updateUserprofile(
      user_id,
      first_name,
      last_name,
      date_of_birth,
      photo,
      about)

      return res.status(200).json({message: "Profile user updated", updateProfile})
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message})
  }
}

module.exports = {
  updateProfileUser
}   