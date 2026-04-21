require('dotenv').config()
const express = require('express')
const db = require('../backend/db/db')

const app = express()
const PORT = process.env.PORT || 5000

app.get('/', (req,  res) =>{
  res.send({message: "Server test running"})
})

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})


// Test db connection
app.get('/db-test', async (req, res) =>{
  try {
    const {rows} = await db.raw('SELECT NOW()');
    res.status(200).json({message: "DB is working", time_db: rows[0].now})
  } catch (error) {
    console.error('DB Error:', err.message);
    res.status(500).json({ ok: false, error: 'Database connection failed' });
  }
})