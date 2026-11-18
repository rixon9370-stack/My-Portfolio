import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PANELS } from '../data/panels';
import { WORKS } from '../data/works';
import './ProjectsSection.css';

/*
  CURTAIN / PINNED-TITLE REVEAL  (matches Amber reference)
  ─────────────────────────────────────────────────────────
  Each panel is position:sticky so it pins while the page scrolls,
  and later panels slide up over earlier ones (z-index stacking).

  clip-path:inset(0) on the panel clips ALL descendants — including
  position:fixed ones — to the panel's own visible rectangle.

  .project-panel-text is position:fixed at exactly 50vh so it never
  moves with scroll. Its visibility is clipped to its own panel only.

  When the next panel's top edge scrolls up to 50vh its clip starts
  including that point → its title snaps in at the viewport centre.
  This is the exact title-swap-at-centre-line behaviour from the
  reference video.
*/

function Panel({ panel, zIndex, isFirst = false, isLast = false }) {
  const videoRef  = useRef(null);
  const sectionRef = useRef(null);
  const count = WORKS.filter((w) => w.category === panel.slug).length;

  /* First panel only (right after ticker strip):
     Offset the title while panel is scrolling up so it stays centered
     in the panel and lands at viewport center when panel reaches top: 0. */
  useEffect(() => {
    if (!isFirst || !sectionRef.current) return;
    const el = sectionRef.current;
    let rAFId = null;

    const updateOffset = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const offset = Math.max(0, rect.top);
      el.style.setProperty('--title-offset', `${offset}px`);
      rAFId = null;
    };

    const onScroll = () => {
      if (rAFId === null) {
        rAFId = window.requestAnimationFrame(updateOffset);
      }
    };

    updateOffset();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rAFId !== null) {
        window.cancelAnimationFrame(rAFId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isFirst]);

  /* Last panel only (APP PROMOS, right before ABOUT / footer):
     While the panel's bottom edge rises above the bottom of the viewport,
     shift the title up together with the panel so it stays safely inside
     the visible area and exits off the top of the viewport with the panel. */
  useEffect(() => {
    if (!isLast || !sectionRef.current) return;
    const el = sectionRef.current;
    let rAFId = null;

    const updateShift = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const shift = Math.min(0, rect.bottom - window.innerHeight);
      el.style.setProperty('--title-shift', `${shift}px`);
      rAFId = null;
    };

    const onScroll = () => {
      if (rAFId === null) {
        rAFId = window.requestAnimationFrame(updateShift);
      }
    };

    updateShift();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rAFId !== null) {
        window.cancelAnimationFrame(rAFId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isLast]);

  /* Play/pause video only when panel is sufficiently visible */
  useEffect(() => {
    if (!panel.hasVideo || !videoRef.current) return;
    const video = videoRef.current;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            video.play().catch(() => {});
          } else if (entry.intersectionRatio <= 0.1) {
            video.pause();
          }
        });
      },
      { threshold: [0.1, 0.45, 0.75] }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [panel.hasVideo]);

  return (
    <section
      ref={sectionRef}
      id={panel.slug}
      className={`project-panel ${isFirst ? 'panel--after-strip' : ''} ${isLast ? 'panel--last' : ''}`}
      style={{ zIndex }}
      aria-label={`${panel.title}, ${count} ${count === 1 ? 'film' : 'films'}`}
    >
      {/* ── Background media ─────────────────────────────── */}
      {panel.hasVideo ? (
        <video
          ref={videoRef}
          className="project-panel-video"
          src={panel.video}
          poster={panel.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : panel.poster ? (
        <img
          className="project-panel-video"
          src={panel.poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      ) : (
        <div className="project-panel-gradient-fallback" aria-hidden="true" />
      )}

      {/* ── Dark overlay ─────────────────────────────────── */}
      <div className="project-panel-overlay" aria-hidden="true" />

      {/* ── Pinned title — position:fixed, clipped by panel ─
           Stays at exact viewport centre.
           Visible only within THIS panel's clip-path region. */}
      <div className="project-panel-text">
        <h2>{panel.title}</h2>
        <p>{count} {count === 1 ? 'film' : 'films'}</p>
        <Link
          to={panel.href}
          className="project-panel-view-btn"
          aria-label={`View ${panel.title} projects`}
        >
          <span>VIEW</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function ProjectsSection() {
  return (
    <div id="projects" className="projects-stack">
      {PANELS.map((panel, index) => (
        <Panel
          key={panel.slug}
          panel={panel}
          zIndex={index + 1}
          isFirst={index === 0}
          isLast={index === PANELS.length - 1}
        />
      ))}
    </div>
  );
}
