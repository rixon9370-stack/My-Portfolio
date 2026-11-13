import React from 'react';
import { Link } from 'react-router-dom';
import BrandsGrid from './BrandsGrid';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="w-full pt-28 md:pt-36 text-center" aria-label="About Rixon Sunny">
      <div className="max-w-4xl mx-auto flex flex-col items-center px-4 sm:px-6">
        {/* 1. Tag */}
        <span className="inline-block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-5">
          About
        </span>

        {/* 2. Headline */}
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] font-bold leading-[0.98] uppercase text-white tracking-tight mb-6 max-w-3xl">
          I MAKE AI VIDEOS THAT SELL.
        </h2>

        {/* 3. Subheadline */}
        <p className="font-body text-base sm:text-lg md:text-xl font-normal text-white/85 leading-relaxed max-w-2xl mb-12">
          Cinematic commercial and brand videos, produced with AI.
        </p>

        {/* 4. Bio Paragraphs */}
        <div className="flex flex-col gap-5 max-w-2xl text-base sm:text-lg font-normal text-white/80 leading-relaxed mb-14 text-center">
          <p>
            I'm Rixon Sunny, a freelance AI video producer based in Wayanad, Kerala. I create advertising for brands in India and international markets, delivering high-quality visuals with the speed and flexibility of AI production.
          </p>
          <p>
            My work spans every format, from 15-second digital ads to productions of up to six minutes, including theatrical advertising.
          </p>
          <p>
            I have delivered projects for brands in fashion, jewellery, food, retail, travel and technology.
          </p>
          <p>
            I also manage Meta and Google advertising campaigns, so the finished video reaches the right audience.
          </p>
        </div>

        {/* 5. Details row (Location / Markets / Format range) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-2xl py-8 border-y border-white/10 mb-12">
          <div className="flex flex-col items-center">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              Location
            </span>
            <span className="font-body text-sm sm:text-base font-medium text-white">
              Wayanad, Kerala, India
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              Markets
            </span>
            <span className="font-body text-sm sm:text-base font-medium text-white">
              India &amp; International
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              Format range
            </span>
            <span className="font-body text-sm sm:text-base font-medium text-white">
              15 sec – 6 min
            </span>
          </div>
        </div>

        {/* 6. Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md">
          <a
            href="#projects"
            onClick={scrollToProjects}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#0a0a0c] font-body text-sm font-semibold rounded hover:bg-white/90 transition-colors"
          >
            <span>View my work</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-white/20 text-white font-body text-sm font-semibold rounded hover:bg-white/10 hover:border-white transition-colors"
          >
            Get in touch
          </Link>
        </div>

        {/* 7. Brands Grid */}
        <BrandsGrid />
      </div>
    </section>
  );
}
