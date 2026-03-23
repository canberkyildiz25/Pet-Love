require('dotenv').config()
const mongoose = require('mongoose')
const News = require('./models/News')

const news = [
  {
    title: "Men's Wear Puts on the Dog",
    description: "A pavilion dedicated to the multibillion-dollar market in pet apparel makes its debut at the world's largest men's wear trade show.",
    image: "https://www.nytimes.com/images/2023/01/12/fashion/11pitti-pet10-flhz/11pitti-pet10-flhz-blog480.jpg",
    date: "12.01.2026",
  },
  {
    title: "New York Bans Pet Stores From Selling Dogs, Cats and Rabbits",
    description: "The ban, which takes effect in December 2024, is meant to prevent the sale of animals raised by commercial breeders accused of keeping them in inhumane conditions.",
    image: "https://www.nytimes.com/images/2022/12/15/multimedia/15ny-petstore-1-a63a/15ny-petstore-1-a63a-blog480.jpg",
    date: "15.01.2026",
  },
  {
    title: "For Ukraine's Animals, a Home Is Getting Harder to Find",
    description: "Early in the war, thousands of pets were ferried out of danger, mostly to other European countries. But now adoptions are waning.",
    image: "https://www.nytimes.com/images/2023/02/23/multimedia/00ukraine-shelter-02-jgvt/00ukraine-shelter-02-jgvt-blog480.jpg",
    date: "28.01.2026",
  },
  {
    title: "Nausea, Wobbling, Confusion: Dogs Are Getting Sick From Discarded Weed",
    description: "In places where recreational use is legal, dogs are getting sick from eating the remains of joints and other cannabis products, veterinarians and poison-control centers say.",
    image: "https://www.nytimes.com/images/2023/02/04/multimedia/00xp-high-dogs-01-pmgh/00xp-high-dogs-01-pmgh-blog480.jpg",
    date: "05.02.2026",
  },
  {
    title: "Our Relatives Keep Bringing Their Dog Over. How Can We Stop Them?",
    description: "The magazine's Ethicist columnist on how to tell loved ones that you don't love their pet. My brother-in-law and his wife adopted a dog a year ago.",
    image: "https://www.nytimes.com/images/2023/03/12/magazine/12mag-ethicist-online/12mag-ethicist-online-blog480.jpg",
    date: "10.02.2026",
  },
  {
    title: "The Days of Doggies in the Window Are Numbered",
    description: "New York State is banning pet shops from selling dogs, cats and rabbits, starting in 2024, in an effort to crack down on puppy mills.",
    image: "https://www.nytimes.com/images/2022/12/16/multimedia/16nytoday-pet-store-1-e7c8/16nytoday-pet-store-1-e7c8-blog480.jpg",
    date: "15.02.2026",
  },
  {
    title: "Pets Have Put On Pandemic Weight, Too",
    description: "Humans weren't the only ones who gained weight during lockdown. Veterinarians are seeing more overweight pets than ever before.",
    image: "https://www.nytimes.com/images/2022/03/06/us/politics/06dc-burst-pets-Henry-3/06dc-burst-pets-Henry-3-blog480-v3.jpg",
    date: "20.02.2026",
  },
  {
    title: "Pope Scolds Couples Who Choose Pets Over Kids",
    description: "Expressing concern about global birthrates, Francis said such couples were acting in a selfish way that diminished humanity.",
    image: "https://www.nytimes.com/images/2022/01/06/world/Pope-Pets01/merlin_199982115_59be34ce-b6f7-4950-b4a0-16d25048aa5f-blog480.jpg",
    date: "25.02.2026",
  },
  {
    title: "Ukrainian Refugees Find Shelter, and a Hearty Welcome for Their Pets",
    description: "Viktor and Rachel Borovic had only two hours to prepare to flee their city. But they were clear about what was important to them — their pets.",
    image: "https://www.nytimes.com/images/2022/04/12/world/12ukraine-blog-veterinarian/merlin_203762100_fe5248ef-595f-42bc-9151-457f2b2ed50c-blog480.jpg",
    date: "01.03.2026",
  },
  {
    title: "How One Ukrainian Company Survived, and Thrived, Through a Year of War",
    description: "For Kormotech and its 1,300 employees, Russia's invasion disrupted everything. After nimble decision-making and good fortune, sales are up.",
    image: "https://www.nytimes.com/images/2023/02/21/multimedia/00ukraine-business-01-mjgv/00ukraine-business-01-mjgv-blog480.jpg",
    date: "05.03.2026",
  },
  {
    title: "The South End of Stamford: Master-Planned With Luxury Rentals, and Lots of Pets",
    description: "The neighborhood, a 322-acre peninsula on Long Island Sound, has been redeveloped with 4,000 new apartments. And there are more to come.",
    image: "https://www.nytimes.com/images/2022/01/12/realestate/12LIVING-STAMFORDCT-slide-RYJ7/12LIVING-STAMFORDCT-slide-RYJ7-blog480.jpg",
    date: "10.03.2026",
  },
  {
    title: "'DC League of Super-Pets' Review: #ReleaseTheLassieCut",
    description: "Dwayne Johnson and Kevin Hart voice canine heroes in a family-friendly animated spinoff of the Justice League franchise.",
    image: "https://www.nytimes.com/images/2022/07/28/multimedia/28dc-pets-review/28dc-pets-review-blog480.jpg",
    date: "15.03.2026",
  },
]

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await News.deleteMany({})
  await News.insertMany(news)
  console.log(`✅ ${news.length} news seeded`)
  mongoose.disconnect()
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
