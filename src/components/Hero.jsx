import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useISTClock } from '../hooks/useISTClock';

export default function Hero() {
  const clock = useISTClock();
  const currentYear = new Date().getFullYear();
  const videoWrapRef = useRef(null);
  const headlineRef = useRef(null);
  const bottomBarRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // GSAP sequential entrance animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        videoWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 }
      )
      .fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.4'
      )
      .fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      );
    });

    // Ensure hero video autoplays safely
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100vh] h-[100svh] w-full overflow-hidden flex items-center justify-center bg-[#0a0a0c]"
    >
      {/* Video Background */}
      <div ref={videoWrapRef} className="absolute inset-0 z-10 opacity-0">
        <video
          ref={videoRef}
          id="heroVideo"
          className="w-full h-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/posters/home.webp"
          aria-hidden="true"
        >
          <source src="/assets/videos/home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25 z-20 pointer-events-none" />
      </div>

      {/* Centered Massive Headline */}
      <div
        ref={headlineRef}
        className="relative z-30 w-full px-6 sm:px-8 flex items-center justify-center text-center opacity-0 pointer-events-none select-none"
      >
        <h1 className="font-display text-[clamp(4.2rem,14vw,14.5rem)] font-bold leading-[0.92] uppercase text-white tracking-[-0.015em] text-center">
          RIXON<span className="inline md:hidden"><br /></span> <span className="hidden md:inline"> </span>SUNNY
        </h1>
      </div>

      {/* Bottom Information Bar - Exactly Aligned with Top Navbar */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-6 left-0 right-0 z-30 w-full pointer-events-none opacity-0"
      >
        {/* Desktop 4-Column Row (Matches Top Navbar columns 1:1) */}
        <div className="hidden md:flex site-aligned-row font-body text-xs sm:text-sm md:text-[15px] font-medium text-white tracking-[-0.005em]">
          {/* Column 1: Aligns directly under Logo */}
          <div className="site-col-1">
            <span className="whitespace-nowrap">AI films and ads for brands</span>
          </div>

          {/* Column 2: Aligns directly under WORK */}
          <div className="site-col-2">
            <span className="whitespace-nowrap">Wayanad, Kerala</span>
          </div>

          {/* Column 3: Aligns directly under ABOUT */}
          <div className="site-col-3">
            <span className="whitespace-nowrap font-mono tabular-nums tracking-wider text-white/90">
              {clock}
            </span>
          </div>

          {/* Column 4: Aligns directly under CONTACT */}
          <div className="site-col-4">
            <span className="whitespace-nowrap text-white/80">
              &copy; {currentYear} Rixon Sunny
            </span>
          </div>
        </div>

        {/* Mobile 2x2 Grid */}
        <div className="flex md:hidden px-5 justify-between items-center text-xs font-medium text-white gap-2">
          <div className="flex flex-col gap-1 text-left">
            <span>AI films and ads for brands</span>
            <span className="text-white/70">Wayanad, Kerala</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="font-mono tabular-nums">{clock}</span>
            <span className="text-white/70">&copy; {currentYear} Rixon Sunny</span>
          </div>
        </div>
      </div>
    </section>
  );
}
