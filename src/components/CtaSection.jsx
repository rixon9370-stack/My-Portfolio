import React from 'react';
import { Link } from 'react-router-dom';

export default function CtaSection() {
  const text = "START A PROJECT";
  let charCounter = 0;

  return (
    <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 flex items-center justify-center text-center px-4">
      <Link
        to="/contact"
        className="cta-rolling-btn group"
        aria-label="START A PROJECT"
      >
        <span className="cta-rolling-text" aria-hidden="true">
          {text.split('').map((char, i) => {
            if (char === ' ') {
              return (
                <span key={i} className="roll-char roll-space">
                  &nbsp;
                </span>
              );
            }
            const idx = charCounter++;
            return (
              <span
                key={i}
                className="roll-char"
                style={{ '--char-idx': idx }}
              >
                <span className="roll-char-inner">
                  <span className="char-top">{char}</span>
                  <span className="char-bottom">{char}</span>
                </span>
              </span>
            );
          })}
        </span>
        <span className="cta-underline" aria-hidden="true" />
      </Link>
    </section>
  );
}
