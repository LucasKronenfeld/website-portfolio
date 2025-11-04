import React from 'react';

export default function DesktopIcon({ label, icon = '📄', src, onClick, onDoubleClick }) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center gap-2 p-2 focus:outline-none select-none"
      title={label}
    >
      <div className="w-12 h-12 flex items-center justify-center border-2 border-ink bg-paper transition-transform duration-150 hover:-translate-y-0.5">
        {src ? (
          <img src={src} alt={label} className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-xl leading-none">{icon}</span>
        )}
      </div>
      <span className="text-xs text-ink font-mono leading-110 text-center px-1">
        {label}
      </span>
    </button>
  );
}
