import { useTilingWM } from './TilingWMProvider';
import { useEffect } from 'react';

export default function TilingWM({ renderPaneContent }: { renderPaneContent: (termId: string) => React.ReactNode }) {
  const { state, dispatch } = useTilingWM();

  // 激活当前 Pane
  const handlePaneClick = (paneId: string) => {
    dispatch({ type: 'SET_ACTIVE_PANE', paneId });
  };

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.activePaneId || !e.ctrlKey || !e.shiftKey) return;

      e.preventDefault();
      const directionMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const dir = directionMap[e.key];
      if (dir) {
        dispatch({ type: 'ATTACH_PANE', targetId: state.activePaneId, direction: dir });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activePaneId]);

  // 渲染 Pane 树
  const renderPane = (pane: any) => {
    if (pane.type === 'Leaf') {
      const isActive = state.activePaneId === pane.id;
      return (
        <div
          key={pane.id}
          onClick={() => handlePaneClick(pane.id)}
          style={{
            flex: 1,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: "5px",
            backgroundColor: '#1a1b26',
            width: '100%',
            height: '100%',
          }}
        >
          <div style={{ width: '100%', height: '100%', boxShadow: isActive ? '0 0 0 2px #7aa2f7' : '0 0 0 2px #ddd', zIndex: isActive ? 1 : 0, position: 'absolute' }}>
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
          flexDirection: pane.type === 'Vertical' ? 'row' : 'column',
          flex: 1,
          width: '100%',
          height: '100%',
          gap: 2
        }}
      >
        {pane.children.map(renderPane)}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {renderPane(state.rootPane)}
    </div>
  );
}
