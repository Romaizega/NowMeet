const express = require('express')
const {
  register,
  login,
  getMe,
  sendCode,
  verifyCode
} = require('../controllers/auth_controller')
const authenticateJWT = require('../middleware/auth_middleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateJWT, getMe)
router.post('/send-code', authenticateJWT, sendCode)
router.post('/verify', authenticateJWT, verifyCode)

module.exports = router