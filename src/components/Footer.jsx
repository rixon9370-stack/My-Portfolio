import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10">
      {/* Desktop Footer Row (>= 768px) */}
      <div className="footer-desktop site-aligned-row font-body text-xs sm:text-sm font-semibold tracking-wider text-white py-8">
        {/* Column 1: Copyright */}
        <div className="site-col-1 text-white/60">
          <span>&copy; {currentYear} Rixon Sunny</span>
        </div>

        {/* Column 2 & 3: Social Links */}
        <div className="flex-2 flex justify-center items-center gap-6 sm:gap-8">
          <a
            href="https://wa.me/919562384588"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            WHATSAPP
          </a>
          <a
            href="mailto:rixon9370@gmail.com"
            className="hover:opacity-70 transition-opacity"
          >
            EMAIL
          </a>
        </div>

        {/* Column 4: Back to Top */}
        <div className="site-col-4">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity uppercase cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Footer Column (< 768px, matching Amber reference) */}
      <div className="footer-mobile font-body text-center">
        {/* Links row */}
        <div className="flex items-center justify-center gap-8 text-xs font-semibold tracking-wider text-white">
          <a
            href="https://wa.me/919562384588"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            WHATSAPP
          </a>
          <a
            href="mailto:rixon9370@gmail.com"
            className="hover:opacity-70 transition-opacity"
          >
            EMAIL
          </a>
        </div>

        {/* Back to top centered on its own line */}
        <div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-white hover:opacity-70 transition-opacity uppercase cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright centered at very bottom in smaller muted text */}
        <div className="text-[11px] font-medium tracking-wider text-white/50">
          <span>&copy; {currentYear} Rixon Sunny</span>
        </div>
      </div>
    </footer>
  );
}
