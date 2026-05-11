require('dotenv').config()
const express = require('express')
const db = require('../backend/db/db')
const authRouter = require('../backend/src/routers/auth_router')
const eventRouter = require('../backend/src/routers/event_router')
const interestRouter = require('../backend/src/routers/interests_router')
const profileRouter = require('../backend/src/routers/profile_router')
const {Server} = require('socket.io')
const http = require('http')
const cors = require('cors')
const socketAuth = require('../backend/src/socket/socketAuth')
const socketHandlers = require('../backend/src/socket/socketHandlers')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 5000

app.get('/', (req,  res) =>{
  res.send({message: "Server test running"})
})
io.use(socketAuth)
socketHandlers(io)
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)
app.use('/api/interests', interestRouter)
app.use('/api/profiles', profileRouter)


// Test db connection
app.get('/db-test', async (req, res) =>{
  try {
    const {rows} = await db.raw('SELECT NOW()');
    res.status(200).json({message: "DB is working", time_db: rows[0].now})
  } catch (error) {
    console.error('DB Error:', error.message);
    res.status(500).json({ ok: false, error: 'Database connection failed' });
  }
})

server.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})