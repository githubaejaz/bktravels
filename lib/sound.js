/* A two-tone bus horn made with the Web Audio API (no sound files needed). */
let ctx = null
let lastHonk = 0

export function honk() {
  const now = Date.now()
  if (now - lastHonk < 250) return
  lastHonk = now

  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) {
      ctx = ctx || new AC()
      if (ctx.state === 'suspended') ctx.resume()
      const t0 = ctx.currentTime

      const out = ctx.createGain()
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 2200
      out.connect(lp)
      lp.connect(ctx.destination)

      // two pulses: "pa-paaam"
      const pulses = [
        [0, 0.2],
        [0.28, 0.5],
      ]
      pulses.forEach(([start, len]) => {
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t0 + start)
        g.gain.exponentialRampToValueAtTime(0.22, t0 + start + 0.025)
        g.gain.setValueAtTime(0.22, t0 + start + len - 0.06)
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len)
        g.connect(out)
        ;[392, 494].forEach((f, i) => {
          const o = ctx.createOscillator()
          o.type = 'sawtooth'
          o.frequency.value = f * (i ? 1.006 : 1)
          o.connect(g)
          o.start(t0 + start)
          o.stop(t0 + start + len + 0.02)
        })
      })
    }
  } catch (e) {
    /* sound is a bonus: never break the page */
  }
  window.dispatchEvent(new CustomEvent('bk-honk'))
}
