# 🐾 PetLove

A full-stack web application for pet adoption, lost & found listings, and connecting with animal shelters and partner organizations.

---

## Features

- **Browse Pets** — Filter by species, sex, category (adopt, lost, found, free) and location
- **Search** — Full-text search across pet names, descriptions, and locations
- **List a Pet** — Authenticated users can create pet listings with photos
- **News** — Stay up to date with pet-related articles
- **Our Friends** — Directory of shelters, vet clinics, and pet shops
- **Authentication** — Secure JWT-based register/login system
- **Splash Screen** — Smooth intro animation on first load

---

## Tech Stack

### Frontend
| Tool | Version |
|------|---------|
| React | 19 |
| React Router DOM | 7 |
| Vite | 8 |
| CSS Modules | — |

### Backend
| Tool | Version |
|------|---------|
| Node.js + Express | 5 |
| MongoDB + Mongoose | 9 |
| bcryptjs | — |
| JSON Web Token | — |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pet-love.git
cd pet-love
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
# from the project root
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Pets
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/pets` | Public |
| GET | `/api/pets/:id` | Public |
| POST | `/api/pets` | Protected |

### News
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/news` | Public |

### Friends (Shelters & Partners)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/friends` | Public |

---

## Project Structure

```
pet-love/
├── backend/
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas (User, Pet, News, Friend)
│   ├── routes/           # Express route handlers
│   ├── seed.js           # Database seed scripts
│   └── server.js         # Express app entry point
│
├── src/
│   ├── components/       # Reusable UI components (Navbar, PetCard, etc.)
│   ├── pages/            # Page-level components (Landing, FindPet, News, etc.)
│   ├── assets/           # Images and icons
│   └── App.jsx           # Root component with routing
│
├── public/               # Static assets
├── index.html
└── vite.config.js
```

---

## Seed the Database

To populate the database with sample data:

```bash
cd backend
node seed.js        # Seeds users and pets
node seedNews.js    # Seeds news articles
node seedFriends.js # Seeds partner organizations
```

---

## License

MIT
