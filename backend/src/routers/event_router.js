const express = require('express')
const {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent
  
} = require('../controllers/event_controller')
const authenticateJWT = require('../middleware/auth_middleware')


const router = express.Router()

router.post('/create', authenticateJWT, createEvent)
router.get('/events', getAllEvents)
router.get('/:id', getEventById)
router.delete('/:id', authenticateJWT, deleteEvent)

module.exports = router