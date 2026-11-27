import React from 'react';

const BRANDS = [
  { name: 'LuLu Mall', logo: '/assets/brands/lulu-mall.png' },
  { name: 'Amana Toyota', logo: '/assets/brands/amana-toyota.png' },
  { name: 'Odyssia', logo: '/assets/brands/odyssia.png' },
  { name: 'Rajakumari Group', logo: '/assets/brands/rajakumari-group.png' },
  { name: 'Nesto', logo: '/assets/brands/nesto.png' },
  { name: 'Nahdi Mandi', logo: '/assets/brands/nahdi-mandi.png' },
];

export default function BrandsGrid() {
  return (
    <section className="w-full mt-24 md:mt-32" aria-label="Brands I've created for">
      <span className="block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-6 text-center px-4">
        Brands I've created for
      </span>

      {/* Static evenly spaced row with hairline rules above and below */}
      <div className="w-full border-y border-white/15 py-8 sm:py-10 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 items-center justify-items-center">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
              className="flex items-center justify-center w-full max-w-[148px] sm:max-w-[156px] h-[66px] sm:h-[72px] px-2.5 py-1.5 rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:!bg-white shadow-sm"
            >
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                className="max-h-[58px] sm:max-h-[64px] max-w-[94%] w-auto h-auto object-contain block mx-auto select-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
