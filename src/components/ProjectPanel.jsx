import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { WORKS } from '../data/works';

export default function ProjectPanel({ panel, zIndex = 1 }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Compute live count from WORKS array
  const count = WORKS.filter((w) => w.category === panel.slug).length;

  useEffect(() => {
    if (!panel.hasVideo || !videoRef.current) return;

    const video = videoRef.current;
    let observer;

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
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

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [panel.hasVideo]);

  return (
    <section
      ref={containerRef}
      id={panel.slug}
      style={{ zIndex }}
      className="project-panel group relative flex items-center justify-center bg-[#0a0a0c]"
      aria-label={`${panel.title}, ${count} films`}
    >
      {/* Background Media */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {panel.hasVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            muted
            loop
            playsInline
            preload="metadata"
            poster={panel.poster}
            aria-hidden="true"
          >
            <source src={panel.video} type="video/mp4" />
          </video>
        ) : panel.poster ? (
          <img
            src={panel.poster}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          /* Dark gradient fallback when no poster or video */
          <div className="w-full h-full bg-gradient-to-br from-[#111115] via-[#0a0a0c] to-[#18181f]" />
        )}
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500" />
      </div>

      {/* Centered Panel Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8">
        <h2 className="font-display text-[clamp(2.8rem,5.5vw,6.5rem)] font-bold leading-none uppercase text-white tracking-tight mb-3 drop-shadow-lg">
          {panel.title}
        </h2>
        <p className="font-body text-sm sm:text-base font-medium text-white/85 mb-8 tracking-wide">
          {count} {count === 1 ? 'film' : 'films'}
        </p>
        <Link
          to={panel.href}
          className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-white border-b border-transparent hover:border-white pb-0.5 transition-all duration-300 cursor-pointer"
          aria-label={`View ${panel.title} projects`}
        >
          <span>VIEW</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
