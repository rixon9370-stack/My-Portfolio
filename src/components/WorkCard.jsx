import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId } from './Lightbox';

export default function WorkCard({ item, onClick }) {
  const yId = extractYouTubeId(item);
  const isVert = item.orientation === 'vertical';
  const [thumbSrc, setThumbSrc] = useState(
    `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`
  );

  const fallbackThumb = () => {
    setThumbSrc(`https://img.youtube.com/vi/${yId}/hqdefault.jpg`);
  };

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Watch ${item.title}`}
      className={`group relative overflow-hidden rounded-lg bg-[#111115] border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer ${
        isVert ? 'aspect-[9/16] max-w-[340px] mx-auto w-full' : 'aspect-video w-full'
      }`}
    >
      {/* Thumbnail */}
      <img
        src={thumbSrc}
        alt={item.title}
        onError={fallbackThumb}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 group-hover:via-black/10 transition-colors duration-300" />

      {/* Play Icon Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-md">
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </div>
      </div>

      {/* Title at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white drop-shadow-md group-hover:text-white transition-colors">
          {item.title}
        </h3>
      </div>
    </article>
  );
}
