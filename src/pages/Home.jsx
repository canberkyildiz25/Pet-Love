import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [imgError, setImgError] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <>
      <Navbar user={user} />
      <main className={styles.main}>

        <section className={styles.heroCard}>
          <div className={styles.heroText}>
            <h1 className={styles.headline}>
              Take good <span className={styles.accent}>care</span> of<br />
              your small pets
            </h1>
          </div>
          <p className={styles.heroDesc}>
            Choosing a pet for your home is a choice that is meant to enrich
            your life with immeasurable joy and tenderness.
          </p>
        </section>

        <section className={styles.imageWrap}>
          {!imgError ? (
            <img
              src="/src/assets/images/home-hero.png"
              alt="Pet love"
              className={styles.heroImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.imgPlaceholder} />
          )}
        </section>

      </main>
    </>
  )
}
