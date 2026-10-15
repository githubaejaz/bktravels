/* ------------------------------------------------------------------
   BKTravels: everything you will want to edit lives in this file.
   Search for "EDIT" to find values that must be replaced.
------------------------------------------------------------------- */

export const BRAND = {
  name: 'BKTravels',
  tagline: 'Travel in comfort',
}

export const CONTACT = {
  // EDIT: your real details
  phones: ['+91 98765 43210', '+91 98765 43211'],
  whatsapp: '919876543210', // country code + number, no + or spaces
  email: 'bktravels@example.com',
  address: [
    'BKTravels Booking Office',
    'Shop No. __, Building / Road name',
    'Near Landmark, Mumbai, Maharashtra 400000',
  ],
  // Used for the Google Map on the contact section
  mapQuery: 'Borivali, Mumbai, Maharashtra',
  hours: 'Office open daily, 8:00 AM to 10:00 PM',
  // Instagram page shown in the contact section
  instagram: 'https://www.instagram.com/bk_travels_5522/',
}

/* ------------------------------------------------------------------
   ROUTES
   Every route listed here automatically appears in: the route tracker
   (with tabs), the enquiry form, the LED destination board and the
   "drive the bus" game.

   TO ADD A NEW ROUTE LATER: copy one block below, change the values,
   and put it inside the list. Nothing else needs to change.
   status: 'live'  -> running now
           'soon'  -> shows a "Starting soon" badge
------------------------------------------------------------------- */
export const ROUTES = [
  {
    id: 'mumbai-palanpur',
    from: 'Mumbai',
    to: 'Palanpur',
    status: 'live',
    // EDIT the stops to match your real pickup / drop points
    stops: [
      { name: 'Mumbai', note: 'Starting point' },
      { name: 'Vapi', note: 'Pickup and drop on request' },
      { name: 'Surat', note: 'Pickup and drop on request' },
      { name: 'Vadodara', note: 'Pickup and drop on request' },
      { name: 'Ahmedabad', note: 'Pickup and drop on request' },
      { name: 'Mehsana', note: 'Pickup and drop on request' },
      { name: 'Palanpur', note: 'Final stop' },
    ],
    // EDIT the times to match your real schedule (one entry per direction)
    trips: [
      { from: 'Mumbai', to: 'Palanpur', departs: '7:00 PM', arrives: 'Early morning', pickup: 'Pickup points in Mumbai confirmed on call' },
      { from: 'Palanpur', to: 'Mumbai', departs: '7:00 PM', arrives: 'Early morning', pickup: 'Pickup points in Palanpur confirmed on call' },
    ],
  },

  /* EXAMPLE of a future route (remove the comment marks to use it):
  {
    id: 'mumbai-ahmedabad',
    from: 'Mumbai',
    to: 'Ahmedabad',
    status: 'soon',
    stops: [
      { name: 'Mumbai', note: 'Starting point' },
      { name: 'Surat', note: 'Pickup and drop on request' },
      { name: 'Ahmedabad', note: 'Final stop' },
    ],
    trips: [
      { from: 'Mumbai', to: 'Ahmedabad', departs: '8:00 PM', arrives: 'Early morning', pickup: 'Confirmed on call' },
      { from: 'Ahmedabad', to: 'Mumbai', departs: '8:00 PM', arrives: 'Early morning', pickup: 'Confirmed on call' },
    ],
  },
  */
]

export const FEATURES = [
  { icon: 'clock', title: 'Daily departures', text: 'Our coaches run every day. Check the route section for timings and pickup points.' },
  { icon: 'chat', title: 'Ask first, nothing to pay online', text: 'Send an enquiry and we tell you what seats are available. No booking or payment happens on this site.' },
  { icon: 'pin', title: 'Pickup points along the way', text: 'Tell us where you will board and get off. We confirm the nearest stop for you.' },
  { icon: 'phone', title: 'A real person replies', text: 'Call or WhatsApp the office any time during office hours for urgent trips.' },
]

/* ------------------------------------------------------------------
   GALLERY
   1. Copy your own bus photos / videos into  public/gallery/
   2. List them below. (Files that are missing show an illustrated
      BKTravels bus instead, so the page never looks broken.)
   type: 'image'   -> src
   type: 'video'   -> src (mp4), optional poster (image)
   type: 'youtube' -> id  (the part after v= in a YouTube link)
------------------------------------------------------------------- */
export const GALLERY = [
  { type: 'image', src: '/gallery/bus-1.jpg', caption: 'BKTravels coach, travel in comfort' },
  { type: 'video', src: '/gallery/journey-1.mp4', poster: '/gallery/journey-1.jpg', caption: 'Ride along on a BKTravels coach' },
  { type: 'image', src: '/gallery/bus-2.jpg', caption: 'On the highway at sunrise' },
  { type: 'image', src: '/gallery/bus-3.jpg', caption: 'Boarding at the pickup point' },
  { type: 'image', src: '/gallery/bus-4.jpg', caption: 'Inside the coach' },
  { type: 'video', src: '/gallery/journey-2.mp4', poster: '/gallery/journey-2.jpg', caption: 'A quick tour of the bus' },
  { type: 'image', src: '/gallery/bus-5.jpg', caption: 'Arriving at the destination' },
  { type: 'image', src: '/gallery/bus-6.jpg', caption: 'BKTravels fleet' },
  // { type: 'youtube', id: 'dQw4w9WgXcQ', caption: 'Our channel video' },
]
