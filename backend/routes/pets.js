const express = require('express')
const Pet = require('../models/Pet')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const PAGE_SIZE = 6

// GET /api/pets?search=&category=&sex=&species=&location=&tag=&page=1
router.get('/', async (req, res) => {
  try {
    const { search, category, sex, species, location, tag, page = 1 } = req.query
    const filter = {}

    if (search)   filter.$text = { $search: search }
    if (category && category !== 'all') filter.category = category
    if (sex      && sex      !== 'all') filter.sex      = sex
    if (species  && species  !== 'all') filter.species  = species
    if (location) filter.location = { $regex: location, $options: 'i' }

    if (tag === 'popular')   filter.isPopular = true
    if (tag === 'unpopular') filter.isPopular = false

    const total = await Pet.countDocuments(filter)
    const pets  = await Pet.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)

    res.json({ pets, total, pages: Math.ceil(total / PAGE_SIZE), page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/pets/:id
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    if (!pet) return res.status(404).json({ message: 'Pet not found' })
    res.json(pet)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/pets  (korumalı)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, name, birthday, species, sex, image, category, location, description } = req.body
    if (!title || !name || !species) {
      return res.status(400).json({ message: 'Title, name and species are required' })
    }
    const pet = await Pet.create({
      name: title,
      birthday,
      sex:      sex      || 'Unknown',
      species,
      category: category || 'free',
      location: location || '',
      description: description || '',
      image:    image    || '',
      rating:   1,
      isPopular: false,
    })
    res.status(201).json(pet)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
