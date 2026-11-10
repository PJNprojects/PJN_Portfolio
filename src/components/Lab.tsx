import { useEffect, useRef, useState } from 'react';
import { lab } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { prefersReducedMotion } from '../lib/scroll';

// A series resonant antenna: fixed coil, adjustable capacitor, fixed drive frequency.
// f_res = f_drive / sqrt(C / C_tuned); response falls off either side of resonance by the tank's Q.
const Q = 18;
const C_MIN = 0.55;
const C_MAX = 1.65;
const START = 78; // slider position the visitor starts from, well off tune
const LOCK = 0.9;

function tank(trim: number) {
  const c = C_MIN + (trim / 100) * (C_MAX - C_MIN);
  const resonance = lab.drive / Math.sqrt(c);
  const detune = lab.drive / resonance - resonance / lab.drive;
  const amp = 1 / Math.sqrt(1 + Q * Q * detune * detune);
  return { resonance, amp };
}

/**
 * The live thing on the page: a working model of tuning a reader antenna. The trace is drawn on a
 * canvas; the readouts and the slider are ordinary HTML, so it works with a thumb and a keyboard.
 */
export default function Lab() {
  const head = useReveal<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [trim, setTrim] = useState(START);
  const level = useRef(tank(START).amp); // what the trace is drawing, eased toward the target
  const target = useRef(level.current);

  const { resonance, amp } = tank(trim);
  target.current = amp;
  const state = amp >= LOCK ? 'locked' : amp >= 0.45 ? 'near' : 'off';
  const bars = Math.round(amp * 12);

  useEffect(() => {
    const cv = canvas.current;
    const g = cv?.getContext('2d');
    if (!cv || !g) return;
    const still = prefersReducedMotion();
    let raf = 0;
    let visible = false;
    let w = 0, h = 0, dpr = 1;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(cv.clientWidth * dpr));
      h = Math.max(1, Math.round(cv.clientHeight * dpr));
      cv.width = w;
      cv.height = h;
      draw(performance.now());
    };

    const draw = (now: number) => {
      const a = level.current;
      g.clearRect(0, 0, w, h);
      // Graticule: dots at the divisions, as on the instrument.
      g.fillStyle = 'rgba(214, 222, 235, 0.22)';
      const cols = 12, rows = 8, r = Math.max(1, dpr);
      for (let i = 1; i < cols; i++) for (let j = 1; j < rows; j++) g.fillRect((w * i) / cols - r / 2, (h * j) / rows - r / 2, r, r);
      // Carrier: fixed frequency, height set by how close the tank is to resonance.
      const cycles = Math.max(18, Math.round(w / (16 * dpr)));
      const t = still ? 0 : now / 1000;
      const mid = h / 2;
      const reach = h * 0.4 * (0.05 + 0.95 * a);
      g.beginPath();
      const stepX = Math.max(1, dpr / 2);
      for (let x = 0; x <= w; x += stepX) {
        const u = x / w;
        const ripple = 1 + 0.06 * Math.sin(u * 37 + t * 2.1) + 0.04 * Math.sin(u * 91 - t * 3.3);
        const y = mid + Math.sin(u * cycles * 2 * Math.PI + t * 6) * reach * ripple;
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.lineWidth = 1.6 * dpr;
      g.lineJoin = 'round';
      g.strokeStyle = '#f5e21a';
      g.stroke();
    };

    const tick = (now: number) => {
      level.current += (target.current - level.current) * 0.14;
      draw(now);
      raf = visible && !still ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf && visible && !still) raf = requestAnimationFrame(tick); };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: '80px' });
    io.observe(cv);
    // With reduced motion the trace does not run; it is redrawn at its new height on each change.
    const onTune = () => { if (still) { level.current = target.current; draw(0); } else wake(); };
    cv.addEventListener('tune', onTune);
    size();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cv.removeEventListener('tune', onTune); };
  }, []);

  useEffect(() => { canvas.current?.dispatchEvent(new Event('tune')); }, [trim]);

  const nudge = (d: number) => setTrim((v) => Math.min(100, Math.max(0, Math.round((v + d) * 10) / 10)));
  const p = lab.picture;

  return (
    <section className="lab" id="lab">
      <div className="lab-head reveal" ref={head}>
        <h2 className="poster">{lab.heading}</h2>
        <p className="lead">{lab.text}</p>
      </div>

      <div className="lab-bench">
        <div className={'scope is-' + state} data-ui>
          <canvas ref={canvas} aria-hidden="true" />
          <p className="scope-drive">{lab.readouts.drive} <b>{lab.drive.toFixed(2)} kHz</b></p>
          <p className="scope-state" role="status">{lab.states[state]}</p>
        </div>

        <div className="lab-side">
          <div className="tuner" data-ui>
            <label htmlFor="trim">{lab.control}</label>
            <div className="tuner-row">
              <button type="button" onClick={() => nudge(-0.5)} aria-label={lab.less}>−</button>
              <input id="trim" type="range" min={0} max={100} step={0.1} value={trim}
                onChange={(e) => setTrim(Number(e.target.value))}
                aria-valuetext={`Coil resonates at ${resonance.toFixed(1)} kilohertz`} />
              <button type="button" onClick={() => nudge(0.5)} aria-label={lab.more}>+</button>
            </div>
            <dl>
              <div><dt>{lab.readouts.resonance}</dt><dd>{resonance.toFixed(1)} kHz</dd></div>
              <div>
                <dt>{lab.readouts.signal}</dt>
                <dd>
                  <span className="meter" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, i) => <i key={i} className={i < bars ? 'on' : ''} />)}
                  </span>
                  {Math.round(amp * 100)}%
                </dd>
              </div>
            </dl>
          </div>

          <figure className="lab-fig">
            <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 760px) 92vw, 30vw" width={p.width} height={p.height}
              alt={p.alt} loading="lazy" decoding="async" />
            <figcaption>{lab.figure}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
