import { Link } from 'react-router-dom'
import catImg from '../assets/images/404-cat.png'
import styles from './NotFound.module.css'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
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
      {user ? (
        <div className={styles.userArea}>
          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <span className={styles.userName}>{user.name}</span>
        </div>
      ) : (
        <div className={styles.auth}>
          <Link to="/login"    className={styles.btnOutline}>LOG IN</Link>
          <Link to="/register" className={styles.btnFilled}>REGISTRATION</Link>
        </div>
      )}
    </header>
  )
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.errorRow}>
            <span className={styles.num}>4</span>
            <div className={styles.catCircle}>
              <img src={catImg} alt="404 cat" className={styles.catImg} />
            </div>
            <span className={styles.num}>4</span>
          </div>
          <p className={styles.message}>Ooops! This page not found :(</p>
          <Link to="/" className={styles.homeBtn}>To home page</Link>
        </div>
      </main>
    </div>
  )
}
