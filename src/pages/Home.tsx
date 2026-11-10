import { useEffect } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Work from '../components/Work';
import Lab from '../components/Lab';
import Film from '../components/Film';
import Process from '../components/Process';
import About from '../components/About';
import Brief from '../components/Brief';
import Footer from '../components/Footer';
import { startSmoothScroll, scrollTo } from '../lib/scroll';

export default function Home() {
  useEffect(() => {
    startSmoothScroll();
    // Arriving on /#section (for example from the portal): go there once the page has laid out.
    if (location.hash.length > 1) {
      const id = setTimeout(() => scrollTo(location.hash), 80);
      return () => clearTimeout(id);
    }
  }, []);
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Lab />
        <Film />
        <Process />
        <About />
        <Brief />
      </main>
      <Footer />
    </>
  );
}
