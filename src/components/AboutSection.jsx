import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { value: 'Wayanad, Kerala, India', label: 'Location' },
  { value: 'India & International', label: 'Markets' },
  { value: '15 sec – 6 min', label: 'Format range' },
  { value: '1 Year', label: 'Experience' },
];

export default function AboutSection() {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="w-full pt-28 md:pt-36" aria-label="About Rixon Sunny">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Two-column editorial split on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start text-left">
          {/* Left column: Tag, Headline & Subtitle */}
          <div className="md:col-span-6">
            <span className="inline-block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-5">
              About
            </span>

            <h2 className="font-display text-[clamp(2.8rem,5.5vw,5.2rem)] font-bold leading-[0.94] uppercase text-white tracking-tight mb-6">
              I MAKE AI VIDEOS THAT SELL.
            </h2>

            <p className="font-body text-base sm:text-lg md:text-xl font-normal text-white/75 leading-relaxed max-w-md">
              Cinematic commercial and brand videos, produced with AI.
            </p>
          </div>

          {/* Right column: Bio paragraphs & editorial typographic links */}
          <div className="md:col-span-6 md:pt-9">
            <div className="flex flex-col gap-5 text-base sm:text-lg font-normal text-white/80 leading-relaxed text-left">
              <p>
                I'm Rixon Sunny, a freelance AI video producer based in Wayanad, Kerala. I create advertising for brands in India and international markets, delivering high-quality visuals with the speed and flexibility of AI production.
              </p>
              <p>
                My work spans every format, from 15-second digital ads to productions of up to six minutes, including theatrical advertising.
              </p>
              <p>
                I have delivered projects for brands in fashion, jewellery, food, retail, travel and technology.
              </p>
            </div>

            {/* Editorial typographic links (no boxed buttons) */}
            <div className="flex flex-wrap items-center gap-8 mt-10">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="group relative inline-flex items-center gap-2 pb-1.5 font-body text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                <span>View my work</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 w-full h-px bg-white/30" aria-hidden="true" />
                <span
                  className="absolute bottom-0 left-0 w-full h-px bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  aria-hidden="true"
                />
              </a>

              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 pb-1.5 font-body text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white transition-colors"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 w-full h-px bg-white/20" aria-hidden="true" />
                <span
                  className="absolute bottom-0 left-0 w-full h-px bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Unbroken horizontal stats row separated by thin vertical hairlines */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-0 md:gap-y-0 md:divide-x md:divide-white/15">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between text-left md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span className="font-display text-2xl sm:text-[1.65rem] lg:text-[2rem] font-bold uppercase tracking-tight text-white leading-[1.08]">
                {stat.value}
              </span>
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45 mt-2.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
