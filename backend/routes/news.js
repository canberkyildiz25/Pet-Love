const express = require('express')
const News = require('../models/News')

const router = express.Router()
const PAGE_SIZE = 6

// GET /api/news?search=&page=1
router.get('/', async (req, res) => {
  try {
    const { search, page = 1 } = req.query
    const filter = {}
    if (search) filter.$text = { $search: search }

    const total = await News.countDocuments(filter)
    const news  = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)

    res.json({ news, total, pages: Math.ceil(total / PAGE_SIZE), page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
