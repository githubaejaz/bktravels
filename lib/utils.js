export const clamp = (n, a, b) => Math.min(b, Math.max(a, n))
export const tel = (s) => 'tel:' + s.replace(/[^+\d]/g, '')
export const todayISO = () => new Date().toISOString().slice(0, 10)
