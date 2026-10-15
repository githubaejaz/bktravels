'use client'

import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    ['Route', '#route'],
    ['Inside', '#inside'],
    ['Drive', '#drive'],
    ['Gallery', '#gallery'],
    ['Contact', '#contact'],
  ]
  return (
    <header className="nav">
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        <span className="mark">BK</span>
        <span className="brand-name">
          BK<b>Travels</b>
        </span>
      </a>
      <nav className={open ? 'open' : ''} aria-label="Main">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <ThemeToggle />
      <a className="btn btn-orange nav-cta" href="#enquiry">
        Check seats
      </a>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
    </header>
  )
}
