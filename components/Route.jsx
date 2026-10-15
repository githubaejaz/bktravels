'use client'

import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '../lib/config'
import { clamp } from '../lib/utils'

export default function Route() {
  const [routeId, setRouteId] = useState(ROUTES[0].id)
  const [rev, setRev] = useState(false)
  const [p, setP] = useState(0)
  const ref = useRef(null)

  const route = ROUTES.find((r) => r.id === routeId) || ROUTES[0]

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(clamp((window.innerHeight * 0.55 - r.top) / r.height, 0, 1))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const stops = rev ? [...route.stops].reverse() : route.stops
  const last = stops.length - 1

  return (
    <section className="route" id="route">
      <div className="route-side">
        {ROUTES.length > 1 && (
          <div className="route-tabs" role="tablist" aria-label="Routes">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={r.id === route.id}
                className={r.id === route.id ? 'on' : ''}
                onClick={() => {
                  setRouteId(r.id)
                  setRev(false)
                }}
              >
                {r.from} ⇄ {r.to}
                {r.status === 'soon' && <em>Soon</em>}
              </button>
            ))}
          </div>
        )}

        <h2 className="title">
          {stops[0].name} to {stops[last].name}
        </h2>
        <p className="muted">
          Scroll to ride the route. Pickup and drop points can be arranged along the way, so tell us where you board.
        </p>
        {route.status === 'soon' && <p className="badge-soon">This route is starting soon. Send an enquiry and we will let you know.</p>}

        <div className="toggle" role="group" aria-label="Direction">
          <button className={!rev ? 'on' : ''} onClick={() => setRev(false)}>
            {route.from} → {route.to}
          </button>
          <button className={rev ? 'on' : ''} onClick={() => setRev(true)}>
            {route.to} → {route.from}
          </button>
        </div>

        <div className="tickets">
          {route.trips.map((t) => (
            <article key={t.from + t.to} className={`ticket ${t.from === stops[0].name ? 'active' : ''}`}>
              <div className="ticket-main">
                <h3>
                  {t.from} → {t.to}
                </h3>
                <p>{t.pickup}</p>
              </div>
              <div className="ticket-time">
                <span>Departs</span>
                <b>{t.departs}</b>
                <small>Reaches: {t.arrives}</small>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="track" ref={ref} style={{ '--p': p, minHeight: Math.max(420, stops.length * 126) }}>
        <div className="rail">
          <div className="rail-fill" />
          <div className="rail-bus" aria-hidden="true">
            <svg viewBox="0 0 40 70">
              <rect x="6" y="2" width="28" height="66" rx="9" fill="#FFFFFF" stroke="#17692F" strokeWidth="2" />
              <rect x="10" y="9" width="20" height="10" rx="3" fill="#1C1816" />
              <rect x="10" y="24" width="20" height="30" rx="3" fill="#D9DDD6" />
              <rect x="6" y="30" width="28" height="5" fill="#F28C28" />
              <rect x="9" y="60" width="6" height="4" rx="1" fill="#E5383B" />
              <rect x="25" y="60" width="6" height="4" rx="1" fill="#E5383B" />
            </svg>
          </div>
        </div>
        <ol className="stops">
          {stops.map((s, k) => {
            const passed = p >= k / last - 0.02
            return (
              <li key={s.name + k} className={passed ? 'passed' : ''}>
                <span className="sign">{s.name}</span>
                <span className="note">{s.note}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
