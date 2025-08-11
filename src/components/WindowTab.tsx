import { useTerminalStore } from '@/store/terminalStore/terminalStore'
import { useEffect } from 'react';

export default function WindowTab() {
  const { state, dispatch } = useTerminalStore();

  function TabButton({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick?: () => void }) {
    return (
      <div
        style={{
          width: '20px',
          height: '20px',
          border: isActive ? '1px solid blue' : '1px solid #fff',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey) {
        if (e.key >= '1' && e.key <= '9') {
          const index = parseInt(e.key, 10) - 1;
          if (index >= 0 && index < state.windows.length) {
            dispatch({ type: 'SET_ACTIVE_WINDOW', windowIndex: index });
            e.preventDefault();
          }
        } else if (e.key.toLowerCase() === 't') {
          dispatch({ type: 'NEW_WINDOW' });
          e.preventDefault();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.windows.length, dispatch]);

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {state.windows.map((_, i) => {
        return (
          <TabButton
            key={i}
            isActive={state.activeWindowIndex === i}
            onClick={() => dispatch({ type: 'SET_ACTIVE_WINDOW', windowIndex: i })}
          >
            {i + 1}
          </TabButton>
        );
      })}
      <TabButton
        isActive={false}
        onClick={() => dispatch({ type: 'NEW_WINDOW' })}
      >
        +
      </TabButton>
    </div>
  );
}
