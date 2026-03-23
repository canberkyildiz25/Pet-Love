const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  url:      { type: String },
  imageUrl: { type: String },
  address:  { type: String },
  phone:    { type: String },
  email:    { type: String },
  hours:    { type: String }, // "08:00-19:00" or "Day and night"
})

module.exports = mongoose.model('Friend', friendSchema)
