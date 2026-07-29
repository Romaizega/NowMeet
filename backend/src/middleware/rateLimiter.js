const rateLimit = require("express-rate-limit")

const limiterCommon = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many request from this IP, please try again later'
})

const limiterAuth = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again later',
})

const limiterAI = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'AI request limit exceeded. Please try again later' 
})

module.exports = { 
  limiterCommon,
  limiterAuth,
  limiterAI
}