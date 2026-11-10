import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projects, tuner } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { prefersReducedMotion, scrollTo } from '../lib/scroll';
import { SevenSeg, Silk, Traces } from './board';

// A resonant antenna: the knob moves the coil's resonance across the dial. The response at a
// project's frequency follows the tank's Q, so the trace swells only close to resonance.
const Q = 18;
const [F_MIN, F_MAX] = tuner.range;
const LOCK = 0.9; // response needed to count as locked (about ±1.8 kHz)
const HOLD_MS = 700; // how long the lock must hold before the project opens
const OPEN_MS = 1300; // the opening sequence
const STEP = 0.2; // kHz per arrow key
const KEY = 'pjn-unlocked';

const clamp = (f: number) => Math.min(F_MAX, Math.max(F_MIN, f));
const response = (f: number, target: number) => {
  const d = target / f - f / target;
  return 1 / Math.sqrt(1 + Q * Q * d * d);
};
const at = (f: number) => `${((f - F_MIN) / (F_MAX - F_MIN)) * 100}%`;

function readUnlocked(): string[] {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch { return []; }
}

/**
 * The gate to the work. A visitor tunes the coil to a project's frequency; when the carrier locks
 * and holds, that project opens. "Auto-tune" does the same sweep for anyone who would rather
 * watch, the keyboard works on the knob, and a project opened once stays open for the visit.
 */
