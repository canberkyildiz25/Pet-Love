require('dotenv').config()
const mongoose = require('mongoose')
const Friend   = require('./models/Friend')

const friends = [
  {
    title:    'LKP "Lion"',
    url:      'https://lkplev.com/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/3.webp',
    address:  '56 Promyslova St., Lviv, Ukraine',
    phone:    '+380685354545',
    email:    'lkplev@gmail.com',
    hours:    '08:00-19:00',
  },
  {
    title:    'Barbos',
    url:      'https://uk-ua.facebook.com/NGO.Barbos/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/5.webp',
    address:  'Grigorenka Street, 25',
    phone:    '+380664880480',
    email:    'barbos@gmail.com',
    hours:    '08:00-20:00',
  },
  {
    title:    'Whiskas',
    url:      'https://www.whiskas.ua/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/8.webp',
    address:  'website only',
    phone:    '0-800-500-155',
    email:    'whiskas@gmail.com',
    hours:    'Day and night',
  },
  {
    title:    'PetHelp',
    url:      'https://pethelp.com.ua/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/4.webp',
    address:  'website only',
    phone:    'email only',
    email:    'pethelp.ukr@gmail.com',
    hours:    'Day and night',
  },
  {
    title:    'Sirius',
    url:      'https://dogcat.com.ua/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/9.webp',
    address:  'Fedorivka, Kyiv Oblast',
    phone:    '+380931934069',
    email:    'dogcat.sirius@gmail.com',
    hours:    '11:00-16:00',
  },
  {
    title:    'Josera',
    url:      'https://www.josera.ua/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/10.webp',
    address:  'Sholom-Aleikhema St, 11',
    phone:    '0800409060',
    email:    'info@josera.ua',
    hours:    '09:00-17:00',
  },
  {
    title:    'Purina',
    url:      'https://www.purina.ua/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/7.webp',
    address:  'website only',
    phone:    '1-800-778-7462',
    email:    'info@ua.nestle.com',
    hours:    'Day and night',
  },
  {
    title:    'Lico',
    url:      'https://lico.vet/',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/6.webp',
    address:  'Fedorivka, Kyiv Oblast',
    phone:    '+380975098005',
    email:    'lico@gmail.com',
    hours:    '09:00-20:00',
  },
  {
    title:    'Happy Paw',
    url:      'https://happypaw.ua/ua',
    imageUrl: 'https://ftp.goit.study/img/petsfriends/2.webp',
    address:  '44 Shota Rustaveli St, Kyiv',
    phone:    '+380442900329',
    email:    'hello@happypaw.ua',
    hours:    '09:00-19:00',
  },
]

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Friend.deleteMany({})
  await Friend.insertMany(friends)
  console.log(`✅ ${friends.length} friends seeded`)
  mongoose.disconnect()
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
