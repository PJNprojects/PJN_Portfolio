import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Work from '../components/Work';
import Film from '../components/Film';
import Footer from '../components/Footer';
import { Parts, SevenSeg, Silk, Traces } from '../components/board';
import { project, projects, tuner, work } from '../content/site';
import { startSmoothScroll } from '../lib/scroll';

const markwave = projects[0];

/** The Markwave project: what a visitor reaches by tuning to 133.33 kHz. It also opens by its own address. */
export default function Markwave() {
  useEffect(() => { startSmoothScroll(); }, []);
  return (
    <>
      <Nav onHome={false} />
      <main className="project">
        <section className="project-head board">
          <Traces seed={5} fill={0.7} />
          <div className="project-status">
            <Link className="link" to="/#projects">← {project.back}</Link>
            <p className="project-lock">
              <i className="led on" aria-hidden="true" />
              {project.status}
              <SevenSeg value={markwave.khz.toFixed(2)} label={`${markwave.khz.toFixed(2)} kilohertz`} />
              <span>{tuner.unit}</span>
            </p>
          </div>
          <div className="project-title">
            <Silk mark="CH1">{markwave.name} · {markwave.what}</Silk>
            <h1 className="poster">{work.heading}</h1>
            <p className="lead">{work.intro}</p>
          </div>
        </section>

        <Work />
        <Film />

        <section className="project-close board">
          <Traces seed={13} fill={0.5} />
          <h2 className="poster">{project.closing}</h2>
          <Link className="btn" to="/#brief">{project.closingButton}</Link>
          <Parts />
        </section>
      </main>
      <Footer />
    </>
  );
}
