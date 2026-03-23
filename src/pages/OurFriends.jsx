import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './OurFriends.module.css'

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
        <Link to="/news"       className={styles.navLink}>News</Link>
        <Link to="/find-pet"   className={styles.navLink}>Find pet</Link>
        <Link to="/our-friends" className={`${styles.navLink} ${styles.navLinkActive}`}>Our friends</Link>
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

function FriendCard({ friend }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <img src={friend.imageUrl} alt={friend.title} className={styles.logo2} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{friend.title}</h3>
          <span className={styles.hoursBadge}>{friend.hours}</span>
        </div>
        <ul className={styles.infoList}>
          {friend.email && (
            <li><span className={styles.infoLabel}>Email:</span> <a href={`mailto:${friend.email}`} className={styles.infoLink}>{friend.email}</a></li>
          )}
          <li><span className={styles.infoLabel}>Address:</span> <span className={styles.infoValue}>{friend.address || 'website only'}</span></li>
          <li><span className={styles.infoLabel}>Phone:</span> <span className={styles.infoValue}>{friend.phone || 'email only'}</span></li>
        </ul>
      </div>
    </div>
  )
}

export default function OurFriends() {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/friends')
      .then(r => r.json())
      .then(data => setFriends(data))
      .catch(() => setFriends([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Our friends</h1>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.grid}>
            {friends.map(f => <FriendCard key={f._id} friend={f} />)}
          </div>
        )}
      </main>
    </div>
  )
}
