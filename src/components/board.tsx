import { forwardRef, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/* The parts every section is built from: copper traces, IC packages, a seven-segment display. */

// ---------------------------------------------------------------- traces

/** Small seeded generator, so a section draws the same board on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Art = { lines: string[]; vias: [number, number][] };
type Box = [x: number, y: number, w: number, h: number];

const CELL = 300; // the board is divided into cells; each holds at most one bundle, so nothing crosses
const PITCH = 13; // distance between neighbouring traces in a bundle
const K = Math.SQRT2 - 1; // how far a 45° corner shifts per trace to keep the pitch constant

/**
 * Lays out bundles of parallel traces with 45° jogs, the way a router leaves them: each bundle
 * stays inside its own cell, runs along one axis, jogs once and ends in a row of vias. Cells that
 * hold running text are left empty, as a layout keeps silkscreen clear of copper.
 */
function route(seed: number, w: number, h: number, fill: number, keepout: Box[]): Art {
  const r = rng(seed);
  const art: Art = { lines: [], vias: [] };
  const cols = Math.max(1, Math.round(w / CELL));
  const rows = Math.max(1, Math.round(h / CELL));
  const cw = w / cols;
  const ch = h / rows;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      // Draw the dice first so the board stays the same when the keep-out areas move.
      const dice = [r(), r(), r(), r(), r(), r(), r(), r(), r()];
      let d = 0;
      const next = () => dice[d++];
      if (next() > fill) continue;
      const covered = keepout.reduce((sum, [x, y, bw, bh]) => {
        const ox = Math.min(x + bw, (cx + 1) * cw) - Math.max(x, cx * cw);
        const oy = Math.min(y + bh, (cy + 1) * ch) - Math.max(y, cy * ch);
        return sum + (ox > 0 && oy > 0 ? ox * oy : 0);
      }, 0);
      if (covered > cw * ch * 0.1) continue;
      const n = 2 + Math.floor(next() * 4);
      const vertical = next() < 0.4;
      // Work in the cell's own axes (u along the run, v across it), then map to the page.
      const U = vertical ? ch : cw;
      const V = vertical ? cw : ch;
      const band = (n - 1) * PITCH;
      const jog = (16 + Math.floor(next() * 5) * 13) * (next() < 0.5 ? -1 : 1);
      const v0 = 24 + next() * Math.max(1, V - band - 48 - Math.abs(jog)) + (jog < 0 ? -jog : 0);
      const u0 = next() < 0.5 ? 0 : 20 + U * 0.08;
      const u1 = U * (0.3 + next() * 0.2);
      const uEnd = U * (0.72 + next() * 0.2);
      const s = Math.sign(jog);
      for (let i = 0; i < n; i++) {
        const v = v0 + i * PITCH;
        const c1 = u1 - s * i * PITCH * K;
        const c2 = c1 + Math.abs(jog);
        const end = uEnd - (i % 2) * 18;
        const pts: [number, number][] = [[u0, v], [c1, v], [c2, v + jog], [end, v + jog]];
        const map = ([u, vv]: [number, number]): [number, number] =>
          vertical ? [cx * cw + vv, cy * ch + u] : [cx * cw + u, cy * ch + vv];
        const m = pts.map(map);
        art.lines.push('M' + m.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'));
        art.vias.push(m[3]);
        if (u0 > 0) art.vias.push(m[0]);
      }
    }
  }
  return art;
}

/**
 * Copper under the solder mask, filling whatever it is placed in. Decorative: hidden from
 * assistive technology and never in the way of a click. With `live`, a few traces carry a pulse.
 */
