import React from 'react';
import Avatar from '../assets/pixelLucas.svg';
import { motion } from 'framer-motion';

// Structured hero with 3 explicit rows:
// Row 1: computer | avatar + name | camera
// Row 2: book | role/location/university text | barbell bench
// Row 3: hiking guy | chef
export default function StructuredHero({ role, location, university }) {
  const imgCommon = 'pixelated select-none';
  const size = 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24';
  const fade = (delay = 0) => ({ initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Row 1 */}
      <div className="flex items-center justify-center gap-6">
        <motion.img {...fade(0.05)} src="/retro%20header%20svg/retro%20computer%20pixel.svg" alt="Pixel computer" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
        <motion.div {...fade(0.1)} className="flex flex-col items-center">
          <img
            src={Avatar}
            alt="Pixel avatar of Lucas Kronenfeld"
            className="mx-auto h-24 w-24 md:h-28 md:w-28 pixelated border-2 border-ink bg-paper"
            decoding="async"
            loading="eager"
            style={{ imageRendering: 'pixelated' }}
          />
          <h1 className="font-mono text-3xl md:text-4xl leading-100 text-ink mt-2">Lucas Kronenfeld</h1>
        </motion.div>
        <motion.img {...fade(0.15)} src="/retro%20header%20svg/pixel%20cam.svg" alt="Pixel camera" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Row 2 */}
      <div className="flex items-start justify-center gap-6">
        <motion.img {...fade(0.2)} src="/retro%20header%20svg/pixel%20book.svg" alt="Pixel book" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
        <motion.div {...fade(0.25)} className="flex flex-col items-center gap-1 min-w-[200px]">
          {role && <p className="font-mono text-base md:text-lg leading-110 text-muted">{role}</p>}
          {location && <p className="font-mono text-sm md:text-base leading-110 text-muted">{location}</p>}
          {university && <p className="font-mono text-sm md:text-base leading-110 text-muted">{university}</p>}
        </motion.div>
        <motion.img {...fade(0.3)} src="/retro%20header%20svg/pixel%20gym.svg" alt="Pixel barbell incline bench" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Row 3 */}
      <div className="flex items-center justify-center gap-20 md:gap-24">
        <motion.img {...fade(0.35)} src="/retro%20header%20svg/pixel%20hiking.svg" alt="Pixel hiker" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
        <motion.img {...fade(0.4)} src="/retro%20header%20svg/chef%20pixel.svg" alt="Pixel chef" className={`${size} ${imgCommon}`} style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
}
