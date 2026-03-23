const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  content:     { type: String },
  image:       { type: String },
  date:        { type: String },
}, { timestamps: true })

newsSchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('News', newsSchema)
