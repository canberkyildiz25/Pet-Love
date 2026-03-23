const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  birthday:    { type: String },
  sex:         { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
  species:     { type: String },          // Dog, Cat, Fish, Turtle …
  category:    { type: String, enum: ['sell', 'lost', 'found', 'free'], default: 'free' },
  location:    { type: String },
  description: { type: String },
  image:       { type: String },
  rating:      { type: Number, default: 1 },
  isPopular:   { type: Boolean, default: false },
}, { timestamps: true })

// text search index
petSchema.index({ name: 'text', description: 'text', location: 'text' })

module.exports = mongoose.model('Pet', petSchema)
