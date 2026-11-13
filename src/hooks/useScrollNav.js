import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollNav() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const [isScrolled, setIsScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        setIsScrolled(rect.top <= 80);
      } else {
        setIsScrolled(window.scrollY > 100);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHome, location]);

  return isScrolled;
}
