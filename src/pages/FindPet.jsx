import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './FindPet.module.css'

const TAGS       = ['popular', 'unpopular']
const CATEGORIES = ['all', 'free', 'lost', 'found']
const SEXES      = ['all', 'Male', 'Female', 'Unknown']
const SPECIES    = ['all', 'Dog', 'Cat', 'Fish', 'Turtle', 'Lizard', 'Bird', 'Hamster']

/* ── Attention Modal ── */
function AttentionModal({ onClose }) {
  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.attentionIcon}>🐶</div>
        <h2 className={styles.attentionTitle}>Attention</h2>
        <p className={styles.attentionText}>
          We would like to remind you that certain functionality is available only to authorized users.
          If you have an account, please log in with your credentials. If you do not already have an account,
          you must register to access these features.
        </p>
        <div className={styles.modalFooter}>
          <Link to="/login"    className={styles.modalAddBtn}     onClick={onClose}>Log In</Link>
          <Link to="/register" className={styles.modalContactBtn} onClick={onClose}>Registration</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Pet Modal ── */
function PetModal({ pet, onClose, onAuthRequired }) {
  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleContact = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) { onClose(); onAuthRequired() }
  }

  const stars = Array.from({ length: 5 }, (_, i) => i < pet.rating ? '★' : '☆')

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        <div className={styles.modalImgWrap}>
          <span className={styles.modalBadge}>{pet.category}</span>
          <div className={styles.modalImgCircle}>
            <img src={pet.image} alt={pet.name} className={styles.modalImg} />
          </div>
        </div>

        <h2 className={styles.modalName}>{pet.name}</h2>

        <div className={styles.modalRating}>
          {stars.map((s, i) => (
            <span key={i} className={s === '★' ? styles.starFilled : styles.starEmpty}>{s}</span>
          ))}
          <span className={styles.ratingNum}>{pet.rating}</span>
        </div>

        <div className={styles.modalMeta}>
          <div className={styles.modalMetaItem}>
            <span className={styles.metaLabel}>Name</span>
            <span className={styles.metaValue}>{pet.name.split(' ')[0]}</span>
          </div>
          <div className={styles.modalMetaItem}>
            <span className={styles.metaLabel}>Birthday</span>
            <span className={styles.metaValue}>{pet.birthday || '—'}</span>
          </div>
          <div className={styles.modalMetaItem}>
            <span className={styles.metaLabel}>Sex</span>
            <span className={styles.metaValue}>{pet.sex}</span>
          </div>
          <div className={styles.modalMetaItem}>
            <span className={styles.metaLabel}>Species</span>
            <span className={styles.metaValue}>{pet.species}</span>
          </div>
        </div>

        <p className={styles.modalDesc}>{pet.description}</p>

        <div className={styles.modalFooter}>
          <button className={styles.modalAddBtn}>
            Add to <span className={styles.modalHeart}>♥</span>
          </button>
          <button className={styles.modalContactBtn} onClick={handleContact}>Contact</button>
        </div>
      </div>
    </div>
  )
}

/* ── Navbar ── */
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
        <Link to="/news" className={styles.navLink}>News</Link>
        <Link to="/find-pet" className={`${styles.navLink} ${styles.navLinkActive}`}>Find pet</Link>
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

/* ── Pet Card ── */
function PetCard({ pet, onLearnMore }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className={styles.card}>
      <div className={styles.cardImgWrap}>
        <img src={pet.image} alt={pet.name} className={styles.cardImg} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardName}>{pet.name}</h3>
          <span className={styles.rating}>★ {pet.rating}</span>
        </div>
        <div className={styles.cardMeta}>
          <span><b>Name</b> {pet.name.split(' ')[0]}</span>
          <span><b>Birthday</b> {pet.birthday || '—'}</span>
          <span><b>Sex</b> {pet.sex}</span>
          <span><b>Species</b> {pet.species}</span>
          <span><b>Category</b> {pet.category}</span>
        </div>
        <p className={styles.cardDesc}>{pet.description}</p>
        <div className={styles.cardFooter}>
          <button className={styles.learnBtn} onClick={() => onLearnMore(pet)}>Learn more</button>
          <button
            className={`${styles.heartBtn} ${liked ? styles.heartBtnActive : ''}`}
            onClick={() => setLiked(l => !l)}
          >♥</button>
        </div>
      </div>
    </div>
  )
}

