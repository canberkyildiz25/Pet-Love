require('dotenv').config()
const https    = require('https')
const mongoose = require('mongoose')
const Pet      = require('./models/Pet')

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve(JSON.parse(d)))
    }).on('error', reject)
  })
}

function formatDate(str) {
  if (!str) return '01.01.2026'
  const d = new Date(str)
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const data = await fetch('https://petlove.b.goit.study/api/notices?page=1&limit=52')
  const pets = data.results.map(r => ({
    name:        r.title,
    birthday:    formatDate(r.birthday),
    sex:         r.sex === 'male' ? 'Male' : r.sex === 'female' ? 'Female' : 'Unknown',
    species:     r.species ? r.species.charAt(0).toUpperCase() + r.species.slice(1) : 'Other',
    category:    ['sell','lost','found','free'].includes(r.category) ? r.category : 'free',
    location:    'Ukraine',
    description: r.comment || '',
    image:       r.imgURL  || '',
    rating:      Math.min(Math.ceil((r.popularity || 1) / 1000), 12) || 1,
    isPopular:   (r.popularity || 0) > 3000,
  }))

  await Pet.deleteMany({})
  await Pet.insertMany(pets)
  console.log(`✅ ${pets.length} pets seeded from external API`)
  mongoose.disconnect()
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
