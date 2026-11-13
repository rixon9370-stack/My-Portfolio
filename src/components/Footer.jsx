import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 py-8">
      <div className="site-aligned-row font-body text-xs sm:text-sm font-semibold tracking-wider text-white">
        {/* Column 1: Copyright */}
        <div className="site-col-1 text-white/60">
          <span>&copy; {currentYear} Rixon Sunny</span>
        </div>

        {/* Column 2 & 3: Social Links */}
        <div className="hidden md:flex flex-2 justify-center items-center gap-6 sm:gap-8">
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
          <a
            href="https://www.linkedin.com/in/rixon-sunny-999330397"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            LINKEDIN
          </a>
          <a
            href="https://www.youtube.com/@Rixonsunny"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            YOUTUBE
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

      {/* Mobile Social Links Row */}
      <div className="flex md:hidden flex-wrap justify-center items-center gap-6 mt-6 px-4 font-body text-xs font-semibold tracking-wider text-white">
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
        <a
          href="https://www.linkedin.com/in/rixon-sunny-999330397"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          LINKEDIN
        </a>
        <a
          href="https://www.youtube.com/@Rixonsunny"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          YOUTUBE
        </a>
      </div>
    </footer>
  );
}
