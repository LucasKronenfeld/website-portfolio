import React from 'react';
import Avatar from '../assets/pixelLucas.svg';

export default function RetroHero({ role, location, university }) {
  return (
    <section className="w-full flex items-center justify-center py-6 md:py-8">
      <div className="text-center flex flex-col items-center gap-2">
        {/* Pixel avatar */}
        <img
          src={Avatar}
          alt="Pixel avatar of Lucas Kronenfeld"
          className="mx-auto h-24 w-24 md:h-28 md:w-28 pixelated border-2 border-ink bg-paper"
          decoding="async"
          loading="eager"
        />

        <h1 className="font-mono text-3xl md:text-4xl leading-100 text-ink">Lucas Kronenfeld</h1>
        {role && (
          <p className="font-mono text-base md:text-lg leading-110 text-muted">{role}</p>
        )}
        {location && (
          <p className="font-mono text-sm md:text-base leading-110 text-muted">{location}</p>
        )}
        {university && (
          <p className="font-mono text-sm md:text-base leading-110 text-muted">{university}</p>
        )}
      </div>
    </section>
  );
}
