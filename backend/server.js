const express = require('express')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.get('/', (req,  res) =>{
  res.send({message: "Server test running"})
})

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})
