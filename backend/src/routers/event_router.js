const express = require('express')
const {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent
  
} = require('../controllers/event_controller')
const {joinEvent} = require('../controllers/event_participant_controller')
const { sendMessage, getMessage } = require('../controllers/message_controller')
const authenticateJWT = require('../middleware/auth_middleware')


const router = express.Router()

router.post('/create', authenticateJWT, createEvent)
router.get('/events', getAllEvents)
router.get('/:id', getEventById)
router.delete('/:id', authenticateJWT, deleteEvent)
router.post('/:id/join', authenticateJWT, joinEvent)
router.post('/:id/messages', authenticateJWT, sendMessage)
router.get('/:id/messages', authenticateJWT, getMessage)

module.exports = router