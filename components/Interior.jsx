'use client'

import { useEffect, useRef, useState } from 'react'
import { honk } from '../lib/sound'

const X0 = 58
const DX = 88
const VW = 900

const PEOPLE = [
  { kind: 'gaze', skin: '#c68642', hair: '#1b1b1b', shirt: '#F28C28', say: 'Are we in Gujarat yet? Nope. Still cows.' },
  { kind: 'sleep', skin: '#8d5524', hair: '#111', shirt: '#4a90d9', say: 'Wake me at Palanpur. Or Surat. Okay, Surat.' },
  null,
  { kind: 'phone', skin: '#e0ac69', hair: '#2a1a10', shirt: '#9b59b6', say: 'Reel 47 of 300. Network: one bar. Hope: zero.' },
  { kind: 'wave', skin: '#f1c27d', hair: '#3b2a1a', shirt: '#17692F', say: 'Mummy, I am on BKTravels! Wave back!' },
  { kind: 'snack', skin: '#a0673a', hair: '#161616', shirt: '#e5383b', say: 'Thepla: packed. Dhokla: loaded. Chutney: missing.' },
  null,
  { kind: 'sleep', skin: '#d9a066', hair: '#222', shirt: '#2ea8a0', say: 'Shh. The bus is rocking me like a cradle.' },
]

function Seat({ person, row }) {
  const x = X0 + row * DX
  const bobDelay = `${-(row % 4) * 0.35}s`
  return (
    <g transform={`translate(${x} 0)`}>
      {/* reading light, glows at night over occupied seats */}
      {person && <polygon className="read-beam" points="22,50 -14,198 74,198" />}
      <circle cx="24" cy="48" r="4" className="read-lamp" />

      <rect x="24" y="200" width="12" height="16" className="seat-leg" />
      <rect x="0" y="112" width="20" height="86" rx="9" className="seat-back" />
      <rect x="-2" y="98" width="24" height="22" rx="9" className="seat-head" />
      <rect x="6" y="186" width="64" height="16" rx="7" className="seat-cush" />

      {person && (
        <g
          className="person"
          style={{ animationDelay: bobDelay }}
          role="button"
          tabIndex={0}
          aria-label="Passenger. Tap to hear what they say."
          data-say={person.say}
          data-x={x + 30}
        >
          <rect x="6" y="90" width="76" height="126" fill="transparent" />
          <rect x="16" y="128" width="30" height="62" rx="13" fill={person.shirt} />
          <rect x="20" y="178" width="54" height="14" rx="7" fill="#2b3a4a" />
          <rect x="63" y="182" width="13" height="32" rx="6" fill="#2b3a4a" />

          <g className={`head head-${person.kind}`}>
            <circle cx="30" cy="110" r="14" fill={person.skin} />
            <path d="M16 110 A14 14 0 0 1 44 110 Q38 101 30 101 Q22 101 16 110Z" fill={person.hair} />
            <circle cx="38" cy="109" r="1.7" fill="#222" />
          </g>

          {person.kind === 'wave' && (
            <g transform="translate(38 140)">
              <rect className="arm-wave" x="-4" y="-38" width="9" height="42" rx="4.5" fill={person.skin} />
            </g>
          )}
          {person.kind === 'phone' && (
            <g>
              <rect x="34" y="144" width="30" height="8" rx="4" fill={person.skin} />
              <rect x="60" y="132" width="9" height="16" rx="2" fill="#1b1b1b" />
              <rect className="phone-glow" x="61" y="133" width="7" height="14" rx="1.5" fill="#8fd3ff" />
            </g>
          )}
          {person.kind === 'snack' && (
            <g className="snack">
              <rect x="34" y="138" width="22" height="8" rx="4" fill={person.skin} transform="rotate(-35 34 142)" />
              <circle cx="52" cy="124" r="5" fill="#F4B942" />
            </g>
          )}
          {person.kind === 'sleep' && (
            <g className="zzz" fill="currentColor">
              <text x="40" y="92" fontSize="14" fontWeight="800">z</text>
              <text x="50" y="80" fontSize="11" fontWeight="800">z</text>
            </g>
          )}
        </g>
      )}
    </g>
  )
}

