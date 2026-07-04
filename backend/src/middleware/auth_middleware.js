const jwt = require('jsonwebtoken')

const authenticateJWT = async (req, res, next) => {
  try {
    const headerJWT = req.headers['authorization']
    if(!headerJWT || !headerJWT.startsWith('Bearer')){
      return res.status(401).json({message: "Unauthorized"})
    }
    const token = headerJWT.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    
    req.user = {
      ...payload
    }
    next()
  } catch (error) {
    return res.status(403).json({message: "Invalid or expired access token"})
  }
}

module.exports = authenticateJWT