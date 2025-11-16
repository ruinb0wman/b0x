import type { CSSProperties } from 'react';
import { useTerminalStore } from '../../stores/TerminalStore';
import { useEffect } from 'react';
import { genHandleKeyDown } from "./lib"

interface Props {
  renderPaneContent: (termId: string) => React.ReactNode;
}

export default function TilingWM({ renderPaneContent, }: Props) {
  const { state, dispatch } = useTerminalStore();

  // 激活鼠标点击的pane
  const handlePaneClick = (paneId: string) => {
    dispatch({ type: 'SET_ACTIVE_PANE', paneId });
  };

  // 处理快捷键
  const handleKeyDown = genHandleKeyDown(state, dispatch);

  // 键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.windows, state.activeWindowIndex, dispatch]);

  // 递归渲染 Pane
  const renderPane = (paneId: string): React.ReactNode => {
    const activeWindow = state.windows[state.activeWindowIndex];
    const pane = activeWindow.panes[paneId];
    if (!pane) return null;

    // render leaf pane
    if (pane.type === 'Leaf') {
      const isActive = activeWindow.activePaneId === pane.id;
      return (
        <div
          key={pane.id}
          onClick={() => handlePaneClick(pane.id)}
          style={styles.leafPaneContainer({ flex: pane.flex })}
          data-id={pane.id}
        >
          <div style={styles.leafPane({ isActive })} >
            {pane.termId ? renderPaneContent(pane.termId) : null}
          </div>
        </div>
      );
    }

    // render non-leaf pane
    return (
      <div
        key={pane.id}
        style={styles.nonLeafPaneContainer({ type: pane.type, flex: pane.flex || 1 })}
        data-id={pane.id}
      >
        {pane.childrenId.map((childId) => renderPane(childId))}
      </div>
    );
  };

  return (
    <div style={styles.tilingWM}>
      {renderPane(state.windows[state.activeWindowIndex].rootPaneId)}
    </div>
  );
}

const styles: {
  leafPaneContainer: (opt: { flex: number | null }) => CSSProperties;
  leafPane: (opt: { isActive: boolean }) => CSSProperties;
  nonLeafPaneContainer: (opt: { type: 'Vertical' | 'Horizon', flex: number | null }) => CSSProperties;
  tilingWM: CSSProperties
} = {
  tilingWM: { width: '100%', height: '100%', overflow: 'hidden' },
  nonLeafPaneContainer: ({ type, flex }) => {
    return {
      display: 'flex',
      flexDirection: type === 'Vertical' ? 'column' : 'row',
      width: '100%',
      height: '100%',
      gap: 2,
      flex: flex || 1,
    }

  },
  leafPaneContainer: ({ flex }) => {
    return {
      width: '100%',
      height: '100%',
      flex: flex || 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: '#1a1b26',
    }
  },
  leafPane: ({ isActive }) => {
    return {
      padding: '5px',
      boxSizing: 'border-box',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow: isActive
        ? '0 0 0 2px #7aa2f7'
        : '0 0 0 2px #ddd',
      zIndex: isActive ? 1 : 0,
      position: 'absolute',
    }
  }
}
