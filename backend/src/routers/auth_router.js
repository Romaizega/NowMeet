const express = require('express')
const {
  register,
  login,
  getMe,
  sendCode,
  verifyCode,
  forgotPassword,
  resetPassword
} = require('../controllers/auth_controller')
const authenticateJWT = require('../middleware/auth_middleware')
const {limiterAuth} = require('../middleware/rateLimiter')

const router = express.Router()

router.post('/register',limiterAuth, register)
router.post('/login',limiterAuth, login)
router.get('/me', authenticateJWT, getMe)
router.post('/send-code', sendCode)
router.post('/verify', verifyCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',resetPassword)

module.exports = router