/* ── Pagination ── */
function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const items = []
  for (let i = 1; i <= pages; i++) items.push(i)
  return (
    <div className={styles.pagination}>
      <button className={styles.pgBtn} onClick={() => onChange(1)}         disabled={page === 1}>«</button>
      <button className={styles.pgBtn} onClick={() => onChange(page - 1)}  disabled={page === 1}>‹</button>
      {items.map(i => (
        <button key={i} className={`${styles.pgBtn} ${i === page ? styles.pgBtnActive : ''}`} onClick={() => onChange(i)}>{i}</button>
      ))}
      <button className={styles.pgBtn} onClick={() => onChange(page + 1)}  disabled={page === pages}>›</button>
      <button className={styles.pgBtn} onClick={() => onChange(pages)}     disabled={page === pages}>»</button>
    </div>
  )
}

/* ── Main Page ── */
export default function FindPet() {
  const [pets, setPets]         = useState([])
  const [pages, setPages]       = useState(1)
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [selectedPet, setSelected]     = useState(null)
  const [attentionOpen, setAttention]   = useState(false)

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')
  const [sex,      setSex]      = useState('all')
  const [species,  setSpecies]  = useState('all')
  const [location, setLocation] = useState('')
  const [tag,      setTag]      = useState('')

  const fetchPets = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: pg })
      if (search)             params.set('search', search)
      if (category !== 'all') params.set('category', category)
      if (sex      !== 'all') params.set('sex', sex)
      if (species  !== 'all') params.set('species', species)
      if (location)           params.set('location', location)
      if (tag)                params.set('tag', tag)

      const res  = await fetch(`http://localhost:5000/api/pets?${params}`)
      const data = await res.json()
      setPets(data.pets)
      setPages(data.pages)
      setPage(data.page)
    } catch {
      setPets([])
    } finally {
      setLoading(false)
    }
  }, [search, category, sex, species, location, tag])

  useEffect(() => { fetchPets(1) }, [fetchPets])

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.title}>Find your favorite pet</h1>

        <div className={styles.filtersBox}>
          <div className={styles.filtersRow}>
            <div className={styles.searchWrap}>
              <input className={styles.searchInput} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
              <span className={styles.searchIcon}>🔍</span>
            </div>
            <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'Category' : c}</option>)}
            </select>
            <select className={styles.select} value={sex} onChange={e => setSex(e.target.value)}>
              {SEXES.map(s => <option key={s} value={s}>{s === 'all' ? 'By gender' : s}</option>)}
            </select>
            <select className={styles.select} value={species} onChange={e => setSpecies(e.target.value)}>
              {SPECIES.map(s => <option key={s} value={s}>{s === 'all' ? 'By type' : s}</option>)}
            </select>
            <div className={styles.searchWrap}>
              <input className={styles.searchInput} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
              <span className={styles.searchIcon}>🔍</span>
            </div>
          </div>
          <div className={styles.tagsRow}>
            {TAGS.map(t => (
              <button key={t} className={`${styles.tagBtn} ${tag === t ? styles.tagBtnActive : ''}`} onClick={() => setTag(p => p === t ? '' : t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : pets.length === 0 ? (
          <p className={styles.loading}>No pets found.</p>
        ) : (
          <div className={styles.grid}>
            {pets.map(pet => <PetCard key={pet._id} pet={pet} onLearnMore={setSelected} />)}
          </div>
        )}

        <Pagination page={page} pages={pages} onChange={fetchPets} />
      </main>

      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelected(null)}
          onAuthRequired={() => setAttention(true)}
        />
      )}
      {attentionOpen && <AttentionModal onClose={() => setAttention(false)} />}
    </div>
  )
}
