import React from 'react';

const BRANDS = [
  { name: 'LuLu Mall', logo: '/assets/brands/lulu-mall.png', hasColor: true },
  { name: 'Amana Toyota', logo: '/assets/brands/amana-toyota.png', hasColor: false },
  { name: 'Odyssia', logo: '/assets/brands/odyssia.png', hasColor: false },
  { name: 'Rajakumari Group', logo: '/assets/brands/rajakumari-group.png', hasColor: true },
  { name: 'Nesto', logo: '/assets/brands/nesto.png', hasColor: true },
  { name: 'Nahdi Mandi', logo: '/assets/brands/nahdi-mandi.png', hasColor: false },
];

export default function BrandsGrid() {
  return (
    <section className="w-full mt-24 md:mt-32" aria-label="Brands I've created for">
      <span className="block font-body text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-6 text-center px-4">
        Brands I've created for
      </span>

      {/* Static evenly spaced strip with hairline rules above and below only */}
      <div className="w-full border-y border-white/15 py-8 sm:py-10 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 items-center justify-items-center">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="brand-logo-item flex items-center justify-center w-full"
            >
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                className={`brand-logo-img ${
                  b.hasColor ? 'brand-logo-img--color' : 'brand-logo-img--mono'
                } h-14 sm:h-16 lg:h-[72px] w-auto max-w-[150px] object-contain block mx-auto select-none`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
