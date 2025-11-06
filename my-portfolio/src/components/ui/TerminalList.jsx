import React from 'react';
import { Link } from 'react-router-dom';

// items: [{ text, meta, to }]
export default function TerminalList({ items = [] }) {
  return (
    <div className="font-mono text-sm">
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline gap-2 mb-2">
          <span className="text-ink select-none">&gt;</span>
          {it.to ? (
            <Link to={it.to} className="text-primary hover:underline">{it.text}</Link>
          ) : (
            <span className="text-ink">{it.text}</span>
          )}
          {it.meta && <span className="ml-auto text-xs text-muted">{it.meta}</span>}
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-muted">—</div>
      )}
    </div>
  );
}
