const connectToMongo = require('./db');
const express = require('express')
const dotenv = require('dotenv').config();
var cors = require('cors') 

connectToMongo();
const app = express()

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(process.env.PORT, () => {
  console.log(`iNoteBook backend listening at http://localhost:${process.env.PORT}`)
})