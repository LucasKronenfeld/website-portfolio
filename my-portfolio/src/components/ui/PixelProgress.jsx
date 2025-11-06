import React from 'react';
import { Link } from 'react-router-dom';

// Retro segmented progress display. If value is undefined, just render the label and sublabel.
export default function PixelProgress({ label, sublabel, value, to }) {
  const segments = 12; // nice even count for chunky look
  const filled = Math.max(0, Math.min(segments, Math.round(((value || 0) / 100) * segments)));

  return (
    <div className="mb-3">
      <div className="font-mono text-sm">
        {to ? (
          <Link to={to} className="text-primary hover:underline">{label}</Link>
        ) : (
          <span className="text-ink">{label}</span>
        )}
      </div>
      {sublabel && <div className="text-xs text-muted mb-1">{sublabel}</div>}
      <div className="flex items-center gap-2">
        <div className="flex border border-ink p-[2px] bg-paper">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className={`h-4 w-4 border border-ink ${i < filled ? 'bg-ink' : 'bg-transparent'}`} />
          ))}
        </div>
        {typeof value === 'number' && (
          <span className="text-xs text-ink">{Math.round(value)}%</span>
        )}
      </div>
    </div>
  );
}
