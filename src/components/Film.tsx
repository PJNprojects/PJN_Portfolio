import { useEffect, useRef, useState } from 'react';
import { film } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { prefersReducedMotion } from '../lib/scroll';

/**
 * The explainer film. It has no sound, loads only when it is about to be seen, plays while it is
 * on screen and stops when it is not. The chapter buttons jump to each part of the argument.
 */
export default function Film() {
  const head = useReveal<HTMLDivElement>();
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onTime = () => {
      const t = v.currentTime;
      let c = 0;
      film.chapters.forEach((ch, i) => { if (t >= ch.at - 0.05) c = i; });
      setChapter(c);
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${t / v.duration})`;
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);

    // Play while on screen, unless the visitor paused it or asked for reduced motion.
    const auto = !prefersReducedMotion();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        if (auto && !userPaused.current) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: [0, 0.5] });
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); }
    else { userPaused.current = true; v.pause(); }
  };

  const jump = (at: number) => {
    const v = video.current;
    if (!v) return;
    userPaused.current = false;
    const seek = () => { v.currentTime = at; v.play().catch(() => {}); };
    // Before the first play the file has not been fetched; seek once it knows its length.
    if (v.readyState >= 1) seek();
    else { v.addEventListener('loadedmetadata', seek, { once: true }); v.load(); }
  };

  return (
    <section className="film" id="film">
      <div className="film-head reveal" ref={head}>
        <h2 className="poster">{film.heading}</h2>
        <p className="lead">{film.text}</p>
      </div>

      <figure className="film-stage">
        <div className="film-screen">
          <video ref={video} src={film.src} poster={film.poster} width={film.width} height={film.height}
            muted loop playsInline preload="none" onClick={toggle} aria-label={film.heading} />
          <button type="button" className={'film-play' + (playing ? ' is-playing' : '')} onClick={toggle}>
            {playing ? film.pause : film.play}
          </button>
          <div className="film-progress" aria-hidden="true"><div ref={bar} /></div>
        </div>
        <div className="film-foot">
          <div className="chips" role="group" aria-label="Chapters">
            {film.chapters.map((c, i) => (
              <button key={c.label} type="button" className="chip" aria-pressed={i === chapter} onClick={() => jump(c.at)}>
                {c.label}
              </button>
            ))}
          </div>
          <figcaption>{film.caption}</figcaption>
        </div>
      </figure>
    </section>
  );
}
