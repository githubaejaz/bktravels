'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'light')
  }, [])

  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('bk-theme', next)
    } catch (e) {}
  }

  return (
    <button
      className="theme-btn"
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
      aria-pressed={theme === 'dark'}
    >
      <svg className="t-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7" />
      </svg>
      <svg className="t-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
      </svg>
      <span className="theme-knob" />
    </button>
  )
}
