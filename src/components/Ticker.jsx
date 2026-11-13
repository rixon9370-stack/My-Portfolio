import React from 'react';

const TICKER_ITEMS = [
  'CINEMATIC',
  'FASHION & JEWELLERY',
  'COMMERCIAL',
  'BRAND FILMS',
  'RETAIL & SHOPPING',
  'APP PROMOS',
];

export default function Ticker() {
  const content = (
    <div className="inline-flex items-center">
      {TICKER_ITEMS.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white whitespace-nowrap">
            {item}
          </span>
          <span className="text-[10px] text-white/40 mx-8 sm:mx-12 select-none">
            &#9670;
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="relative z-20 h-16 bg-[#0a0a0c] border-y border-white/10 flex items-center overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="ticker-track">
        {content}
        {content}
      </div>
    </div>
  );
}
