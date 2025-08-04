import React from 'react';

export default function DragWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ WebkitAppRegion: 'drag' }}
    >
      {children}
    </div>
  );
}
