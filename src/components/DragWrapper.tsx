import React from 'react';

export default function DragWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ WebkitAppRegion: 'drag', width: '100%' }} >
      <div style={{ WebkitAppRegion: 'no-drag', display: 'inline-block' }}>
        {children}
      </div>
    </div>
  );
}
