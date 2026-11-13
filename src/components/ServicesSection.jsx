import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const SERVICES = [
  {
    id: 1,
    title: 'Cinematic Films',
    description: 'Story-driven films with striking visuals and cinematic motion, generated with Kling and Seedance.'
  },
  {
    id: 2,
    title: 'Commercial Ads',
    description: 'Scroll-stopping brand and product ads, produced with Kling and Gemini for high-impact campaigns.'
  },
  {
    id: 3,
    title: 'Scriptwriting',
    description: 'Sharp concepts, storyboards and high-retention scripts developed with ChatGPT and Claude.'
  },
  {
    id: 4,
    title: 'AI Poster Design',
    description: 'Eye-catching campaign posters and key visuals, generated with Midjourney for print and digital.'
  },
  {
    id: 5,
    title: 'Editing & Motion Graphics',
    description: 'Clean pacing, precision color grading, motion graphics and polished finishing for every frame.'
  },
  {
    id: 6,
    title: 'AI Music & Sound',
    description: 'Original soundtracks generated with Suno and studio-quality voiceovers produced with ElevenLabs.'
  },
];

export default function ServicesSection() {
  const [activeId, setActiveId] = useState(null);

  const toggleService = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="w-full pt-28 md:pt-36">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            SERVICES
          </h2>
          <p className="font-body text-base sm:text-lg text-white/70">
            Concept, script, visuals and final edit, all in one place.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((s) => {
            const isOpen = activeId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`p-6 sm:p-7 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isOpen
                    ? 'bg-[#18181f] border-white/30 shadow-lg'
                    : 'bg-[#111115] border-white/10 hover:border-white/20 hover:bg-[#141419]'
                }`}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleService(s.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                    {s.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 transition-colors group-hover:border-white">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-40 opacity-100 mt-4 pt-4 border-t border-white/10' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
