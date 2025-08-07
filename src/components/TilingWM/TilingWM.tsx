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
          dispatch({ type: 'ATTACH_PANE', targetId: state.activePaneId, direction: dir });
        }
      } else if (e.altKey && e.shiftKey) {
        e.preventDefault();
        const dir = directionMap[e.key];
        if (dir) {
          dispatch({ type: 'RESIZE_PANE', targetId: state.activePaneId, direction: dir });
        }
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
            width: '100%',
            height: '100%',
            flex: pane.flex || 1,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: "5px",
            backgroundColor: '#1a1b26',
          }}
        >
          {/* 从文档流中移出,确保置顶,从而能正常显示boxShadow */}
          <div style={{ top: 0, left: 0, right: 0, bottom: 0, boxShadow: isActive ? '0 0 0 2px #7aa2f7' : '0 0 0 2px #ddd', zIndex: isActive ? 1 : 0, position: 'absolute' }}>
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
          flex: pane.flex || 1
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
