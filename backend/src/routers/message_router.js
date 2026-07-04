const express = require('express')
const {getInbox} = require("../controllers/message_controller")
const authenticateJWT = require('../middleware/auth_middleware')

const router = express.Router()

router.get('/inbox',authenticateJWT, getInbox)


module.exports = router