const express = require('express')
const {getAllInterests, addInterestUser, addInterestEvent, getUserInterests, deleteInterestByUserId} = require('../controllers/interests_controller')
const authenticateJWT = require('../middleware/auth_middleware')

const router = express.Router()

router.get('/all', getAllInterests)
router.post('/user', authenticateJWT, addInterestUser)
router.post('/event/:id', authenticateJWT, addInterestEvent)
router.get('/user/:id', getUserInterests)
router.delete('/user/', authenticateJWT, deleteInterestByUserId)

module.exports = router