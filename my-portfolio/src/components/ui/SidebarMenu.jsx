import React from 'react';

export default function SidebarMenu({ items = [], activeKey, onSelect }) {
  return (
    <aside className="bg-surface border-r-2 border-ink p-3 w-48">
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect?.(item.key)}
            className={`w-full text-left px-2 py-1 border-2 border-ink ${
              activeKey === item.key ? 'bg-paper' : 'bg-surface'
            }`}
          >
            <span className="font-mono text-sm text-ink">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
