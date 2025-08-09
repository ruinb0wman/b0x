import { useTerminalStore } from '@/store/terminalStore/terminalStore'; // ← 这里改成你的 Zustand store 路径
import { useEffect } from 'react';

interface Props {
  renderPaneContent: (termId: string) => React.ReactNode;
}

export default function TilingWM({ renderPaneContent }: Props) {
  const { state, dispatch } = useTerminalStore();

  // 激活当前 Pane
  const handlePaneClick = (paneId: string) => {
    dispatch({ type: 'SET_ACTIVE_PANE', paneId });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!state.activePaneId) return;

    const directionMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    };

    if (e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      const dir = directionMap[e.key];
      if (dir) {
        dispatch({
          type: 'ATTACH_PANE',
          targetId: state.activePaneId,
          direction: dir,
        });
      }
    } else if (e.altKey && e.shiftKey) {
      e.preventDefault();
      const dir = directionMap[e.key];
      if (dir) {
        dispatch({
          type: 'RESIZE_PANE',
          targetId: state.activePaneId,
          direction: dir,
        });
      }
    } else if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      dispatch({
        type: 'CLOSE_PANE',
        targetId: state.activePaneId,
      });
    }
  };

  // 键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activePaneId, dispatch]);

  // 递归渲染 Pane
  const renderPane = (paneId: string): React.ReactNode => {
    const pane = state.panes[paneId];
    if (!pane) return null;

    if (pane.type === 'Leaf') {
      const isActive = state.activePaneId === pane.id;
      return (
        <div
          key={pane.id}
          onClick={() => handlePaneClick(pane.id)}
          style={{
            width: '100%',
            height: '100%',
            flex: pane.flex || 1,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '5px',
            backgroundColor: '#1a1b26',
          }}
          data-id={pane.id}
        >
          <div
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: isActive
                ? '0 0 0 2px #7aa2f7'
                : '0 0 0 2px #ddd',
              zIndex: isActive ? 1 : 0,
              position: 'absolute',
            }}
          >
            {pane.termId ? renderPaneContent(pane.termId) : null}
          </div>
        </div>
      );
    }

    return (
      <div
        key={pane.id}
        style={{
          display: 'flex',
          flexDirection: pane.type === 'Vertical' ? 'column' : 'row',
          width: '100%',
          height: '100%',
          gap: 2,
          flex: pane.flex || 1,
        }}
        data-id={pane.id}
      >
        {pane.childrenId.map((childId) => renderPane(childId))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {renderPane(state.rootPaneId)}
    </div>
  );
}

