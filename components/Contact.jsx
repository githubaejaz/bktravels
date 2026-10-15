import { BRAND, CONTACT, ROUTES } from '../lib/config'
import { tel } from '../lib/utils'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-info">
        <h2>Visit or call the office</h2>
        <dl>
          <dt>Phone</dt>
          <dd>
            {CONTACT.phones.map((p) => (
              <a key={p} href={tel(p)}>
                {p}
              </a>
            ))}
          </dd>
          <dt>WhatsApp</dt>
          <dd>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
              Message us
            </a>
          </dd>
          {CONTACT.instagram && (
            <>
              <dt>Instagram</dt>
              <dd>
                <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
                  @bk_travels_5522
                </a>
              </dd>
            </>
          )}
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </dd>
          <dt>Office address</dt>
          <dd>
            {CONTACT.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </dd>
          <dt>Hours</dt>
          <dd>{CONTACT.hours}</dd>
        </dl>
        <a
          className="btn btn-gold"
          target="_blank"
          rel="noreferrer"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapQuery)}`}
        >
          Get directions
        </a>
      </div>
      <div className="map">
        <iframe
          title="BKTravels office location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&output=embed`}
        />
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()} {BRAND.name}. Daily bus service on {ROUTES.map((r) => `${r.from} ⇄ ${r.to}`).join(', ')}. {BRAND.tagline}.
      </span>
      <a href="#top">Back to top</a>
    </footer>
  )
}

export function QuickBar() {
  return (
    <div className="quickbar">
      <a href={tel(CONTACT.phones[0])}>Call</a>
      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <a href="#enquiry" className="gold">
        Check seats
      </a>
    </div>
  )
}
