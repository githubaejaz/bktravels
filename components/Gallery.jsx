'use client'

import { useEffect, useState } from 'react'
import Bus from './Bus'
import { GALLERY } from '../lib/config'

function BusArt({ n = 0 }) {
  return (
    <div className={`art sky-${n % 4}`}>
      <div className="art-road" />
      <Bus lights={n % 4 === 3} />
    </div>
  )
}

function Media({ item, n, big = false }) {
  const [failed, setFailed] = useState(false)
  const src = item.type === 'video' ? item.poster : item.type === 'youtube' ? `https://img.youtube.com/vi/${item.id}/hqdefault.jpg` : item.src
  if (!src || failed) return <BusArt n={n} />
  return <img src={src} alt={item.caption} loading={big ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
}

function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index]
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', key)
      document.body.style.overflow = ''
    }
  }, [onClose, onNav])

  const [videoFailed, setVideoFailed] = useState(false)
  useEffect(() => setVideoFailed(false), [index])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        className="lb-nav prev"
        onClick={(e) => {
          e.stopPropagation()
          onNav(-1)
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <figure onClick={(e) => e.stopPropagation()}>
        <div className="lb-stage">
          {item.type === 'video' && !videoFailed ? (
            <video src={item.src} poster={item.poster} controls autoPlay playsInline onError={() => setVideoFailed(true)} />
          ) : item.type === 'youtube' ? (
            <iframe
              src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0`}
              title={item.caption}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : item.type === 'video' ? (
            <div className="lb-missing">
              <BusArt n={index} />
              <p>Add your video file at {item.src} to play it here.</p>
            </div>
          ) : (
            <Media item={item} n={index} big />
          )}
        </div>
        <figcaption>{item.caption}</figcaption>
      </figure>
      <button
        className="lb-nav next"
        onClick={(e) => {
          e.stopPropagation()
          onNav(1)
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const indexed = GALLERY.map((g, n) => ({ ...g, n }))
  const items = indexed.filter((g) => filter === 'all' || (filter === 'video' ? g.type !== 'image' : g.type === 'image'))

  const nav = (d) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length))

  return (
    <section className="gallery" id="gallery">
      <div className="gallery-head">
        <h2>On the road with BKTravels</h2>
        <div className="toggle dark" role="group" aria-label="Filter gallery">
          {[
            ['all', 'All'],
            ['image', 'Photos'],
            ['video', 'Videos'],
          ].map(([v, l]) => (
            <button key={v} className={filter === v ? 'on' : ''} onClick={() => setFilter(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="masonry">
        {items.map((g, k) => (
          <button key={g.src || g.id} className={`tile t${g.n % 5}`} onClick={() => setOpen(k)} aria-label={`Open: ${g.caption}`}>
            <Media item={g} n={g.n} />
            {g.type !== 'image' && (
              <span className="play" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7Z" />
                </svg>
              </span>
            )}
            <span className="cap">{g.caption}</span>
          </button>
        ))}
      </div>

      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onNav={nav} />}
    </section>
  )
}
