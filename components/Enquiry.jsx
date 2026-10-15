'use client'

import { useState } from 'react'
import { CONTACT } from '../lib/config'
import { allTrips } from '../lib/routes'
import { API_URL, submitEnquiry } from '../lib/api'
import { clamp, todayISO } from '../lib/utils'

export default function Enquiry() {
  const trips = allTrips()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    direction: trips[0].label,
    date: '',
    passengers: 1,
    message: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | error
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const bump = (d) => setForm((f) => ({ ...f, passengers: clamp(Number(f.passengers) + d, 1, 40) }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!/^[+\d][\d\s-]{8,}$/.test(form.phone.trim())) e.phone = 'Enter a phone number we can call'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Check the email address'
    if (!form.date) e.date = 'Choose your travel date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const summary = () =>
    [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email || '-'}`,
      `Route: ${form.direction}`,
      `Travel date: ${form.date}`,
      `Passengers: ${form.passengers}`,
      `Message: ${form.message || '-'}`,
    ].join('\n')

  const submit = async (e) => {
    e.preventDefault()
    if (form.website) return // bot
    if (!validate()) return
    setStatus('sending')

    if (!API_URL) {
      // No API connected yet: open the visitor's email app with the enquiry filled in.
      const subject = `Seat enquiry: ${form.direction} on ${form.date}`
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary())}`
      setStatus('mailto')
      return
    }

    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        route: form.direction,
        travelDate: form.date,
        passengers: Number(form.passengers),
        message: form.message.trim() || null,
      })
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hello BKTravels, I would like to check seats.\n' + summary())}`

  if (status === 'sent' || status === 'mailto') {
    return (
      <section className="enquiry" id="enquiry">
        <div className="stub done" role="status">
          <svg viewBox="0 0 24 24" className="tick" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          <h2>{status === 'sent' ? 'Enquiry sent' : 'Your email app is opening'}</h2>
          <p>
            {status === 'sent'
              ? `Thanks ${form.name.split(' ')[0]}. We will call or message you on ${form.phone} with seat availability for ${form.direction} on ${form.date}.`
              : 'Press send in your email app to complete the enquiry. You can also reach us on WhatsApp.'}
          </p>
          <div className="hero-cta">
            <a className="btn btn-gold" href={wa} target="_blank" rel="noreferrer">
              Also message on WhatsApp
            </a>
            <button className="btn btn-ghost-dark" onClick={() => setStatus('idle')}>
              Send another enquiry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="enquiry" id="enquiry">
      <div className="enq-intro">
        <h2>Check seat availability</h2>
        <p>
          Fill in your trip and we will reply with the seats we have. Booking and payment are not on this site yet, so there
          is nothing to pay today.
        </p>
        <p className="muted small">{CONTACT.hours}</p>
      </div>

      <form className="stub" onSubmit={submit} noValidate>
        <fieldset className="dir">
          <legend>Route</legend>
          {trips.map((t) => (
            <label key={t.routeId + t.label} className={form.direction === t.label ? 'on' : ''}>
              <input type="radio" name="dir" checked={form.direction === t.label} onChange={() => setForm((f) => ({ ...f, direction: t.label }))} />
              {t.label}
              {t.status === 'soon' && <em> (soon)</em>}
            </label>
          ))}
        </fieldset>

        <div className="row">
          <div className={`field ${errors.name ? 'bad' : ''}`}>
            <label htmlFor="name">Your name</label>
            <input id="name" value={form.name} onChange={set('name')} autoComplete="name" />
            {errors.name && <em>{errors.name}</em>}
          </div>
          <div className={`field ${errors.phone ? 'bad' : ''}`}>
            <label htmlFor="phone">Phone number</label>
            <input id="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />
            {errors.phone && <em>{errors.phone}</em>}
          </div>
        </div>

        <div className="row">
          <div className={`field ${errors.date ? 'bad' : ''}`}>
            <label htmlFor="date">Travel date</label>
            <input id="date" type="date" min={todayISO()} value={form.date} onChange={set('date')} />
            {errors.date && <em>{errors.date}</em>}
          </div>
          <div className="field">
            <label htmlFor="pax">Passengers</label>
            <div className="stepper">
              <button type="button" onClick={() => bump(-1)} aria-label="Fewer passengers">
                −
              </button>
              <input id="pax" value={form.passengers} readOnly />
              <button type="button" onClick={() => bump(1)} aria-label="More passengers">
                +
              </button>
            </div>
          </div>
        </div>

        <div className={`field ${errors.email ? 'bad' : ''}`}>
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
          {errors.email && <em>{errors.email}</em>}
        </div>

        <div className="field">
          <label htmlFor="msg">Pickup point or anything else we should know</label>
          <textarea id="msg" rows="3" value={form.message} onChange={set('message')} />
        </div>

        <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} />

        {status === 'error' && (
          <p className="error" role="alert">
            The enquiry could not be sent. Check your connection and try again, or call {CONTACT.phones[0]}.
          </p>
        )}

        <div className="stub-actions">
          <button className="btn btn-gold" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
          </button>
          <a className="btn btn-ghost-dark" href={wa} target="_blank" rel="noreferrer">
            WhatsApp instead
          </a>
        </div>
      </form>
    </section>
  )
}
