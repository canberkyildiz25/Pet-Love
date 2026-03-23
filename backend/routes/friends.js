const express = require('express')
const Friend  = require('../models/Friend')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const friends = await Friend.find()
    res.json(friends)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
