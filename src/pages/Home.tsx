import { useEffect } from 'react';
import Hero from '../components/Hero';
import Work from '../components/Work';
import Process from '../components/Process';
import Capabilities from '../components/Capabilities';
import About from '../components/About';
import Brief from '../components/Brief';
import Footer from '../components/Footer';
import { startSmoothScroll, scrollTo } from '../lib/scroll';

export default function Home() {
  useEffect(() => {
    startSmoothScroll();
    if (location.hash) setTimeout(() => scrollTo(location.hash), 50);
  }, []);
  return (
    <>
      <main>
        <Hero />
        <Work />
        <Process />
        <Capabilities />
        <About />
        <Brief />
      </main>
      <Footer />
    </>
  );
}
