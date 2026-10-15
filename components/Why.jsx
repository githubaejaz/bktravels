import { FEATURES } from '../lib/config'

const ICONS = {
  clock: <path d="M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  pin: <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  phone: <path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
}

export default function Why() {
  return (
    <section className="why" id="why">
      <h2>Plan the trip with one message</h2>
      <div className="why-grid">
        {FEATURES.map((f) => (
          <div className="why-item" key={f.title}>
            <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
              {ICONS[f.icon]}
            </svg>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
