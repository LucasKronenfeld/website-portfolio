import React from 'react';
import Badge from './Badge';

export default function StickerGrid({ items = [] }) {
  if (!items || items.length === 0) {
    return <p className="text-muted text-sm">Add hobbies from Admin → Featured.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((h, i) => (
        <div key={i} className={`transform ${i % 3 === 0 ? 'rotate-0' : i % 3 === 1 ? '-rotate-1' : 'rotate-1'}`}>
          <Badge imgSrc={h.iconUrl} label={h.label} />
        </div>
      ))}
    </div>
  );
}
