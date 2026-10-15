import { useId } from 'react'

const BODY =
  'M24 40 Q24 14 54 14 H452 Q496 14 516 60 L534 112 Q538 126 534 140 V150 Q534 158 524 158 H36 Q24 158 24 146 Z'

/* BKTravels coach, side view, facing right. Colours come from the real bus:
   white body, forest green, lime, orange stripe, dark glass with a warm LED strip. */
export default function Bus({ lights = false, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const clip = `bc-${uid}`
  const glass = `gl-${uid}`
  const beam = `bm-${uid}`
  const windows = [0, 1, 2, 3, 4, 5, 6].map((i) => 44 + i * 52)

  return (
    <svg viewBox="0 0 560 190" className={`bus ${className}`} role="img" aria-label="BKTravels coach" overflow="visible">
      <defs>
        <clipPath id={clip}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a403a" />
          <stop offset="1" stopColor="#1c1816" />
        </linearGradient>
        <linearGradient id={beam} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFF0C2" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFF0C2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {lights && <path className="beam" d="M538 132 L900 84 L900 188 L538 144 Z" fill={`url(#${beam})`} />}

      {/* roof AC unit */}
      <rect x="150" y="7" width="150" height="9" rx="4.5" fill="#D9DDD6" />

      {/* white body */}
      <path d={BODY} fill="#F7F7F2" />

      <g clipPath={`url(#${clip})`}>
        {/* the three swooshes from the real livery: black, forest green, lime */}
        <path d="M24 158 V112 Q60 126 130 138 T300 144 T540 138 V158 Z" fill="#14181A" />
        <path d="M24 158 V132 Q70 142 140 148 T300 152 T540 148 V158 Z" fill="#17692F" />
        <path d="M24 158 V148 Q90 152 160 154 T320 156 T540 154 V158 Z" fill="#A4CC3B" />
        {/* orange stripe */}
        <rect x="0" y="84" width="560" height="8" fill="#F28C28" />
      </g>

      {/* dark window band with decal lettering */}
      <rect x="36" y="22" width="372" height="56" rx="8" fill="#2A2420" />
      {windows.map((x) => (
        <g key={x}>
          <rect x={x} y="27" width="46" height="46" rx="5" fill={`url(#${glass})`} />
          <rect x={x} y="27" width="46" height="46" rx="5" fill="#FFD9A0" className="bus-glow" />
        </g>
      ))}
      <text
        x="52"
        y="62"
        fontFamily="'Bricolage Grotesque', Arial, sans-serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="4"
        fill="#fff"
        opacity=".9"
      >
        BKTRAVELS
      </text>
      <rect x="40" y="75" width="364" height="3" rx="1.5" fill="#FFE3A8" className="bus-led" />

      {/* door and windshield */}
      <rect x="414" y="26" width="40" height="124" rx="6" fill="#1F2A24" stroke="#F28C28" strokeWidth="2" />
      <rect x="420" y="32" width="28" height="60" rx="4" fill={`url(#${glass})`} />
      <path d="M462 26 H484 Q512 32 524 66 L532 90 H462 Z" fill={`url(#${glass})`} />
      <rect x="472" y="31" width="42" height="9" rx="2" fill="#FFB84D" className="bus-led" />
      <rect x="522" y="62" width="8" height="22" rx="3" fill="#14181A" />

      {/* brand text, as on the real bus */}
      <text
        x="70"
        y="116"
        fontFamily="'Bricolage Grotesque', Arial, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="1.5"
        fill="#17692F"
      >
        B.K. TRAVELS
      </text>
      <text x="72" y="130" fontFamily="'Mukta', Arial, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="1.4" fill="#14181A">
        TRAVEL IN COMFORT
      </text>

      {/* lights */}
      <rect x="526" y="128" width="12" height="14" rx="4" fill="#FFF3C4" />
      <rect x="22" y="118" width="6" height="18" rx="2" fill="#E5383B" />

      {/* wheels: tandem rear axle, single front axle */}
      {[96, 140, 392].map((cx) => (
        <circle key={`a${cx}`} cx={cx} cy="156" r="29" fill="#0D0F0E" />
      ))}
      {[96, 140, 392].map((cx) => (
        <g key={cx} className="wheel" style={{ transformOrigin: `${cx}px 156px` }}>
          <circle cx={cx} cy="156" r="24" fill="#17191A" />
          <circle cx={cx} cy="156" r="13" fill="#D4D8D2" />
          <circle cx={cx} cy="156" r="4" fill="#17191A" />
          {[0, 60, 120].map((a) => (
            <line key={a} x1={cx} y1="145" x2={cx} y2="167" stroke="#17191A" strokeWidth="3" transform={`rotate(${a} ${cx} 156)`} />
          ))}
        </g>
      ))}
    </svg>
  )
}
