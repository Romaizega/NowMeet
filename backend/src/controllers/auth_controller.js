const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/users_model')

const register = async(req, res) => {
  const {username, email, password} = req.body

  if(!username || !email || !password) {
    return res.status(400).json({message: "All fields are required to fill out"})
  }

  if(username.length < 3) {
    return res.status(400).json({message: "Usename must be at least 3 characters long"})
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!emailRegex.test(email)) {
    return res.status(400).json({message: "Invalid email format"})
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
  if(!strongPassword.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include at least one capital letter and one number"
    })
  }
  try {
    if(await userModel.getUserByUsername(username)){
      return res.status(400).json({message: "Username already exists"})
    }

    if(await userModel.getUserByEmail(email)){
      return res.status(400).json({message: "Email already exists"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.createUser(username, email, hashPassword)

    res.status(201).json({message:"New user created successfully",
      user: {id: newUser.id, username: newUser.username, email: newUser.email}
    })
  } catch (error) {
    return res.status(500).json({message:"Server error", error: error.message})
  }
}

module.exports = {
  register
}