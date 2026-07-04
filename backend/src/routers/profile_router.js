const express = require('express')
const upload = require('../middleware/upload')

const authenticateJWT = require('../middleware/auth_middleware')
const {
  updateProfileUser,
  updateUsername,
  updateEmail,
  updatePassword,
  viewProfile
  
} = require('../controllers/user_controller')

const { getPrivateMessage} = require('../controllers/message_controller')

const router = express.Router()

router.put('/profile', authenticateJWT, upload.single("photo"), updateProfileUser)
router.put('/username', authenticateJWT, updateUsername)
router.put('/email', authenticateJWT, updateEmail)
router.put('/password', authenticateJWT, updatePassword)
router.get('/:id/private-chat', authenticateJWT, getPrivateMessage)
router.get('/:id', viewProfile)

module.exports = router