const express = require('express')

const authenticateJWT = require('../middleware/auth_middleware')
const {updateProfileUser} = require('../controllers/user_controller')

const router = express.Router()

router.put('/profile', authenticateJWT, updateProfileUser)

module.exports = router