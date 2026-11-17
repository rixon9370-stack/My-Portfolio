import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Brand Discovery',
    desc: 'Every project begins with the brand itself, its goals, audience, competitors, and tone, before a single frame is made.'
  },
  {
    num: '02',
    title: 'Brief',
    desc: 'Project goals, aesthetic references, target platforms, and delivery schedule are locked in upfront.'
  },
  {
    num: '03',
    title: 'Concept & Script',
    desc: 'The concept and script take shape, built around the brand\'s voice and the message it needs to send.'
  },
  {
    num: '04',
    title: 'AI Generation',
    desc: 'Prompting and direction come from Claude and ChatGPT. Images are generated with Midjourney and Gemini, video with Kling, Seedance, and Veo, and audio and music with ElevenLabs and Suno.'
  },
  {
    num: '05',
    title: 'Edit',
    desc: 'Pacing, color grading, and sound design are shaped to match the tone of the brand.'
  },
  {
    num: '06',
    title: 'Review & Delivery',
    desc: 'The cut is reviewed and revised, then final files are exported and optimized for the intended platform.'
  }
];

const TOOLS = [
  'ChatGPT',
  'Claude',
  'Midjourney',
  'Gemini',
  'Kling',
  'Seedance',
  'Veo',
  'ElevenLabs',
  'Suno'
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="w-full pt-28 md:pt-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header - Solid crisp text without color fringe */}
        <div className="text-center mb-16">
          <h2
            style={{
              textShadow: 'none',
              filter: 'none',
              mixBlendMode: 'normal',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
            className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4"
          >
            Workflow
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              textShadow: 'none',
              filter: 'none',
              mixBlendMode: 'normal',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
            className="font-body text-base sm:text-lg max-w-2xl mx-auto"
          >
            Every project begins with the brand itself, its goals, audience, competitors, and tone, before a single frame is made.
          </p>
        </div>

        {/* 6 Steps Grid - Clean 3-column, 2-row grid with equal heights and no empty gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 mb-20">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-[#111115] border border-white/10 rounded-lg flex flex-col justify-start hover:border-white/20 transition-colors h-full"
            >
              <span className="font-display text-2xl font-bold text-white/40 mb-3">
                {s.num}
              </span>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-3">
                {s.title}
              </h3>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.78)' }}
                className="font-body text-sm leading-relaxed"
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tools I Use */}
        <div className="text-center pt-8 border-t border-white/10">
          <span className="block font-body text-xs font-semibold uppercase tracking-[0.14em] text-white/60 mb-6">
            Tools I Use
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((t, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 rounded-full bg-[#111115] border border-white/10 text-white font-body text-xs sm:text-sm font-medium tracking-wide hover:border-white/30 hover:bg-[#18181f] transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
