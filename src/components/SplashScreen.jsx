import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'
import heroImg from '../assets/hero.png'

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('logo') // 'logo' | 'loading'

  useEffect(() => {
    // Show logo for 1.2s then switch to loading
    const logoTimer = setTimeout(() => setPhase('loading'), 1200)
    return () => clearTimeout(logoTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onFinish, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [phase, onFinish])

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={styles.splash}>
      <img src={heroImg} alt="hero" className={styles.bg} />
      <div className={styles.overlay} />

      {phase === 'logo' && (
        <div className={styles.logoWrap}>
          <span className={styles.logo}>
            petl<span className={styles.heart}>♥</span>ve
          </span>
        </div>
      )}

      {phase === 'loading' && (
        <div className={styles.loadingWrap}>
          <svg className={styles.ring} viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
            />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="#F5C030"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <span className={styles.percent}>{progress}%</span>
        </div>
      )}
    </div>
  )
}
