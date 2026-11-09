import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const Portal = lazy(() => import('./pages/Portal'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portal" element={<Suspense fallback={null}><Portal /></Suspense>} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
