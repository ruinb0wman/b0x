import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { createTerm, createPane, attachPane, resizePane, closePane } from './lib';

type Store = {
  state: Terminal.WindowTabState;
  dispatch: (action: Terminal.TilingWMAction) => void;
};

// 初始化 state
const initialTerm = createTerm();
const rootPane = createPane(initialTerm.id, null);

const initialState: Terminal.WindowTabState = { activeWindowIndex: 0, windows: [genTilingState()] }

function genTilingState() {
  return {
    panes: { [rootPane.id]: rootPane },
    rootPaneId: rootPane.id,
    activePaneId: null,
    // termId -> node-pty process id(pid)
    session: {}
  };
}

export const useTerminalStore = create<Store>()(
  persist(
    (set) => ({
      state: initialState,

      dispatch: (action) => {
        set(
          produce<Store>((draft) => {
            const activeIndex = draft.state.activeWindowIndex;
            switch (action.type) {
              case 'SET_ACTIVE_PANE':
                draft.state.windows[activeIndex].activePaneId = action.paneId;
                // draft.state.activePaneId = action.paneId;
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
  const state = { ...useTerminalStore.getState().state };
  state.windows.map((w) => {
    return {
      ...w,
      session: {}
    }
  })
  useTerminalStore.setState({ state });
})
