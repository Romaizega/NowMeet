const express = require('express')
const {getAiMatch, suggestLocation} = require('../controllers/ai_controller')
const authenticateJWT = require('../middleware/auth_middleware')
const {limiterAI} = require('../middleware/rateLimiter')


const router = express.Router()

router.post('/match',limiterAI, authenticateJWT, getAiMatch)
router.post('/suggest-location',limiterAI, authenticateJWT, suggestLocation)

module.exports = router