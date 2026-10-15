/* Talks to the ASP.NET Core API (to be built next).
   Contract:  POST {NEXT_PUBLIC_API_URL}/api/enquiries   (JSON)
   Body: { name, phone, email, route, travelDate, passengers, message }
   Success: any 2xx response.                                             */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

export async function submitEnquiry(data) {
  const res = await fetch(`${API_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Enquiry failed (${res.status})`)
}
