const express = require('express')
const {getAiMatch, suggestLocation} = require('../controllers/ai_controller')
const authenticateJWT = require('../middleware/auth_middleware')


const router = express.Router()

router.post('/match', authenticateJWT, getAiMatch)
router.post('/suggest-location', authenticateJWT, suggestLocation)

module.exports = router