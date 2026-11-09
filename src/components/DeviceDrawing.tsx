import { forwardRef } from 'react';

/**
 * The collar device, drawn flat in the page's own colours: strap and counterweight below,
 * then base, board and lid. Every filled shape (`ink`) has a stroke twin (`sk`) so the hero can
 * sketch the outline first and fill it afterwards. `data-y` is each part's offset in the closed
 * device, in viewBox units. Replace with photographs when they exist; keep the ids.
 */
const DeviceDrawing = forwardRef<SVGSVGElement, { className?: string; id?: string }>(function DeviceDrawing({ className, id = 'device' }, ref) {
  return (
    <svg ref={ref} className={className} viewBox="0 0 1000 820" role="img" aria-labelledby={id + "-title"}>
      <title id={id + "-title"}>Exploded drawing of the collar device: strap, counterweight, base, circuit board and lid</title>

      <g className="part" data-part="strap" data-y="-110">
        <rect className="ink" x="60" y="590" width="880" height="46" fill="var(--ink)" />
        <rect className="ink" x="120" y="578" width="60" height="70" fill="var(--muted)" />
        {[760, 800, 840, 880].map((cx) => (
          <circle key={cx} className="ink" cx={cx} cy="613" r="8" fill="var(--bg)" />
        ))}
        <rect className="sk" x="60" y="590" width="880" height="46" />
        <rect className="sk" x="120" y="578" width="60" height="70" />
      </g>

      <g className="part" data-part="counterweight" data-y="-160">
        <polygon className="ink" points="420,690 580,690 560,780 440,780" fill="var(--muted)" />
        <circle className="ink" cx="500" cy="735" r="12" fill="var(--ink)" />
        <polygon className="sk" points="420,690 580,690 560,780 440,780" />
        <circle className="sk" cx="500" cy="735" r="12" />
      </g>

      <g className="part" data-part="base" data-y="0">
        <rect className="ink" x="300" y="380" width="400" height="90" rx="18" fill="var(--muted)" />
        <rect className="ink" x="300" y="380" width="400" height="24" fill="var(--muted)" />
        <rect className="ink" x="318" y="380" width="364" height="28" fill="var(--bg)" />
        <rect className="sk" x="300" y="380" width="400" height="90" rx="18" />
        <rect className="sk" x="318" y="380" width="364" height="28" />
      </g>

      <g className="part" data-part="board" data-y="140">
        <rect className="ink" x="345" y="206" width="80" height="44" fill="var(--muted)" />
        <rect className="ink" x="360" y="212" width="20" height="8" fill="var(--surface)" />
        <rect className="ink" x="440" y="224" width="30" height="26" fill="var(--muted)" />
        <ellipse className="ink" cx="530" cy="234" rx="45" ry="13" fill="none" stroke="var(--muted)" strokeWidth="10" />
        <rect className="ink" x="590" y="208" width="70" height="42" fill="var(--field-soft)" />
        <rect className="ink" x="330" y="250" width="340" height="22" fill="var(--ink)" />
        {[350, 370, 390].map((x) => (
          <rect key={x} className="ink" x={x} y="272" width="12" height="10" fill="var(--muted)" />
        ))}
        <rect className="sk" x="330" y="250" width="340" height="22" />
        <rect className="sk" x="345" y="206" width="80" height="44" />
        <rect className="sk" x="440" y="224" width="30" height="26" />
        <ellipse className="sk" cx="530" cy="234" rx="45" ry="13" />
        <rect className="sk" x="590" y="208" width="70" height="42" />
      </g>

      <g className="part" data-part="lid" data-y="268">
        <rect className="ink" x="300" y="40" width="400" height="72" rx="18" fill="var(--muted)" />
        <rect className="ink" x="300" y="88" width="400" height="24" fill="var(--muted)" />
        <rect className="ink" x="644" y="64" width="26" height="10" fill="var(--surface)" />
        <rect className="sk" x="300" y="40" width="400" height="72" rx="18" />
        <rect className="sk" x="644" y="64" width="26" height="10" />
      </g>
    </svg>
  );
});

export default DeviceDrawing;
