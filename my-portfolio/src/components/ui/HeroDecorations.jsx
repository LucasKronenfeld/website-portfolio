import React from 'react';
import { motion } from 'framer-motion';

// Small decorative pixel SVGs positioned around the hero
// Uses public assets under /retro header svg/*.svg
export default function HeroDecorations() {
  const size = 'absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24';
  const items = [
    {
      src: '/retro%20header%20svg/retro%20computer%20pixel.svg',
      alt: 'Retro computer',
      className: `${size} top-0 left-0 sm:-top-1 sm:-left-1 md:-top-2 md:-left-2`,
    },
    {
      src: '/retro%20header%20svg/pixel%20cam.svg',
      alt: 'Pixel camera',
      className: `${size} top-2 right-0 sm:right-1 md:right-2`,
    },
    {
      src: '/retro%20header%20svg/pixel%20book.svg',
      alt: 'Pixel book',
      className: `${size} bottom-0 left-0 sm:-left-2 md:-left-6`,
    },
    {
      src: '/retro%20header%20svg/pixel%20hiking.svg',
      alt: 'Pixel hiker',
      className: `${size} -bottom-2 right-2 sm:-bottom-4 md:right-6`,
    },
    {
      src: '/retro%20header%20svg/pixel%20gym.svg',
      alt: 'Pixel gym',
      // Centered under the hero text for symmetry; push further down via translate-y so it doesn't crowd 'university'
      className: `absolute w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 left-1/2 -translate-x-1/2 bottom-0 translate-y-2 sm:translate-y-4 md:translate-y-6`,
    },
    {
      src: '/retro%20header%20svg/chef%20pixel.svg',
      alt: 'Pixel chef',
      // Raise higher above the headshot area to avoid crowding
      className: `${size} -translate-x-1/2 left-1/2 -top-2 sm:-top-8 md:-top-12 lg:-top-14`,
    },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {items.map((it, i) => (
        <motion.img
          key={i}
          src={it.src}
          alt={it.alt}
          className={`${it.className} drop-shadow-none`} 
          style={{ imageRendering: 'pixelated' }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * i }}
        />
      ))}
    </div>
  );
}
