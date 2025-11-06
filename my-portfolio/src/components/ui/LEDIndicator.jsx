import React from 'react';

// Tiny retro LED indicator with label
export default function LEDIndicator({ label = 'ONLINE', color = 'green', blinking = true, className = '' }) {
  const colorMap = {
    green: 'bg-green-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
    red: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]',
    blue: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]',
  };
  const dotClass = `${colorMap[color] || colorMap.green} ${blinking ? 'animate-pulse' : ''}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <span className="text-[11px] tracking-wider text-ink/80 font-mono select-none">{label}</span>
    </span>
  );
}
