const express = require('express')
const {upload, uploadSingle} = require('../middleware/upload')

const authenticateJWT = require('../middleware/auth_middleware')
const {
  updateProfileUser,
  updateUsername,
  updateEmail,
  updatePassword,
  viewProfile,
  viewAllProfiles
  
} = require('../controllers/user_controller')

const {getUserEvents} = require('../controllers/event_controller')

const { getPrivateMessage} = require('../controllers/message_controller')

const router = express.Router()

router.put('/profile', authenticateJWT, uploadSingle, updateProfileUser)
router.put('/username', authenticateJWT, updateUsername)
router.put('/email', authenticateJWT, updateEmail)
router.put('/password', authenticateJWT, updatePassword)
router.get('/:id/user-events', authenticateJWT, getUserEvents)
router.get('/:id/private-chat', authenticateJWT, getPrivateMessage)
router.get('/all-profiles', viewAllProfiles)
router.get('/:id', viewProfile)


module.exports = router