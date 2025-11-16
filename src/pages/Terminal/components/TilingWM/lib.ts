export function genHandleKeyDown(state: Terminal.WindowTabState,
  dispatch: (action: Terminal.TilingWMAction) => void) {
  return (e: KeyboardEvent) => {
    console.log('handleKeyDown', e);
    const activeWindow = state.windows[state.activeWindowIndex];
    if (!activeWindow.activePaneId) return;

    const directionMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    };

    // 新增pane
    if (e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      const dir = directionMap[e.key];
      if (dir) {
        dispatch({
          type: 'ATTACH_PANE',
          targetId: activeWindow.activePaneId,
          direction: dir,
        });
      }
      // 前端尺寸变化通知后端
    } else if (e.altKey && e.shiftKey) {
      e.preventDefault();
      const dir = directionMap[e.key];
      if (dir) {
        dispatch({
          type: 'RESIZE_PANE',
          targetId: activeWindow.activePaneId,
          direction: dir,
        });
      }
      // pane只有一个window有多个时关闭window否则只关闭pane
    } else if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      // Check if the current window has only one pane and there are multiple windows
      if (Object.keys(activeWindow.panes).length === 1 && state.windows.length > 1) {
        dispatch({
          type: 'CLOSE_WINDOW',
          windowIndex: state.activeWindowIndex,
        });
      } else {
        dispatch({
          type: 'CLOSE_PANE',
          targetId: activeWindow.activePaneId,
        });
      }
      // 在各个pane之间轮询
    } else if (e.ctrlKey && e.key === 'Tab') {
      e.preventDefault();
      dispatch({
        type: 'CYCLE_PANE',
        direction: e.shiftKey ? 'previous' : 'next', // Ctrl+Shift+Tab goes to previous pane
      });
    }
  };
}

