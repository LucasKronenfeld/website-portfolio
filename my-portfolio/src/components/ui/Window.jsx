import React from 'react';
import TitleBar from './TitleBar';

// Window variants:
// - default: full chrome (titlebar + outer border)
// - sheet: titlebar only (no thick outer border)
// - card: thin 1px border, no titlebar (for small items)
export default function Window({
  title = 'Window',
  rightSlot,
  variant = 'default',
  className = '',
  children,
}) {
  if (variant === 'card') {
    return (
      <div className={`border border-ink bg-paper p-3 ${className}`}>
        {children}
      </div>
    );
  }

  if (variant === 'sheet') {
    return (
      <div className={`bg-paper ${className}`}>
        <div className="mac-titlebar">
          <div className="mac-controls">
            <span className="mac-dot" />
            <span className="mac-dot" />
            <span className="mac-dot" />
          </div>
          <div className="mac-title">{title}</div>
          <div className="flex items-center gap-2">{rightSlot}</div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    );
  }

  // default
  return (
    <div className={`mac-window pixel-border ${className}`}>
      <TitleBar title={title} rightSlot={rightSlot} />
      <div className="mac-content">{children}</div>
    </div>
  );
}
