const Message = require('../models/messages_model')
const PrivateMessage = require('../models/private_message_model')

const socketHandlers = (io) => {
  io.on('connection', (socket)=> {
    console.log(`User connected: ${socket.user.user_id}`)

    socket.on('joinEvent', (eventId) => {
      socket.join(`event_${eventId}`)
      console.log(`User ${socket.user.user_id} joined event_${eventId}`)
    })

    socket.on('sendMessage', async (data) => {
      const {eventId, text} = data
      try {
        const message = await Message.createMessage(eventId, socket.user.user_id, text)
        io.to(`event_${eventId}`).emit('message', message)
      } catch (error) {
       console.error('Message save failed', error.message)
      }
    })

    socket.on('privateMessage', async(data) => {
      const {recipientId, text} = data
      const roomId = [socket.user.user_id, recipientId].sort().join('_')
      try {
        const privateMessage = await PrivateMessage.sendPrivateMessage(socket.user.user_id, recipientId, text)
        io.to(`private_${roomId}`).emit('private_message',privateMessage)
      } catch (error) {
        console.error('Message send failed', error.message)
      }
    }) 

    socket.on('joinPrivate', (data) => {
    const {recipientId} = data
    const  roomId = [socket.user.user_id, recipientId].sort().join('_')
    socket.join(`private_${roomId}`)
    console.log(`User ${socket.user.user_id} joined private_${roomId}`)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.user_id}`)
    })
  })
}

module.exports = socketHandlers