import React from 'react';

export default function DragWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ 
        WebkitAppRegion: 'drag',
        height: '40px',  // Give it a fixed height
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px'
      }}
    >
      {children}
    </div>
  );
}
