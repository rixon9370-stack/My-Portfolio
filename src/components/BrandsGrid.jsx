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
    <div className="w-full mt-24 text-center">
      <span className="block font-body text-xs font-semibold uppercase tracking-[0.14em] text-white/60 mb-8">
        Brands I've created for
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {BRANDS.map((b, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center p-6 sm:p-8 bg-[#111115] border border-white/10 rounded-lg hover:border-white/25 hover:bg-[#18181f] transition-all duration-300 group"
          >
            <img
              src={b.logo}
              alt={b.name}
              loading="lazy"
              className="max-h-12 w-auto object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
