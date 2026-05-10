const jwt = require('jsonwebtoken')

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token

  if(!token){
    return next (new Error('Unauthorized'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
  } catch (error) {
    next(new Error("Invalid token"))
    
  }
}

module.exports = socketAuth