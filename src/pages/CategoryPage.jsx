import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkCard from '../components/WorkCard';
import Lightbox from '../components/Lightbox';
import { CATEGORIES } from '../data/categories';
import { WORKS } from '../data/works';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage({ explicitCategory }) {
  const params = useParams();
  const slug = explicitCategory || params.categorySlug || 'cinematic';
  const categoryInfo = CATEGORIES[slug] || {
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    metaTitle: `${slug.toUpperCase()} | Rixon Sunny`,
    description: 'Selected visual works by Rixon Sunny.'
  };

  const categoryWorks = WORKS.filter((w) => w.category === slug);
  const landscapeList = categoryWorks.filter((w) => w.orientation !== 'vertical');
  const verticalList = categoryWorks.filter((w) => w.orientation === 'vertical');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    document.title = categoryInfo.metaTitle || 'Portfolio | Rixon Sunny';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryInfo]);

  const openLightboxAt = (work) => {
    const idx = categoryWorks.findIndex((w) => w === work);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev <= 0 ? categoryWorks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev >= categoryWorks.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL PROJECTS</span>
          </Link>
        </div>

        {/* Category Header */}
        <header className="mb-14 text-left">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-3">
            {categoryInfo.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-body text-sm font-semibold tracking-wider text-white/50">
              {categoryWorks.length} {categoryWorks.length === 1 ? 'FILM' : 'FILMS'}
            </span>
          </div>
          <p className="font-body text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            {categoryInfo.description}
          </p>
        </header>

        {/* Empty State */}
        {categoryWorks.length === 0 && (
          <div className="py-20 text-center text-white/50 font-body text-base">
            Films in this category will be available soon.
          </div>
        )}

        {/* Landscape Works Grid */}
        {landscapeList.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {landscapeList.map((item, idx) => (
                <WorkCard
                  key={item.youtubeId || idx}
                  item={item}
                  onClick={() => openLightboxAt(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Vertical Works Grid */}
        {verticalList.length > 0 && (
          <div>
            <div className="mb-6 border-t border-white/10 pt-8">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-white/50">
                VERTICAL / MOBILE FORMAT
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {verticalList.map((item, idx) => (
                <WorkCard
                  key={item.youtubeId || idx}
                  item={item}
                  onClick={() => openLightboxAt(item)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Video Player Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        works={categoryWorks}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <Footer />
    </div>
  );
}
