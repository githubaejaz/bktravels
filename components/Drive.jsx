'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Bus from './Bus'
import { ROUTES } from '../lib/config'
import { honk } from '../lib/sound'
import { clamp } from '../lib/utils'

const LANES = [0.64, 0.78, 0.92] // bottom edge of vehicles, as a fraction of stage height
const TOTAL = 30000 // "pixels" of road for the whole trip
const SIZE = 46

const TYPES = {
  cow: { e: '🐄', w: 52, vx: 0, bad: true, honk: 'ignore', weight: 3 },
  auto: { e: '🛺', w: 54, vx: 120, bad: true, honk: 'move', weight: 3 },
  scooter: { e: '🛵', w: 50, vx: 160, bad: true, honk: 'move', weight: 3 },
  pothole: { e: '🕳️', w: 48, vx: 0, bad: true, honk: 'none', weight: 2 },
  barricade: { e: '🚧', w: 48, vx: 0, bad: true, honk: 'none', weight: 2 },
  chai: { e: '☕', w: 40, vx: 0, bad: false, pts: 15, weight: 3, say: 'Chai! +15' },
  rider: { e: '🙋', w: 42, vx: 0, bad: false, pts: 30, weight: 2, say: 'New passenger on board! +30' },
}

const CRASH = {
  cow: 'The cow won. The cow always wins.',
  auto: 'Auto-rickshaw uncle is not pleased.',
  scooter: 'A scooter family of four: shaken, not stirred.',
  pothole: 'Pothole! Your chai just left the building.',
  barricade: 'Who put a barricade there?!',
}

const rating = (n) =>
  n < 120 ? 'Learner licence' : n < 300 ? 'Conductor in training' : n < 600 ? 'Highway hero' : 'Legend of the highway'

