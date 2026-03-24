import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PetCard from '../components/PetCard'
import PasswordInput from '../components/PasswordInput'
import dogImg from '../assets/images/dog.png'
import styles from './AuthPage.module.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://pet-love-uoce.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch {
      setError('Server connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <PetCard
          image={dogImg}
          imageAlt="Rich the Corgi"
          name="Rich"
          birthday="21.09.2020"
          description="Rich would be the perfect addition to an active family that loves to play and go on walks. I bet he would love having a doggy playmate too!"
        />

        <div className={styles.card}>
          <h1 className={styles.title}>Log in</h1>
          <p className={styles.sub}>Welcome! Please enter your credentials to login to the platform:</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <PasswordInput
              id="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? 'Loading...' : 'LOG IN'}
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account?&nbsp;
            <Link to="/register" className={styles.link}>Register</Link>
          </p>
        </div>
      </main>
    </>
  )
}
