import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Brand Discovery',
    desc: 'Every project begins with the brand itself, its goals, audience, competitors, and tone, before a single frame is made.',
  },
  {
    num: '02',
    title: 'Brief',
    desc: 'Project goals, aesthetic references, target platforms, and delivery schedule are locked in upfront.',
  },
  {
    num: '03',
    title: 'Concept & Script',
    desc: "The concept and script take shape, built around the brand's voice and the message it needs to send.",
  },
  {
    num: '04',
    title: 'AI Generation',
    desc: 'Prompting and direction come from Claude and ChatGPT. Images are generated with Midjourney and Gemini, video with Kling, Seedance, and Veo, and audio and music with ElevenLabs and Suno.',
  },
  {
    num: '05',
    title: 'Edit',
    desc: 'Pacing, color grading, and sound design are shaped to match the tone of the brand.',
  },
  {
    num: '06',
    title: 'Review & Delivery',
    desc: 'The cut is reviewed and revised, then final files are exported and optimized for the intended platform.',
  },
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
  'Suno',
];

const COL_CLASSES = [
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="w-full pt-28 md:pt-36">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        {/* Header - Consistent with site display style */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-white mb-4">
            Workflow
          </h2>
          <p className="font-body text-base sm:text-lg max-w-2xl mx-auto text-white/70">
            Every project begins with the brand itself, its goals, audience, competitors, and tone, before a single frame is made.
          </p>
        </div>

        {/* Desktop: Horizontal connected timeline with staggered top/bottom steps (lg+) */}
        <div className="hidden lg:block mb-24">
          <div className="grid grid-cols-6 items-stretch">
            {/* Continuous horizontal hairline through Row 2 */}
            <div
              className="col-start-1 col-end-7 row-start-2 self-center h-px w-full bg-white/20 pointer-events-none"
              aria-hidden="true"
            />

            {STEPS.map((s, idx) => {
              const isAbove = idx % 2 === 0; // 01, 03, 05 above; 02, 04, 06 below
              const colClass = COL_CLASSES[idx];
              // Center-only spread on inner columns so outer columns 01 & 06 keep stems dead-center over dots
              const spreadClass =
                idx === 0 || idx === STEPS.length - 1
                  ? 'px-1'
                  : '-mx-5 xl:-mx-6';

              return (
                <React.Fragment key={s.num}>
                  {/* Dot sitting directly on the center timeline track */}
                  <div
                    className={`${colClass} row-start-2 self-center justify-self-center relative z-10 flex items-center justify-center py-2.5`}
                    aria-hidden="true"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-[#0a0a0c]" />
                  </div>

                  {/* Step content placed alternating above (Row 1) or below (Row 3) */}
                  <div
                    className={`${colClass} ${
                      isAbove ? 'row-start-1 self-end' : 'row-start-3 self-start'
                    } flex flex-col items-center text-center ${spreadClass}`}
                  >
                    {!isAbove && (
                      <span className="w-px h-5 bg-white/20 mb-3 block" aria-hidden="true" />
                    )}

                    <span className="font-display text-sm font-bold tracking-[0.18em] text-white/45 mb-1.5">
                      {s.num}
                    </span>
                    <h3 className="font-display text-xl xl:text-2xl font-bold uppercase tracking-tight text-white mb-2 leading-tight">
                      {s.title}
                    </h3>
                    <p className="font-body text-xs xl:text-[13px] text-white/75 leading-relaxed">
                      {s.desc}
                    </p>

                    {isAbove && (
                      <span className="w-px h-5 bg-white/20 mt-3 block" aria-hidden="true" />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet: Vertical connected timeline (< lg) */}
        <div className="lg:hidden relative max-w-xl mx-auto mb-20 pl-8 sm:pl-10">
          {/* Continuous vertical hairline */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-white/20 pointer-events-none"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {STEPS.map((s) => (
              <div key={s.num} className="relative text-left">
                {/* Small dot sitting on the vertical line */}
                <span
                  className="absolute -left-[29.5px] sm:-left-[37.5px] top-2 w-2.5 h-2.5 rounded-full bg-white ring-4 ring-[#0a0a0c]"
                  aria-hidden="true"
                />

                <span className="block font-display text-xs font-bold tracking-[0.18em] text-white/45 mb-1">
                  {s.num}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="font-body text-sm text-white/75 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools I Use — plain large typographic stream separated by diagonal slashes */}
        <div className="text-center pt-8">
          <span className="block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-8">
            Tools I Use
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-3 max-w-5xl mx-auto">
            {TOOLS.map((tool, idx) => (
              <span
                key={tool}
                className="inline-flex items-center gap-x-4 sm:gap-x-6 whitespace-nowrap"
              >
                <span className="font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-bold uppercase tracking-tight text-white/85 hover:text-white transition-colors duration-200">
                  {tool}
                </span>
                {idx < TOOLS.length - 1 && (
                  <span
                    className="font-body text-xl sm:text-3xl font-extralight text-white/25 select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
