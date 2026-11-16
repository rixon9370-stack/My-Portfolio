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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
        {BRANDS.map((b, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
            className="flex items-center justify-center h-24 sm:h-24 px-6 py-4 rounded-[12px] transition-all duration-200 hover:scale-[1.03] hover:!bg-white shadow-sm group"
          >
            <img
              src={b.logo}
              alt={b.name}
              loading="lazy"
              className="max-h-12 sm:max-h-14 max-w-[85%] w-auto h-auto object-contain block mx-auto transition-transform duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
