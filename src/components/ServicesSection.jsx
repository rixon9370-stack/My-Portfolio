import React, { useState } from 'react';

const SERVICES = [
  {
    id: 1,
    title: 'Cinematic Films',
    description: 'Films built around strong visuals and cinematic motion, generated with Kling and Seedance.',
  },
  {
    id: 2,
    title: 'Commercial Ads',
    description: 'Brand and product ads made to capture attention, produced with Kling and Gemini for modern campaigns.',
  },
  {
    id: 3,
    title: 'Scriptwriting',
    description: 'Concepts, storyboards, and scripts developed with ChatGPT and Claude to keep viewers engaged.',
  },
  {
    id: 4,
    title: 'AI Poster Design',
    description: 'Campaign posters and key visuals generated with Midjourney for digital and print formats.',
  },
  {
    id: 5,
    title: 'Editing & Motion Graphics',
    description: 'Pacing, color grading, and motion graphics polished to make every frame feel complete.',
  },
  {
    id: 6,
    title: 'AI Music & Sound',
    description: 'Original soundtracks generated with Suno and professional voiceovers produced with ElevenLabs.',
  },
];

function ServiceItem({ service, isOpen, onToggle }) {
  return (
    <div className="text-left">
      <button
        type="button"
        onClick={() => onToggle(service.id)}
        aria-expanded={isOpen}
        className="group w-full text-left cursor-pointer focus:outline-none"
      >
        <h3
          className={`font-display text-[clamp(1.9rem,3.4vw,3.1rem)] font-bold uppercase tracking-tight leading-[1.04] transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'
          }`}
        >
          {service.title}
        </h3>

        {/* Thin underline that extends on hover / remains extended when open */}
        <span className="relative block w-full h-px mt-3.5 bg-white/15 overflow-hidden" aria-hidden="true">
          <span
            className={`absolute inset-y-0 left-0 w-full bg-white origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </span>
      </button>

      {/* Smoothly sliding description underneath with zero boxes or borders */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [openIds, setOpenIds] = useState([]);

  const toggleService = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const leftColumn = SERVICES.slice(0, 3);
  const rightColumn = SERVICES.slice(3, 6);

  return (
    <section id="services" className="w-full pt-28 md:pt-36">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-white mb-4">
            SERVICES
          </h2>
          <p className="font-body text-base sm:text-lg text-white/70">
            Concept, script, visuals and final edit, all in one place.
          </p>
        </div>

        {/* Two-column asymmetric list (second column vertically offset on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-16 lg:gap-x-24 items-start">
          <div className="flex flex-col gap-10 md:gap-12">
            {leftColumn.map((s) => (
              <ServiceItem
                key={s.id}
                service={s}
                isOpen={openIds.includes(s.id)}
                onToggle={toggleService}
              />
            ))}
          </div>

          <div className="flex flex-col gap-10 md:gap-12 md:mt-16">
            {rightColumn.map((s) => (
              <ServiceItem
                key={s.id}
                service={s}
                isOpen={openIds.includes(s.id)}
                onToggle={toggleService}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
