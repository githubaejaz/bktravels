'use client'

import { useEffect, useState } from 'react'
import Bus from './Bus'
import { BRAND, CONTACT, ROUTES } from '../lib/config'
import { allTrips } from '../lib/routes'
import { tel } from '../lib/utils'
import { honk } from '../lib/sound'
import { HONK_LINES } from '../lib/fun'

const seen = new Set()
const PHRASES = [
  ...allTrips()
    .map((t) => `${t.from.toUpperCase()}  >>  ${t.to.toUpperCase()}`)
    .filter((p) => !seen.has(p) && seen.add(p)),
  'DAILY SERVICE',
  'TRAVEL IN COMFORT',
  'HORN OK PLEASE',
]

function LedBoard() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % PHRASES.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="led" aria-label="Daily bus service, travel in comfort">
      <span className="led-lamp" aria-hidden="true" />
      <span key={i} className="led-text" aria-hidden="true">
        {PHRASES[i]}
      </span>
    </div>
  )
}

const STARS = Array.from({ length: 38 }, (_, k) => ({
  left: (k * 53) % 100,
  top: (k * 29) % 62,
  size: 1 + (k % 3),
  delay: (k % 7) * 0.6,
}))

export default function Hero() {
  const main = ROUTES[0]
  const [honking, setHonking] = useState(null) // { n, line }

  useEffect(() => {
    let n = 0
    let timer
    const onHonk = () => {
      n += 1
      setHonking({ n, line: HONK_LINES[n % HONK_LINES.length] })
      clearTimeout(timer)
      timer = setTimeout(() => setHonking(null), 1800)
    }
    const onKey = (e) => {
      if (e.key.toLowerCase() !== 'h' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      honk()
    }
    window.addEventListener('bk-honk', onHonk)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('bk-honk', onHonk)
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <div className="hero-copy">
          <LedBoard />
          <h1>
            {main.from} to {main.to},
            <br />
            every day. And back.
          </h1>
          <p className="lead">
            {BRAND.name} runs a daily bus service on the {main.from} and {main.to} route. Send us your travel date and we
            will tell you what seats are available. No booking or payment on this site.
          </p>
          {ROUTES.length > 1 && (
            <p className="also">
              Also on the road:{' '}
              {ROUTES.slice(1)
                .map((r) => `${r.from} ⇄ ${r.to}${r.status === 'soon' ? ' (soon)' : ''}`)
                .join(', ')}
            </p>
          )}
          <div className="hero-cta">
            <a className="btn btn-orange" href="#enquiry">
              Check seat availability
            </a>
            <button className="btn btn-outline horn-btn" onClick={honk} aria-label="Honk the horn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 10v4h3l5 4V6L6 10H3Z" />
                <path d="M15 9a4 4 0 0 1 0 6M17.8 6.5a8 8 0 0 1 0 11" />
              </svg>
              Honk <kbd>H</kbd>
            </button>
            <a className="btn btn-outline call-btn" href={tel(CONTACT.phones[0])}>
              Call {CONTACT.phones[0]}
            </a>
          </div>
        </div>

        <figure className="polaroid">
          <img src="/gallery/bus-1.jpg" alt="A BKTravels coach on the highway" />
          <figcaption>Our coach. Travel in comfort.</figcaption>
        </figure>
      </div>

      <div className="scene" aria-hidden="true">
        <div className="sky">
          {STARS.map((s, k) => (
            <i key={k} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
          ))}
          <div className="sun" />
          <div className="moon" />
        </div>
        <svg className="hills" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path className="hill-a" d="M0 160 V90 Q80 40 170 80 T340 70 T520 95 T700 55 T880 90 T1060 60 T1200 85 V160 Z" />
          <path className="hill-b" d="M0 160 V120 Q120 85 240 115 T480 105 T720 120 T960 100 T1200 118 V160 Z" />
        </svg>
        <div className="roadside-sign">
          <span>{main.to.toUpperCase()}</span>
          <small>Travel in comfort</small>
        </div>
        <div className="road">
          <div className="road-dash" />
        </div>
        <div className="bus-wrap">
          {honking && (
            <div key={honking.n} className="honk-bubble">
              {honking.line}
            </div>
          )}
          <div className={`bus-bob ${honking ? 'honking' : ''}`}>
            <Bus lights />
          </div>
        </div>
      </div>
    </section>
  )
}
