import type { CSSProperties } from 'react';
import { useTerminalStore } from '../../stores/TerminalStore'
import { useEffect } from 'react';
import { TERMINAL_THEME, THEME } from '@/assets/theme';

export default function WindowTab() {
  const { state, dispatch } = useTerminalStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey) {
        if (e.key >= '1' && e.key <= '5') {
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
    <div style={styles.container}>
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

function TabButton({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick?: () => void }) {
  return (
    <div style={styles.tabButton(isActive)} onClick={onClick} >
      {children}
    </div>
  );
}

const styles: {
  container: CSSProperties;
  tabButton: (isActive: boolean) => CSSProperties;
} = {
  container:
    { display: 'flex', gap: THEME.spacing }
  ,
  tabButton(isActive: boolean) {
    return {
      width: THEME.font_es * 2,
      height: THEME.font_es * 2,
      color: isActive ? TERMINAL_THEME.blue : '#fff',
      border: '1px solid',
      fontSize: THEME.font_es,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none'
    }
  }
}
