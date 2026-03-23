import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './Landing.module.css'

export default function Landing() {
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* Yellow card — navbar + hero text inside */}
        <section className={styles.heroCard}>
          <header className={styles.navbar}>
            <span className={styles.logo}>
              petl
              <svg className={styles.heart} viewBox="0 0 24 24" fill="#F5C030">
                <path d="M12 21s-9-5.75-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.25-9 12-9 12z" />
              </svg>
              ve
            </span>

            <nav className={styles.nav}>
              <Link to="/news" className={styles.navLink}>News</Link>
              <Link to="/find-pet" className={styles.navLink}>Find pet</Link>
              <Link to="/our-friends" className={styles.navLink}>Our friends</Link>
            </nav>

            {user ? (
              <div className={styles.userArea}>
                <Link to="/add-pet" className={styles.addPetBtn}>+ Add pet</Link>
                <div className={styles.avatar}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <span className={styles.userName}>{user.name}</span>
                <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
              </div>
            ) : (
              <div className={styles.auth}>
                <Link to="/login"    className={styles.btnOutline}>LOG IN</Link>
                <Link to="/register" className={styles.btnFilled}>REGISTRATION</Link>
              </div>
            )}
          </header>

          <div className={styles.heroBody}>
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
          </div>
        </section>

        {/* Hero image */}
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
    </div>
  )
}
