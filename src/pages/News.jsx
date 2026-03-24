import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './News.module.css'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = (path) => window.location.href = path
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
        <Link to="/news"     className={`${styles.navLink} ${styles.navLinkActive}`}>News</Link>
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

function NewsCard({ item }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className={styles.card}>
      <div className={styles.cardImgWrap}>
        {!imgError ? (
          <img src={item.image} alt={item.title} className={styles.cardImg} onError={() => setImgError(true)} />
        ) : (
          <div className={styles.cardImgPlaceholder} />
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardDate}>{item.date}</span>
          <a href="#" className={styles.readMore}>Read more</a>
        </div>
      </div>
    </div>
  )
}

function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className={styles.pagination}>
      <button className={styles.pgBtn} onClick={() => onChange(1)}        disabled={page === 1}>«</button>
      <button className={styles.pgBtn} onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(i => (
        <button key={i} className={`${styles.pgBtn} ${i === page ? styles.pgBtnActive : ''}`} onClick={() => onChange(i)}>{i}</button>
      ))}
      <button className={styles.pgBtn} onClick={() => onChange(page + 1)} disabled={page === pages}>›</button>
      <button className={styles.pgBtn} onClick={() => onChange(pages)}    disabled={page === pages}>»</button>
    </div>
  )
}

export default function News() {
  const [news, setNews]       = useState([])
  const [pages, setPages]     = useState(1)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState('')

  const fetchNews = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: pg })
      if (search) params.set('search', search)
      const res  = await fetch(`https://pet-love-uoce.onrender.com/api/news?${params}`)
      const data = await res.json()
      setNews(data.news)
      setPages(data.pages)
      setPage(data.page)
    } catch {
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchNews(1) }, [fetchNews])

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>News</h1>
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : news.length === 0 ? (
          <p className={styles.loading}>No news found.</p>
        ) : (
          <div className={styles.grid}>
            {news.map(item => <NewsCard key={item._id} item={item} />)}
          </div>
        )}

        <Pagination page={page} pages={pages} onChange={fetchNews} />
      </main>
    </div>
  )
}
