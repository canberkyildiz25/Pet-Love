import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import FindPet from './pages/FindPet'
import News from './pages/News'
import OurFriends from './pages/OurFriends'
import NotFound from './pages/NotFound'
import AddMyPet from './pages/AddMyPet'
import SplashScreen from './components/SplashScreen'

function App() {
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/home"     element={<Navigate to="/" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-pet" element={<FindPet />} />
        <Route path="/news"        element={<News />} />
        <Route path="/our-friends" element={<OurFriends />} />
        <Route path="/add-pet"     element={<AddMyPet />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
