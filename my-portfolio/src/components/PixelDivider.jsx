import React from 'react';

export default function PixelDivider({ variant = 'ascii' }) {
  if (variant === 'ascii') {
    return (
      <div className="w-full flex items-center justify-center py-3 select-none">
        <span className="font-mono text-ink text-sm">──────── ⌘ ────────</span>
      </div>
    );
  }
  if (variant === 'block') {
    return (
      <div className="w-full flex items-center justify-center py-3 select-none">
        <span className="font-mono text-ink text-sm">▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄</span>
      </div>
    );
  }
  return <hr className="border-ink border-t-2 my-3" />;
}
