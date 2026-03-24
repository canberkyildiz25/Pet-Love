import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PetCard from '../components/PetCard'
import PasswordInput from '../components/PasswordInput'
import catImg from '../assets/images/cat.png'
import styles from './AuthPage.module.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('https://pet-love-uoce.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
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
          image={catImg}
          imageAlt="Jack the cat"
          name="Jack"
          birthday="18.10.2021"
          description="Jack is a golden-orange tabby cat with bright yellow eyes. He is calm, curious, and loves sitting in sunny spots around the house."
          isCat
        />

        <div className={styles.card}>
          <h1 className={styles.title}>Registration</h1>
          <p className={styles.sub}>Thank you for your interest in our platform.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />

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

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? 'Loading...' : 'REGISTRATION'}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?&nbsp;
            <Link to="/login" className={styles.link}>Login</Link>
          </p>
        </div>
      </main>
    </>
  )
}
