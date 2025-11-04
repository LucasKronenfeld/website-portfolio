import React from 'react';
import Avatar from '../assets/pixelLucas.svg';

export default function RetroHero() {
  return (
    <section className="w-full flex items-center justify-center py-12 md:py-14">
      <div className="text-center flex flex-col items-center gap-3">
        {/* Pixel avatar */}
        <img
          src={Avatar}
          alt="Pixel avatar of Lucas Kronenfeld"
          className="mx-auto h-24 w-24 md:h-28 md:w-28 pixelated border-2 border-ink bg-paper"
          decoding="async"
          loading="eager"
        />

        <h1 className="font-mono text-3xl md:text-4xl leading-100 text-ink">Lucas Kronenfeld</h1>
        <p className="font-mono text-base md:text-lg leading-110 text-muted">
          Building software like it's 1989 — but with TypeScript instead of C.
        </p>
        <p className="font-mono text-sm md:text-base leading-110 text-muted">
          Designer • Developer • Guy who likes making things look like computers from the past.
        </p>
      </div>
    </section>
  );
}
