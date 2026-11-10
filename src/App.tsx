import { lazy, Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { resetScroll } from './lib/scroll';

const Markwave = lazy(() => import('./pages/Markwave'));
const Portal = lazy(() => import('./pages/Portal'));

/** A new page starts at its top, unless the address names a section to go to. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => { if (!hash) resetScroll(); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markwave" element={<Suspense fallback={null}><Markwave /></Suspense>} />
        <Route path="/portal" element={<Suspense fallback={null}><Portal /></Suspense>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
