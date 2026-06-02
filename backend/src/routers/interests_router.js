const express = require('express')
const {getAllInterests, addInterestUser, addInterestEvent, getUserInterests} = require('../controllers/interests_controller')
const authenticateJWT = require('../middleware/auth_middleware')

const router = express.Router()

router.get('/all', getAllInterests)
router.post('/user', authenticateJWT, addInterestUser)
router.post('/event/:id', authenticateJWT, addInterestEvent)
router.get('/user/:id', getUserInterests)

module.exports = router