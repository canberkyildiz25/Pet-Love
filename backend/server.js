require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes    = require('./routes/auth')
const petRoutes     = require('./routes/pets')
const newsRoutes    = require('./routes/news')
const friendRoutes  = require('./routes/friends')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth',    authRoutes)
app.use('/api/pets',    petRoutes)
app.use('/api/news',    newsRoutes)
app.use('/api/friends', friendRoutes)

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
