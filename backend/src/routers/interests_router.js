const express = require('express')
const {getAllInterests, addInterestUser, addInterestEvent} = require('../controllers/interests_controller')
const authenticateJWT = require('../middleware/auth_middleware')

const router = express.Router()

router.get('/all', getAllInterests)
router.post('/user', authenticateJWT, addInterestUser)
router.post('/event/:id', authenticateJWT, addInterestEvent)

module.exports = router