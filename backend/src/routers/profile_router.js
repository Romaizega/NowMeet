const express = require('express')

const authenticateJWT = require('../middleware/auth_middleware')
const {
  updateProfileUser,
  updateUsername,
  updateEmail
} = require('../controllers/user_controller')

const router = express.Router()

router.put('/profile', authenticateJWT, updateProfileUser)
router.put('/username', authenticateJWT, updateUsername)
router.put('/email', authenticateJWT, updateEmail)

module.exports = router