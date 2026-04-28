const express = require('express')

const authenticateJWT = require('../middleware/auth_middleware')
const {
  updateProfileUser,
  updateUsername
} = require('../controllers/user_controller')

const router = express.Router()

router.put('/profile', authenticateJWT, updateProfileUser)
router.put('/username', authenticateJWT, updateUsername)

module.exports = router