export default function Drive() {
  const stops = ROUTES[0].stops.map((s) => s.name)
  const stage = useRef(null)
  const layer = useRef(null)
  const busEl = useRef(null)
  const busIn = useRef(null)
  const scoreEl = useRef(null)
  const barEl = useRef(null)
  const raf = useRef(0)
  const toastTimer = useRef(null)
  const g = useRef({ running: false })

  const [status, setStatus] = useState('idle') // idle | running | over | won
  const [lives, setLives] = useState(3)
  const [nextStop, setNextStop] = useState(stops[1] || stops[0])
  const [toast, setToast] = useState(null)
  const [best, setBest] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem('bk-best')) || 0)
    } catch (e) {}
    return () => {
      g.current.running = false
      cancelAnimationFrame(raf.current)
      clearTimeout(toastTimer.current)
    }
  }, [])

  const say = useCallback((text) => {
    setToast({ text, k: Date.now() })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  const finish = useCallback(
    (won, why) => {
      const s = g.current
      s.running = false
      cancelAnimationFrame(raf.current)
      const score = Math.floor(s.score)
      let newBest = false
      try {
        const prev = Number(localStorage.getItem('bk-best')) || 0
        if (score > prev) {
          localStorage.setItem('bk-best', String(score))
          setBest(score)
          newBest = true
        }
      } catch (e) {}
      setResult({ score, won, why, rating: rating(score), newBest })
      setStatus(won ? 'won' : 'over')
    },
    []
  )

  const layoutBus = () => {
    const s = g.current
    const st = stage.current
    s.W = st.clientWidth
    s.H = st.clientHeight
    s.busW = Math.min(230, s.W * 0.4)
    s.busH = (s.busW * 190) / 560
    s.busX = Math.max(14, s.W * 0.05)
    busEl.current.style.width = s.busW + 'px'
  }

  const spawn = () => {
    const s = g.current
    const entries = Object.entries(TYPES)
    const total = entries.reduce((a, [, d]) => a + d.weight, 0)
    let r = Math.random() * total
    let type = entries[0][0]
    for (const [k, d] of entries) {
      if ((r -= d.weight) <= 0) {
        type = k
        break
      }
    }
    const def = TYPES[type]
    const lane = Math.floor(Math.random() * 3)
    if (def.bad) {
      // never wall off every lane at once
      const others = [0, 1, 2].filter((l) => l !== lane)
      const blocked = others.every((l) => s.obs.some((o) => o.def.bad && o.lane === l && o.x > s.W - 320))
      if (blocked) return
    }
    const el = document.createElement('div')
    el.className = 'ob'
    el.textContent = def.e
    layer.current.appendChild(el)
    s.obs.push({ el, type, def, lane, x: s.W + 30, y: LANES[lane] * s.H, vx: def.vx * (0.8 + Math.random() * 0.4), dead: false })
  }

  const tick = useCallback(
    (now) => {
      const s = g.current
      if (!s.running) return
      if (!s.last) s.last = now
      const dt = Math.min(0.05, (now - s.last) / 1000)
      s.last = now
      s.t += dt
      layoutBus()

      s.speed = Math.min(560, 280 + s.t * 4)
      s.dist += s.speed * dt
      s.score += dt * 8
      s.inv = Math.max(0, s.inv - dt)

      // progress along the route and "stops"
      const prog = Math.min(1, s.dist / TOTAL)
      barEl.current.style.width = prog * 100 + '%'
      const idx = Math.floor(prog * (stops.length - 1))
      if (idx > s.stopIdx) {
        s.stopIdx = idx
        s.score += 50
        say(`${stops[idx]} reached! +50`)
        setNextStop(stops[Math.min(idx + 1, stops.length - 1)])
      }
      if (prog >= 1) {
        scoreEl.current.textContent = Math.floor(s.score)
        finish(true)
        return
      }

      // bus movement between lanes
      s.y += (LANES[s.lane] * s.H - s.y) * Math.min(1, dt * 12)
      busEl.current.style.transform = `translate(${s.busX}px, ${s.y - s.busH + s.busH * 0.06}px)`
      busEl.current.style.opacity = s.inv > 0 && Math.floor(s.t * 12) % 2 ? 0.45 : 1

      // spawning
      s.spawnIn -= dt
      if (s.spawnIn <= 0) {
        spawn()
        s.spawnIn = (0.55 + Math.random() * 0.8) * (320 / s.speed)
      }

      // obstacles
      for (let i = s.obs.length - 1; i >= 0; i--) {
        const o = s.obs[i]
        o.x -= (s.speed - o.vx) * dt
        o.y += (LANES[o.lane] * s.H - o.y) * Math.min(1, dt * 8)
        o.el.style.transform = `translate(${o.x}px, ${o.y - SIZE}px)`

        if (!o.dead && Math.abs(o.y - s.y) < 14 && o.x < s.busX + s.busW - 20 && o.x + o.def.w > s.busX + 24) {
          if (o.def.bad) {
            if (s.inv <= 0) {
              s.lives -= 1
              s.inv = 1.3
              setLives(s.lives)
              say(CRASH[o.type])
              busIn.current.classList.remove('hit')
              void busIn.current.offsetWidth
              busIn.current.classList.add('hit')
              if (s.lives <= 0) {
                finish(false, CRASH[o.type])
                return
              }
            }
          } else {
            o.dead = true
            s.score += o.def.pts
            say(o.def.say)
            o.el.classList.add('pop')
          }
        }
        if (o.x < -90 || (o.dead && o.x < s.busX - 40)) {
          o.el.remove()
          s.obs.splice(i, 1)
        }
      }

      scoreEl.current.textContent = Math.floor(s.score)
      raf.current = requestAnimationFrame(tick)
    },
    [finish, say, stops]
  )

  const start = () => {
    const st = stage.current
    layer.current.innerHTML = ''
    const H = st.clientHeight
    g.current = {
      running: true, last: 0, t: 0, dist: 0, score: 0, lives: 3, inv: 0,
      lane: 1, y: LANES[1] * H, speed: 280, obs: [], spawnIn: 0.8, stopIdx: 0, W: 0, H, busW: 0, busH: 0, busX: 0,
    }
    setLives(3)
    setResult(null)
    setToast(null)
    setNextStop(stops[1] || stops[0])
    setStatus('running')
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
  }

  const move = useCallback((d) => {
    const s = g.current
    if (!s.running) return
    s.lane = clamp(s.lane + d, 0, 2)
  }, [])

  // keyboard, only while driving
  useEffect(() => {
    if (status !== 'running') return
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        move(-1)
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        move(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, move])

  // honking scares scooters and autos out of the way. Cows are unmoved.
  useEffect(() => {
    if (status !== 'running') return
    const onHonk = () => {
      const s = g.current
      let cow = false
      let scared = 0
      for (const o of s.obs) {
        const dx = o.x - (s.busX + s.busW)
        if (o.dead || dx < -20 || dx > 440 || Math.abs(o.y - s.y) > 24) continue
        if (o.def.honk === 'move') {
          o.lane = o.lane === 0 ? 1 : o.lane === 2 ? 1 : Math.random() < 0.5 ? 0 : 2
          scared += 1
        } else if (o.def.honk === 'ignore') cow = true
      }
      if (scared) say('Honk worked! They moved. Rare.')
      else if (cow) say('The cow heard you. The cow does not care.')
    }
    window.addEventListener('bk-honk', onHonk)
    return () => window.removeEventListener('bk-honk', onHonk)
  }, [status, say])

  return (
    <section className="drive" id="drive">
      <div className="section-head">
        <h2 className="title">Take the wheel</h2>
        <p className="muted">
          Drive a BKTravels coach from {stops[0]} to {stops[stops.length - 1]}. Dodge cows and potholes, grab chai, and honk
          at anything on two wheels.
        </p>
      </div>

      <div className="game" ref={stage}>
        <div className="g-sky" />
        <svg className="g-hills" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
          <path className="hill-a" d="M0 160 V90 Q80 40 170 80 T340 70 T520 95 T700 55 T880 90 T1060 60 T1200 85 V160 Z" />
          <path className="hill-b" d="M0 160 V120 Q120 85 240 115 T480 105 T720 120 T960 100 T1200 118 V160 Z" />
        </svg>
        <div className="g-road">
          <i className="g-dash d1" />
          <i className="g-dash d2" />
        </div>

        <div className="g-bus" ref={busEl}>
          <div className="g-bus-in" ref={busIn}>
            <Bus lights />
          </div>
        </div>
        <div className="g-layer" ref={layer} />

        <div className="g-hud">
          <div className="hud-pill">
            <span className="hud-label">Points</span>
            <b ref={scoreEl}>0</b>
          </div>
          <div className="hud-trip">
            <div className="hud-bar">
              <div ref={barEl} />
            </div>
            <span>Next stop: {nextStop}</span>
          </div>
          <div className="hud-pill hearts" aria-label={`${lives} lives left`}>
            <span className="hud-label">Patience</span>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < lives ? 'on' : ''}>
                ♥
              </span>
            ))}
          </div>
        </div>

        {toast && (
          <div key={toast.k} className="g-toast" role="status">
            {toast.text}
          </div>
        )}

        {status !== 'running' && (
          <div className="g-overlay">
            {status === 'idle' && (
              <>
                <h3>BKTravels Highway Simulator</h3>
                <p>
                  <kbd>↑</kbd> <kbd>↓</kbd> change lane &nbsp; <kbd>H</kbd> honk
                </p>
                <button className="btn btn-orange" onClick={start}>
                  Start driving
                </button>
              </>
            )}
            {(status === 'over' || status === 'won') && result && (
              <>
                <h3>{status === 'won' ? `${stops[stops.length - 1]}! You made it.` : 'Trip over'}</h3>
                {result.why && <p>{result.why}</p>}
                <p className="g-score">
                  <b>{result.score}</b> points · {result.rating}
                  {result.newBest && ' · New best!'}
                </p>
                <button className="btn btn-orange" onClick={start}>
                  Drive again
                </button>
              </>
            )}
            {best > 0 && status === 'idle' && <small>Your best: {best}</small>}
          </div>
        )}
      </div>

      <div className="g-controls">
        <button className="btn btn-outline" onClick={() => move(-1)} aria-label="Lane up" disabled={status !== 'running'}>
          ▲ Up
        </button>
        <button className="btn btn-outline" onClick={() => move(1)} aria-label="Lane down" disabled={status !== 'running'}>
          ▼ Down
        </button>
        <button className="btn btn-orange" onClick={honk}>
          Honk
        </button>
      </div>
    </section>
  )
}
