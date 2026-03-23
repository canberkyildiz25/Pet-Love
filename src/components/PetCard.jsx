import styles from './PetCard.module.css'

export default function PetCard({ image, imageAlt, name, birthday, description, isCat }) {
  return (
    <div className={styles.card}>
      <img
        src={image}
        alt={imageAlt}
        className={`${styles.img} ${isCat ? styles.imgCat : ''}`}
      />

      <div className={styles.info}>
        <div className={styles.avatar}>
          {isCat ? <CatIcon /> : <DogIcon />}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.name}>{name}</span>
            <span className={styles.birthday}>Birthday &nbsp; {birthday}</span>
          </div>
          <p className={styles.desc}>{description}</p>
        </div>
      </div>
    </div>
  )
}

function DogIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="18" cy="18" r="18" fill="#F5E8C0"/>
      <ellipse cx="18" cy="22" rx="6" ry="5" fill="#c9973a"/>
      <ellipse cx="13" cy="16" rx="2.5" ry="3" fill="#c9973a"/>
      <ellipse cx="18" cy="14" rx="2.5" ry="3" fill="#c9973a"/>
      <ellipse cx="23" cy="16" rx="2.5" ry="3" fill="#c9973a"/>
    </svg>
  )
}

function CatIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="18" cy="18" r="18" fill="#F5E8C0"/>
      <ellipse cx="18" cy="20" rx="7" ry="6" fill="#c9973a"/>
      <polygon points="10,12 13,18 7,18" fill="#c9973a"/>
      <polygon points="26,12 29,18 23,18" fill="#c9973a"/>
    </svg>
  )
}
