import React from 'react';

export default function DesktopIcon({ label, icon = '📄', onDoubleClick }) {
  return (
    <button
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center gap-2 p-2 rounded hover:bg-surface/40 focus:outline-none focus:ring-2 focus:ring-ink select-none"
      title={label}
    >
      <div className="w-12 h-12 flex items-center justify-center border-2 border-ink bg-paper">
        <span className="text-xl leading-none">{icon}</span>
      </div>
      <span className="text-xs text-ink font-mono">{label}</span>
    </button>
  );
}
