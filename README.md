# BKTravels web (Next.js, App Router): Mumbai <-> Palanpur

Theme taken from the real coach: white body, forest green, lime, orange stripe, charcoal glass.
Enquiry only (no booking, no payment).

## Run
```
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## What is on the page
- Day / night switch in the top bar (remembers the visitor's choice, follows the phone's setting first time)
- LED destination board + "HORN OK PLEASE". Press the Honk button or the H key to honk (sound is generated in the browser)
- Route tracker: scroll and the bus drives down the highway, stops light up
- Inside the coach: animated passengers, tap them. Tap the driver to honk
- Take the wheel: a lane-dodging driving game (cows ignore the horn, scooters and autos do not)
- Gallery with photos and videos, enquiry form, contact, map, Instagram link

## Add a new route later
Open `lib/config.js`, find `ROUTES`, and copy the example block (it is commented out under the real route).
Fill in from / to / stops / trips and set `status: 'live'` or `'soon'`.
The new route automatically gets: a tab in the route section, a line in the hero, entries in the enquiry form,
and the LED board. Nothing else to change.

## Edit your details
`lib/config.js`: phones, WhatsApp, email, address, map, Instagram, timings, stops, gallery list (look for EDIT).

## Photos and videos
Copy files into `public/gallery/` and list them in `GALLERY`. `bus-1.jpg` (your real bus photo) is already there.
Missing files show an illustrated coach instead.

## Connect the ASP.NET API later
Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:5000`.
The form then sends POST {url}/api/enquiries with JSON { name, phone, email, route, travelDate, passengers, message }.
With no API set, the form opens the visitor's email app with the enquiry filled in.

## Files
app/layout.jsx, app/page.jsx, app/globals.css
components/ Bus, Nav, ThemeToggle, Hero, Route, Interior, Drive, Why, Gallery, Enquiry, Contact
lib/ config.js, routes.js, sound.js, fun.js, api.js, utils.js
