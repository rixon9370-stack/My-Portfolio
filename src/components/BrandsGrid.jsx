import React from 'react';

const BRANDS = [
  { name: 'LuLu Mall', logo: '/assets/brands/lulu-mall.png', hasColor: true },
  { name: 'Amana Toyota', logo: '/assets/brands/amana-toyota.png', hasColor: false },
  { name: 'Odyssia', logo: '/assets/brands/odyssia.png', hasColor: false },
  { name: 'Rajakumari Group', logo: '/assets/brands/rajakumari-group.png', hasColor: true },
  { name: 'Nesto', logo: '/assets/brands/nesto.png', hasColor: true },
  { name: 'Nahdi Mandi', logo: '/assets/brands/nahdi-mandi.png', hasColor: false },
];

/* Repeat twice per track half so ultra-wide viewports (1920px+) never show an empty gap */
const MARQUEE_HALF = [...BRANDS, ...BRANDS];

function BrandTrackSet({ hidden = false }) {
  return (
    <div className="inline-flex items-center" aria-hidden={hidden || undefined}>
      {MARQUEE_HALF.map((b, idx) => (
        <div
          key={`${b.name}-${idx}`}
          className="brand-logo-item flex items-center justify-center shrink-0 px-8 sm:px-14"
        >
          <img
            src={b.logo}
            alt={hidden ? '' : b.name}
            loading="lazy"
            className={`brand-logo-img ${
              b.hasColor ? 'brand-logo-img--color' : 'brand-logo-img--mono'
            } h-16 sm:h-20 w-auto max-w-[180px] object-contain select-none`}
          />
        </div>
      ))}
    </div>
  );
}

export default function BrandsGrid() {
  return (
    <section className="w-full mt-24 md:mt-32" aria-label="Brands I've created for">
      <span className="block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-6 text-center px-4">
        Brands I've created for
      </span>

      {/* Full-width marquee strip with hairline rules above and below only */}
      <div className="w-full border-y border-white/15 py-6 sm:py-8 overflow-hidden select-none">
        <div className="brands-marquee-track">
          <BrandTrackSet />
          <BrandTrackSet hidden />
        </div>
      </div>
    </section>
  );
}
