import React from 'react';
import TitleBar from './TitleBar';

export default function WindowWrapper({ title = 'Lucas Portfolio', rightSlot, className = '', children }) {
  return (
    <div className={`mac-window pixel-border ${className}`}>
      <TitleBar title={title} rightSlot={rightSlot} />
      <div className="mac-content">
        {children}
      </div>
    </div>
  );
}
