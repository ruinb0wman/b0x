import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { createTerm, createPane, attachPane, resizePane, closePane } from './lib';

type Store = {
  state: Terminal.WindowTabState;
  dispatch: (action: Terminal.TilingWMAction | { type: 'SET_ACTIVE_WINDOW', windowIndex: number } | { type: 'NEW_WINDOW' }) => void;
};

// 初始化 state
function genTilingState() {
  const initialTerm = createTerm();
  const rootPane = createPane(initialTerm.id, null);
  return {
    panes: { [rootPane.id]: rootPane },
    rootPaneId: rootPane.id,
    activePaneId: null,
    // termId -> node-pty process id(pid)
    session: {}
  };
}

const initialState: Terminal.WindowTabState = {
  activeWindowIndex: 0,
  windows: [genTilingState()]
};

export const useTerminalStore = create<Store>()(
  persist(
    (set) => ({
      state: initialState,

      dispatch: (action) => {
        set(
          produce<Store>((draft) => {
            if (action.type === 'SET_ACTIVE_WINDOW') {
              draft.state.activeWindowIndex = action.windowIndex;
              return;
            }
            if (action.type === 'NEW_WINDOW') {
              draft.state.windows.push(genTilingState());
              draft.state.activeWindowIndex = draft.state.windows.length - 1;
              return;
            }

            const activeIndex = draft.state.activeWindowIndex;
            switch (action.type) {
              case 'SET_ACTIVE_PANE':
                draft.state.windows[activeIndex].activePaneId = action.paneId;
                break;

              case 'ATTACH_PANE':
                attachPane(draft.state.windows[activeIndex], action);
                break;

              case 'RESIZE_PANE':
                resizePane(draft.state.windows[activeIndex], action);
                break;

              case 'CLOSE_PANE':
                closePane(draft.state.windows[activeIndex], action);
                break;

              case 'SET_SESSION':
                draft.state.windows[activeIndex].session[action.termId] = action.pid;
                break;
            }
          })
        );
      },
    }),
    {
      name: 'tiling-wm-store',
    }
  )
);

// 在页面关闭时清除session, 确保下次打开时能创建新的pty进程
window.ipcRenderer.on('window-close', () => {
  const currentState = { ...useTerminalStore.getState().state };
  currentState.windows = currentState.windows.map((w) => {
    // 通知electron关闭pty
    Object.values(w.session).forEach(pid => {
      window.ipcRenderer.invoke('terminal:destroy', pid);
    })
    return {
      ...w,
      session: {}
    }
  });
  useTerminalStore.setState({ state: currentState });
});
