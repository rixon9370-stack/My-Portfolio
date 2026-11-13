import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollNav } from '../hooks/useScrollNav';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const isScrolled = useScrollNav();

  const handleNavClick = (targetId) => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        id="siteHeader"
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 pointer-events-none ${
          isScrolled
            ? 'bg-[#0a0a0c] border-b border-white/10 py-4 pointer-events-auto shadow-2xl'
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        {/* Soft gradient scrim over hero when not scrolled */}
        {!isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/60 to-transparent pointer-events-none -z-10 transition-opacity duration-300" />
        )}

        <div className="w-full max-w-full px-6 sm:px-8 mx-auto flex justify-between items-center box-border pointer-events-auto">
          {/* Brand */}
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white hover:opacity-85 transition-opacity"
            aria-label="Rixon Sunny Homepage"
            onClick={() => {
              if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            RIXON SUNNY
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {isHome ? (
              <>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('projects');
                  }}
                  className="font-body text-[13px] font-semibold uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                >
                  WORK
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('about');
                  }}
                  className="font-body text-[13px] font-semibold uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                >
                  ABOUT
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/#projects"
                  className="font-body text-[13px] font-semibold uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                >
                  PROJECTS
                </Link>
                <Link
                  to="/#about"
                  className="font-body text-[13px] font-semibold uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                >
                  ABOUT
                </Link>
              </>
            )}
          </div>

          {/* CTA Link */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className={`font-body text-[13px] font-semibold uppercase tracking-wider text-white hover:opacity-70 transition-opacity ${
                location.pathname === '/contact' ? 'opacity-100 underline underline-offset-4' : ''
              }`}
            >
              {isHome ? 'CONTACT' : "LET'S TALK"}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-white font-body text-xs font-semibold uppercase tracking-widest p-2 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span>MENU</span>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col justify-center items-center transition-all duration-350 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className="absolute top-6 right-6 text-white p-3 hover:opacity-70 transition-opacity cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>

        <nav className="flex flex-col items-center gap-8 text-center" aria-label="Mobile Navigation">
          <Link
            to="/"
            className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            HOME
          </Link>
          {isHome ? (
            <>
              <a
                href="#projects"
                className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('projects');
                }}
              >
                WORK
              </a>
              <a
                href="#about"
                className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
              >
                ABOUT
              </a>
            </>
          ) : (
            <>
              <Link
                to="/#projects"
                className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                PROJECTS
              </Link>
              <Link
                to="/#about"
                className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT
              </Link>
            </>
          )}
          <Link
            to="/contact"
            className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white hover:opacity-70 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </>
  );
}
