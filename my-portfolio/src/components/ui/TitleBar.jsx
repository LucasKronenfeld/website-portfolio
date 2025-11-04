import React from 'react';

export default function TitleBar({ title = 'Window', rightSlot }) {
  return (
    <div className="mac-titlebar">
      <div className="mac-controls">
        <span className="mac-dot" />
        <span className="mac-dot" />
        <span className="mac-dot" />
      </div>
      <div className="mac-title">{title}</div>
      <div className="flex items-center gap-2">
        {rightSlot}
      </div>
    </div>
  );
}
