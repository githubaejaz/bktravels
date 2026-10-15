import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Route from '../components/Route'
import Interior from '../components/Interior'
import Drive from '../components/Drive'
import Why from '../components/Why'
import Gallery from '../components/Gallery'
import Enquiry from '../components/Enquiry'
import { Contact, Footer, QuickBar } from '../components/Contact'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Route />
        <Interior />
        <Drive />
        <Why />
        <Gallery />
        <Enquiry />
        <Contact />
      </main>
      <Footer />
      <QuickBar />
    </>
  )
}