export function Traces({ seed, fill = 0.6, live = false }: { seed: number; fill?: number; live?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [keepout, setKeepout] = useState<Box[]>([]);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    // Sizes are rounded so that a few pixels of resize do not redraw the board.
    const read = () => {
      setSize((old) => {
        const w = Math.round(host.clientWidth / 60) * 60;
        const h = Math.round(host.clientHeight / 60) * 60;
        return old.w === w && old.h === h ? old : { w, h };
      });
      // Running text keeps copper out from under it; headings and parts may sit over traces.
      const origin = host.getBoundingClientRect();
      // On a phone there is no room to spare, so headings and labels keep clear as well.
      const text = 'p:not(.silk), li, .channels, .pinout, .builder, .tft, .project-status, .foot-mark, .foot-legal' + (host.clientWidth < 760 ? ', h1, h2, .silk' : '');
      const boxes = Array.from(host.querySelectorAll(text)).map((el): Box => {
        const b = el.getBoundingClientRect();
        return [Math.round((b.left - origin.left) / 20) * 20, Math.round((b.top - origin.top) / 20) * 20, Math.round(b.width / 20) * 20, Math.round(b.height / 20) * 20];
      }).filter((b) => b[2] > 0 && b[3] > 0);
      setKeepout((old) => (JSON.stringify(old) === JSON.stringify(boxes) ? old : boxes));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const art = useMemo(() => (size.w && size.h ? route(seed, size.w, size.h, fill, keepout) : null), [seed, size.w, size.h, fill, keepout]);

  return (
    <svg ref={ref} className="traces" aria-hidden="true" focusable="false"
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} preserveAspectRatio="xMidYMid slice">
      {art && (
        <>
          <g className="traces-copper">{art.lines.map((d, i) => <path key={i} d={d} />)}</g>
          {live && (
            <g className="traces-pulse">
              {art.lines.filter((_, i) => i % 4 === 1).map((d, i) => (
                <path key={i} d={d} pathLength={100} style={{ animationDuration: `${3.2 + (i % 5) * 0.7}s`, animationDelay: `${-(i % 7) * 0.6}s` }} />
              ))}
            </g>
          )}
          <g className="traces-vias">
            {art.vias.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.5} />)}
          </g>
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- IC package

/** A surface-mount package with legs on all four sides. Whatever is inside sits on the die. */
export const Chip = forwardRef<HTMLDivElement, { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>>(
function Chip({ className = '', children, ...rest }, ref) {
  return (
    <div ref={ref} className={'chip ' + className} {...rest}>
      <span className="chip-legs chip-legs-x" aria-hidden="true" />
      <span className="chip-legs chip-legs-y" aria-hidden="true" />
      <div className="chip-body">{children}</div>
    </div>
  );
});

/** White silkscreen text: a reference designator and, optionally, what the part is. */
export function Silk({ mark, children, className = '' }: { mark?: string; children?: ReactNode; className?: string }) {
  return (
    <p className={'silk ' + className}>
      {mark && <b>{mark}</b>}
      {children}
    </p>
  );
}

// ---------------------------------------------------------------- seven-segment display

//            a
//          f   b
//            g
//          e   c
//            d
const DIGITS: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
  '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abfgcd', '-': 'g', ' ': '',
};
const SEGMENTS: Record<string, string> = {
  a: 'M3 1h10l-2 3H5z', b: 'M14 2l1 1v9l-1.5 1.5L12 12V5z', c: 'M13.5 14.5L15 16v9l-1 1-2-3v-7z',
  d: 'M3 27h10l-2-3H5z', e: 'M2 26l-1-1v-9l1.5-1.5L4 16v7z', f: 'M2.5 13.5L1 12V3l1-1 2 3v7z',
  g: 'M3.5 14L5 12.5h6L12.5 14 11 15.5H5z',
};

/** An LED seven-segment readout. The value is also given as text for screen readers. */
export function SevenSeg({ value, label }: { value: string; label: string }) {
  const cells: { ch: string; dot: boolean }[] = [];
  for (const ch of value) {
    if (ch === '.' && cells.length) cells[cells.length - 1].dot = true;
    else cells.push({ ch, dot: false });
  }
  return (
    <span className="seg" role="img" aria-label={label}>
      {cells.map((c, i) => (
        <svg key={i} viewBox="0 0 19 28" aria-hidden="true">
          {Object.entries(SEGMENTS).map(([name, d]) => (
            <path key={name} d={d} className={(DIGITS[c.ch] ?? '').includes(name) ? 'on' : ''} />
          ))}
          <circle cx="17.2" cy="25.6" r="1.5" className={c.dot ? 'on' : ''} />
        </svg>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------- discrete parts

/**
 * A row of soldered parts with their silkscreen: resistor, ceramic capacitor, crystal, inductor,
 * tantalum capacitor and an LED that blinks. Decorative, so it is hidden from assistive technology.
 * The resistor's bands read 1-3-3 ×1k and the crystal is marked 133.33: the project frequency.
 */
export function Parts() {
  const pad = (x: number, y: number) => <rect x={x - 9} y={y - 9} width="18" height="18" rx="3" className="p-pad" />;
  return (
    <svg className="parts" viewBox="0 0 760 96" aria-hidden="true" focusable="false">
      {/* R1: axial resistor */}
      <g>
        {pad(20, 44)}{pad(140, 44)}
        <path d="M20 44H140" className="p-lead" />
        <rect x="44" y="28" width="72" height="32" rx="12" fill="#d9b98a" />
        <rect x="56" y="28" width="7" height="32" fill="#7a4a21" /><rect x="68" y="28" width="7" height="32" fill="#f08a24" />
        <rect x="80" y="28" width="7" height="32" fill="#f08a24" /><rect x="92" y="28" width="7" height="32" fill="#f08a24" />
        <rect x="104" y="30" width="5" height="28" fill="#7a4a21" />
        <text x="80" y="88" className="p-silk">R1</text>
      </g>
      {/* C1: ceramic capacitor */}
      <g>
        {pad(190, 44)}{pad(250, 44)}
        <rect x="198" y="30" width="44" height="28" rx="3" fill="#c9a26b" />
        <rect x="198" y="30" width="10" height="28" rx="2" className="p-tin" /><rect x="232" y="30" width="10" height="28" rx="2" className="p-tin" />
        <text x="220" y="88" className="p-silk">C1</text>
      </g>
      {/* Y1: crystal */}
      <g>
        {pad(304, 44)}{pad(396, 44)}
        <rect x="300" y="24" width="100" height="40" rx="20" className="p-tin" />
        <rect x="308" y="30" width="84" height="28" rx="14" fill="#e4e8ee" />
        <text x="350" y="49" className="p-mark">133.33</text>
        <text x="350" y="88" className="p-silk">Y1</text>
      </g>
      {/* L1: wound inductor */}
      <g>
        {pad(448, 44)}{pad(528, 44)}
        <rect x="456" y="22" width="64" height="44" rx="5" fill="#23272f" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={463 + i * 11} y="22" width="6" height="44" fill="#c9783a" />)}
        <text x="488" y="88" className="p-silk">L1</text>
      </g>
      {/* C2: tantalum capacitor */}
      <g>
        {pad(580, 44)}{pad(644, 44)}
        <rect x="586" y="27" width="52" height="34" rx="3" fill="#ffc21f" />
        <rect x="586" y="27" width="11" height="34" rx="2" fill="#a8590f" />
        <text x="612" y="88" className="p-silk">C2</text>
      </g>
      {/* D1: LED */}
      <g>
        {pad(700, 44)}{pad(740, 44)}
        <rect x="704" y="30" width="32" height="28" rx="3" fill="#e9ecef" />
        <rect x="711" y="34" width="18" height="20" rx="6" className="p-led" />
        <text x="720" y="88" className="p-silk">D1</text>
      </g>
    </svg>
  );
}