export default function Interior() {
  const [say, setSay] = useState(null)
  const timer = useRef(null)

  const talk = (text, x) => {
    setSay({ text, x, k: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSay(null), 3800)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  const onSvg = (e) => {
    const g = e.target.closest('.person, .driver')
    if (!g) return
    if (g.classList.contains('driver')) {
      honk()
      talk('Sit down! Driver ko disturb mat karo. Horn OK please.', 800)
    } else talk(g.dataset.say, Number(g.dataset.x))
  }
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSvg(e)
    }
  }

  return (
    <section className="inside" id="inside">
      <div className="section-head">
        <h2 className="title">Inside the coach</h2>
        <p className="muted">Tap a passenger. They have opinions. Tap the driver if you dare.</p>
      </div>

      <div className="cabin">
        <svg viewBox={`0 0 ${VW} 250`} onClick={onSvg} onKeyDown={onKey} role="group" aria-label="Animated cutaway of passengers inside a BKTravels coach">
          <defs>
            <clipPath id="cab-win">
              <rect x="40" y="34" width="820" height="76" rx="12" />
            </clipPath>
            <g id="scn">
              <path className="sc-hill" d="M0 110 Q40 70 90 96 T180 84 T300 110 Z" />
              <rect className="sc-pole" x="140" y="52" width="4" height="58" />
              <path className="sc-wire" d="M142 58 Q220 74 300 58" />
              <rect className="sc-trunk" x="236" y="86" width="5" height="24" />
              <circle className="sc-leaf" cx="238" cy="80" r="14" />
              <rect className="sc-sign" x="40" y="66" width="46" height="18" rx="3" />
            </g>
          </defs>

          {/* cabin shell */}
          <rect x="8" y="8" width="884" height="234" rx="34" className="cab-shell" />
          <rect x="24" y="214" width="852" height="20" rx="8" className="cab-floor" />
          <rect x="40" y="20" width="820" height="10" rx="5" className="cab-rack" />
          {[70, 170, 300, 410, 560, 650, 760].map((x, i) => (
            <rect key={x} x={x} y="14" width={26 + (i % 3) * 8} height="16" rx="5" className="cab-bag" />
          ))}

          {/* window with scrolling scenery */}
          <rect x="40" y="34" width="820" height="76" rx="12" className="cab-window" />
          <g clipPath="url(#cab-win)">
            <g className="scenery">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <use key={i} href="#scn" x={i * 300} />
              ))}
            </g>
          </g>
          <rect x="40" y="34" width="820" height="76" rx="12" className="cab-window-frame" />

          {PEOPLE.map((p, i) => (
            <Seat key={i} row={i} person={p} />
          ))}

          {/* driver */}
          <g className="driver" role="button" tabIndex={0} aria-label="Driver. Tap to honk.">
            <rect x="770" y="90" width="120" height="126" fill="transparent" />
            <rect x="786" y="196" width="12" height="20" className="seat-leg" />
            <rect x="780" y="112" width="20" height="86" rx="9" className="seat-back" />
            <rect x="778" y="98" width="24" height="22" rx="9" className="seat-head" />
            <rect x="786" y="186" width="64" height="16" rx="7" className="seat-cush" />
            <rect x="796" y="128" width="30" height="62" rx="13" fill="#F7F7F2" stroke="#17692F" strokeWidth="3" />
            <rect x="800" y="178" width="52" height="14" rx="7" fill="#14181A" />
            <rect x="842" y="182" width="13" height="32" rx="6" fill="#14181A" />
            <circle cx="810" cy="110" r="14" fill="#b67b4b" />
            <path d="M796 110 A14 14 0 0 1 824 110 Q818 101 810 101 Q802 101 796 110Z" fill="#111" />
            <circle cx="818" cy="109" r="1.7" fill="#222" />
            <rect x="816" y="140" width="40" height="8" rx="4" fill="#b67b4b" />
            <g transform="translate(862 146)">
              <g className="steer">
                <ellipse cx="0" cy="0" rx="7" ry="24" className="steer-ring" />
                <line x1="0" y1="-24" x2="0" y2="24" className="steer-spoke" />
              </g>
            </g>
            <rect x="868" y="128" width="16" height="84" rx="5" className="dash" />
            <rect x="871" y="134" width="10" height="6" rx="2" className="dash-light" />
          </g>

          <rect x="40" y="34" width="820" height="76" rx="12" className="night-dim" />
        </svg>

        {say && (
          <div key={say.k} className="bubble" style={{ left: `${Math.min(82, Math.max(14, (say.x / VW) * 100))}%` }}>
            {say.text}
          </div>
        )}
      </div>
    </section>
  )
}