export default function Tuner() {
  const head = useReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [freq, setFreq] = useState(tuner.start);
  const [dragging, setDragging] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>(readUnlocked);
  const sweep = useRef(0);

  // The strongest station at this frequency decides what the scope shows.
  const best = projects.reduce((a, b) => (response(freq, b.khz) > response(freq, a.khz) ? b : a));
  const amp = response(freq, best.khz);
  const locked = amp >= LOCK;
  const state = opening ? 'opening' : locked ? 'locked' : amp >= 0.45 ? 'near' : 'off';
  const bars = Math.round(amp * 12);

  const level = useRef(amp);
  const target = useRef(amp);
  target.current = amp;

  // ---- the trace
  useEffect(() => {
    const cv = canvas.current;
    const g = cv?.getContext('2d');
    if (!cv || !g) return;
    const still = prefersReducedMotion();
    let raf = 0, visible = false, w = 0, h = 0, dpr = 1;

    const draw = (now: number) => {
      const a = level.current;
      g.clearRect(0, 0, w, h);
      g.fillStyle = 'rgba(214, 222, 235, 0.22)';
      const cols = 12, rows = 6, r = Math.max(1, dpr);
      for (let i = 1; i < cols; i++) for (let j = 1; j < rows; j++) g.fillRect((w * i) / cols - r / 2, (h * j) / rows - r / 2, r, r);
      const cycles = Math.max(18, Math.round(w / (16 * dpr)));
      const t = still ? 0 : now / 1000;
      const reach = h * 0.4 * (0.05 + 0.95 * a);
      g.beginPath();
      for (let x = 0; x <= w; x += Math.max(1, dpr / 2)) {
        const u = x / w;
        const ripple = 1 + 0.06 * Math.sin(u * 37 + t * 2.1) + 0.04 * Math.sin(u * 91 - t * 3.3);
        const y = h / 2 + Math.sin(u * cycles * 2 * Math.PI + t * 6) * reach * ripple;
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.lineWidth = 1.6 * dpr;
      g.lineJoin = 'round';
      g.strokeStyle = '#f5e21a';
      g.stroke();
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
      h = cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
      draw(performance.now());
    };
    const tick = (now: number) => {
      level.current += (target.current - level.current) * 0.14;
      draw(now);
      raf = visible && !still ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf && visible && !still) raf = requestAnimationFrame(tick); };
    const onTune = () => { if (still) { level.current = target.current; draw(0); } else wake(); };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: '80px' });
    io.observe(cv);
    cv.addEventListener('tune', onTune);
    size();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cv.removeEventListener('tune', onTune); };
  }, []);
  useEffect(() => { canvas.current?.dispatchEvent(new Event('tune')); }, [freq]);

  // ---- lock, hold, open
  useEffect(() => {
    if (!locked || dragging || opening) return;
    const id = setTimeout(() => setOpening(best.id), HOLD_MS);
    return () => clearTimeout(id);
  }, [locked, dragging, opening, best.id]);

  useEffect(() => {
    if (!opening) return;
    const p = projects.find((x) => x.id === opening);
    if (!p) return;
    const id = setTimeout(() => {
      const next = Array.from(new Set([...unlocked, p.id]));
      try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private window: stays unlocked for this page only */ }
      setUnlocked(next);
      navigate(p.path);
    }, prefersReducedMotion() ? 300 : OPEN_MS);
    return () => clearTimeout(id);
    // The sequence runs once per lock; it must not restart when the unlocked list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening]);

  // Turning the knob away cancels an opening in progress.
  const tune = useCallback((f: number) => {
    cancelAnimationFrame(sweep.current);
    setOpening(null);
    setFreq(clamp(Math.round(f * 100) / 100));
  }, []);

  // ---- the knob: drag sideways or up, or use the keyboard
  const drag = useRef<{ x: number; y: number; f: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, f: freq };
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const travel = (e.clientX - d.x) - (e.clientY - d.y);
    tune(d.f + travel * (e.shiftKey ? 0.03 : 0.12));
  };
  const onUp = () => { drag.current = null; setDragging(false); };
  const onKey = (e: React.KeyboardEvent) => {
    const by: Record<string, number> = { ArrowRight: STEP, ArrowUp: STEP, ArrowLeft: -STEP, ArrowDown: -STEP, PageUp: 2, PageDown: -2 };
    if (e.key in by) tune(freq + by[e.key]);
    else if (e.key === 'Home') tune(F_MIN);
    else if (e.key === 'End') tune(F_MAX);
    else return;
    e.preventDefault();
  };

  // ---- auto-tune: sweep to the nearest project nobody has opened yet
  const auto = () => {
    const goal = (projects.find((p) => !unlocked.includes(p.id)) ?? projects[0]).khz;
    setOpening(null);
    cancelAnimationFrame(sweep.current);
    if (prefersReducedMotion()) { setFreq(goal); return; }
    const from = freq;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 1500);
      const eased = 1 - Math.pow(1 - k, 3);
      // A little overshoot, the way a hand finds a station.
      setFreq(clamp(from + (goal - from) * eased + Math.sin(k * Math.PI) * 2.2 * (1 - k)));
      if (k < 1) sweep.current = requestAnimationFrame(step); else setFreq(goal);
    };
    sweep.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(sweep.current), []);

  const turn = ((freq - F_MIN) / (F_MAX - F_MIN)) * 270 - 135;
  const ticks = [];
  for (let f = F_MIN; f <= F_MAX; f += 5) ticks.push(f);
  const opened = projects.find((p) => p.id === opening);

  return (
    <section className="tune board" id="projects">
      <Traces seed={7} fill={0.5} />
      <div className="tune-grid">
        <div className="tune-copy reveal" ref={head}>
          <Silk mark="J2">Projects</Silk>
          <h2 className="poster">{tuner.heading}</h2>
          <p className="lead">{tuner.text}</p>

          <div className="channels">
            <h3>{tuner.channelsTitle}</h3>
            <ol>
              {projects.map((p) => {
                const isOpen = unlocked.includes(p.id);
                return (
                  <li key={p.id} className={isOpen ? 'is-open' : ''}>
                    <i className={'led' + (isOpen ? ' on' : '')} aria-hidden="true" />
                    <span className="ch-name">{p.name}</span>
                    <span className="ch-what">{p.khz.toFixed(2)} {tuner.unit} · {p.what}</span>
                    {isOpen
                      ? <Link className="ch-go" to={p.path}>{tuner.open}</Link>
                      : <span className="ch-go is-locked">{tuner.locked}</span>}
                  </li>
                );
              })}
              <li>
                <i className="led" aria-hidden="true" />
                <span className="ch-name">{tuner.free.name}</span>
                <span className="ch-what">{tuner.free.what}</span>
                <a className="ch-go" href={tuner.free.href} onClick={(e) => { e.preventDefault(); scrollTo(tuner.free.href); }}>{tuner.free.action}</a>
              </li>
            </ol>
          </div>
        </div>

        <div className={'rig is-' + state} data-ui>
          <div className="rig-scope">
            <canvas ref={canvas} aria-hidden="true" />
            <p className="rig-state" role="status">
              {state === 'opening' ? `${tuner.states.opening} ${opened?.name ?? ''}` : tuner.states[state]}
              {state === 'opening' && <i className="rig-progress" aria-hidden="true" />}
            </p>
          </div>

          <div className="rig-dial" aria-hidden="true">
            <div className="rig-scale">
            {ticks.map((f) => (
              <span key={f} className={'tick' + (f % 10 === 0 ? ' major' : '')} style={{ left: at(f) }}>
                {f % 10 === 0 && <em>{f}</em>}
              </span>
            ))}
            {projects.map((p) => (
              <span key={p.id} className={'station' + (unlocked.includes(p.id) ? ' is-open' : '')} style={{ left: at(p.khz) }}>
                <em>{p.name}</em>
              </span>
            ))}
            <span className="needle" style={{ left: at(freq) }} />
            </div>
          </div>

          <div className="rig-row">
            <div className="rig-read">
              <SevenSeg value={freq.toFixed(1).padStart(5, ' ')} label={`${freq.toFixed(1)} kilohertz`} />
              <span>{tuner.unit}</span>
            </div>

            <div className="rig-meter">
              <span>{tuner.signal}</span>
              <span className="meter" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => <i key={i} className={i < bars ? 'on' : ''} />)}
              </span>
            </div>

            <div className="rig-knob">
              <div className={'knob' + (dragging ? ' is-held' : '')} role="slider" tabIndex={0}
                aria-label={tuner.knob} aria-valuemin={F_MIN} aria-valuemax={F_MAX} aria-valuenow={Number(freq.toFixed(1))}
                aria-valuetext={`${freq.toFixed(1)} kilohertz`}
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}>
                <span className="knob-cap" style={{ rotate: `${turn}deg` }} />
              </div>
              <span className="knob-label">{tuner.knob}</span>
            </div>

            <button type="button" className="tact" onClick={auto}>{tuner.auto}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
