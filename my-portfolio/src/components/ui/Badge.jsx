import React from 'react';

export default function Badge({ icon, imgSrc, label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 border border-ink px-2 py-1 text-xs bg-surface ${className}`}>
      {imgSrc ? (
        <img src={imgSrc} alt="" className="h-4 w-4 object-contain pixelated" />
      ) : (
        icon && <span className="select-none" aria-hidden>{icon}</span>
      )}
      <span>{label}</span>
    </span>
  );
}
