import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dogImg from '../assets/images/add-pet-dog.png'
import styles from './AddMyPet.module.css'

const SPECIES_LIST = ['Dog', 'Cat', 'Bird', 'Fish', 'Turtle', 'Lizard', 'Hamster', 'Rabbit', 'Other']

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        petl
        <svg className={styles.heart} viewBox="0 0 24 24" fill="#F5C030">
          <path d="M12 21s-9-5.75-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.25-9 12-9 12z" />
        </svg>
        ve
      </Link>
      <nav className={styles.nav}>
        <Link to="/news"        className={styles.navLink}>News</Link>
        <Link to="/find-pet"    className={styles.navLink}>Find pet</Link>
        <Link to="/our-friends" className={styles.navLink}>Our friends</Link>
      </nav>
      {user && (
        <div className={styles.userArea}>
          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <span className={styles.userName}>{user.name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
        </div>
      )}
    </header>
  )
}

export default function AddMyPet() {
  const navigate = useNavigate()
  const [sex,       setSex]       = useState('Female')
  const [imageUrl,  setImageUrl]  = useState('')
  const [preview,   setPreview]   = useState('')
  const [title,     setTitle]     = useState('')
  const [name,      setName]      = useState('')
  const [birthday,  setBirthday]  = useState('')
  const [species,   setSpecies]   = useState('Dog')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleImageUrl = (e) => {
    setImageUrl(e.target.value)
    setPreview(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('https://pet-love-uoce.onrender.com/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, name, birthday, species, sex, image: imageUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      navigate('/find-pet')
    } catch {
      setError('Server connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>

        {/* Sol — süslü köpek */}
        <div className={styles.leftCard}>
          <img src={dogImg} alt="Add pet" className={styles.dogImg} />
        </div>

        {/* Sağ — form */}
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>
            Add my pet <span className={styles.formSub}>/ Personal details</span>
          </h1>

          {/* Cinsiyet */}
          <div className={styles.sexRow}>
            <button type="button" className={`${styles.sexBtn} ${styles.sexFemale} ${sex === 'Female' ? styles.sexBtnActive : ''}`} onClick={() => setSex('Female')}>
              ♀
            </button>
            <button type="button" className={`${styles.sexBtn} ${styles.sexMale} ${sex === 'Male' ? styles.sexBtnActive : ''}`} onClick={() => setSex('Male')}>
              ♂
            </button>
            <button type="button" className={`${styles.sexBtn} ${styles.sexOther} ${sex === 'Unknown' ? styles.sexBtnActive : ''}`} onClick={() => setSex('Unknown')}>
              ⚧
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Fotoğraf */}
            <div className={styles.photoSection}>
              <div className={styles.photoCircle}>
                {preview
                  ? <img src={preview} alt="preview" className={styles.photoImg} onError={() => setPreview('')} />
                  : <span className={styles.pawIcon}>🐾</span>
                }
              </div>
              <div className={styles.photoInputRow}>
                <input
                  className={styles.input}
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={handleImageUrl}
                />
                <label className={styles.uploadBtn}>
                  Upload photo ☁
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file) setPreview(URL.createObjectURL(file))
                    }}
                  />
                </label>
              </div>
            </div>

            <input
              className={styles.input}
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <input
              className={styles.input}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <div className={styles.row}>
              <input
                className={styles.input}
                type="text"
                placeholder="DD.MM.YYYY"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
              />
              <select className={styles.select} value={species} onChange={e => setSpecies(e.target.value)}>
                {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.btnRow}>
              <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
