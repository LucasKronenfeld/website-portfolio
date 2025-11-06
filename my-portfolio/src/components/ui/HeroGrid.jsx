import React from 'react';
import { motion } from 'framer-motion';

// Structured hero composition: center slot for children (RetroHero),
// surrounding 5x5 grid cells with pixel icons for a balanced layout.
export default function HeroGrid({ children }) {
  const size = 'w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14';
  const common = `pixelated ${size} transition-transform duration-150 hover:-translate-y-0.5`;

  const icons = {
    cam: '/retro%20header%20svg/pixel%20cam.svg',
    computer: '/retro%20header%20svg/retro%20computer%20pixel.svg',
    book: '/retro%20header%20svg/pixel%20book.svg',
    hiking: '/retro%20header%20svg/pixel%20hiking.svg',
    gym: '/retro%20header%20svg/pixel%20gym.svg',
    chef: '/retro%20header%20svg/chef%20pixel.svg',
  };

  return (
    <div className="relative inline-block border border-ink bg-paper p-1 md:p-2">
      {/* subtle dotted grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />
      <div className="relative grid grid-cols-3 grid-rows-3 place-items-center gap-1">
        {/* Top row, denser cluster */}
        <motion.img src={icons.cam} alt="" className={`${common}`} style={{ gridColumn: 2, gridRow: 1 }} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.05}} />
        <motion.img src={icons.chef} alt="" className={`${common}`} style={{ gridColumn: 3, gridRow: 1 }} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.10}} />

        {/* Middle row */}
        <motion.img src={icons.book} alt="" className={`${common}`} style={{ gridColumn: 1, gridRow: 2 }} initial={{opacity:0,x:-4}} animate={{opacity:1,x:0}} transition={{duration:.2, delay:.15}} />
        {/* Center: hero content */}
        <div style={{ gridColumn: 2, gridRow: 2 }} className="z-10">
          {children}
        </div>
        <motion.img src={icons.computer} alt="" className={`${common}`} style={{ gridColumn: 3, gridRow: 2 }} initial={{opacity:0,x:4}} animate={{opacity:1,x:0}} transition={{duration:.2, delay:.20}} />

        {/* Bottom row */}
        <motion.img src={icons.hiking} alt="" className={`${common}`} style={{ gridColumn: 1, gridRow: 3 }} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.25}} />
        <motion.img src={icons.gym} alt="" className={`${common}`} style={{ gridColumn: 2, gridRow: 3 }} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.30}} />
      </div>
    </div>
  );
}
