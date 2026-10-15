import { ROUTES } from './config'

/* Every direction of every route, flattened: used by the enquiry form and the LED board. */
export const allTrips = () =>
  ROUTES.flatMap((r) =>
    r.trips.map((t) => ({ ...t, routeId: r.id, status: r.status, label: `${t.from} → ${t.to}` }))
  )
