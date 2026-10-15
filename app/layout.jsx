import './globals.css'

export const metadata = {
  title: 'BKTravels | Daily bus service Mumbai to Palanpur',
  description:
    'BKTravels runs a daily bus between Mumbai and Palanpur, both ways. Travel in comfort. Send an enquiry to check seat availability.',
  icons: { icon: '/favicon.svg' },
}

export const viewport = { themeColor: '#17692f' }

/* Sets day/night mode before the page paints, so there is no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem('bk-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DotGothic16&family=Mukta:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
