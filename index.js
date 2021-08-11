const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config()

// Create the express server
const app = express()

// DB connection
dbConnection()

// CORS 
app.use(cors())

// public directory
app.use( express.static('public') )

// read and parse the body
app.use( express.json() )

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.listen( process.env.PORT, () => {
   console.log(`Server on port ${process.env.PORT}`)
})