import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar({ user }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        petl
        <svg className={styles.heart} viewBox="0 0 24 24" fill="#F5C030" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21s-9-5.75-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.25-9 12-9 12z" />
        </svg>
        ve
      </Link>

      <nav className={styles.nav}>
        <Link to="/news" className={styles.navLink}>News</Link>
        <Link to="/find-pet" className={styles.navLink}>Find pet</Link>
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
          <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div className={styles.auth}>
          <Link
            to="/login"
            className={`${styles.btn} ${pathname === '/login' ? styles.btnFilled : styles.btnOutline}`}
          >
            LOG IN
          </Link>
          <Link
            to="/register"
            className={`${styles.btn} ${pathname === '/register' ? styles.btnFilled : styles.btnOutline}`}
          >
            REGISTRATION
          </Link>
        </div>
      )}
    </header>
  )
}
