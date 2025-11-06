import React from 'react';

export default function SectionDivider({ variant = 'line', className = '' }) {
  if (variant === 'dots') {
    return <div className={`w-full border-t border-dotted border-ink/50 my-6 ${className}`} />;
  }
  if (variant === 'command') {
    return (
      <div className={`flex items-center justify-center my-6 ${className}`}>
        <div className="flex-1 border-t border-ink/40" />
        <span className="mx-3 text-ink/60 select-none">⌘</span>
        <div className="flex-1 border-t border-ink/40" />
      </div>
    );
  }
  // line (default)
  return <div className={`w-full border-t border-ink/40 my-6 ${className}`} />;
}
