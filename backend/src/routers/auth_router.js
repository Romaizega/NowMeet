const express = require('express')
const {
  register,
  login,
  getMe,
  sendCode,
  verifyCode,
  forgotPassword,
  resetPassword,
  googleCallback 
} = require('../controllers/auth_controller')
const authenticateJWT = require('../middleware/auth_middleware')
const {limiterAuth} = require('../middleware/rateLimiter')
const passport = require('../utild/passport')

const router = express.Router()

router.post('/register',limiterAuth, register)
router.post('/login',limiterAuth, login)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback)
router.get('/me', authenticateJWT, getMe)
router.post('/send-code', sendCode)
router.post('/verify', verifyCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',resetPassword)

module.exports = router