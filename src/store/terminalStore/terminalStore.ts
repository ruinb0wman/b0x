import { create } from 'zustand';
import { produce } from 'immer';
import { createTerm, createPane, attachPane, resizePane, closePane } from './lib';

type Store = {
  state: Terminal.WindowTabState;
  dispatch: (action: Terminal.TilingWMAction | { type: 'SET_ACTIVE_WINDOW', windowIndex: number } | { type: 'NEW_WINDOW' } | { type: 'CLOSE_WINDOW', windowIndex: number }) => void;
};

// 初始化 state
function genTilingState() {
  const initialTerm = createTerm();
  const rootPane = createPane(initialTerm.id, null);
  return {
    panes: { [rootPane.id]: rootPane },
    rootPaneId: rootPane.id,
    activePaneId: rootPane.id,  // Set the initial pane as active
    focusedTermId: null,
    // termId -> node-pty process id(pid)
    session: {}
  };
}

const initialState: Terminal.WindowTabState = {
  activeWindowIndex: 0,
  windows: [genTilingState()]
};

export const useTerminalStore = create<Store>()(
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
          if (action.type === 'CLOSE_WINDOW') {
            const { windowIndex } = action;
            if (draft.state.windows.length > 1) {
              // Close all pty sessions for the window being closed
              const windowToClose = draft.state.windows[windowIndex];
              Object.values(windowToClose.session).forEach(pid => {
                window.ipcRenderer.invoke('terminal:destroy', pid);
              });

              draft.state.windows.splice(windowIndex, 1);
              if (draft.state.activeWindowIndex >= draft.state.windows.length) {
                draft.state.activeWindowIndex = draft.state.windows.length - 1;
              }
            }
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

            case 'SET_FOCUSED_TERM':
              draft.state.windows[activeIndex].focusedTermId = action.termId;
              break;

            case 'CYCLE_PANE':
              // Get all leaf panes in the current window in document order
              const allPanes = draft.state.windows[activeIndex].panes;
              const rootPaneId = draft.state.windows[activeIndex].rootPaneId;

              // Traverse the pane tree to get all leaf panes in document order
              const getLeafPanesInOrder = (paneId: string): Terminal.PaneNode[] => {
                const pane = allPanes[paneId];
                if (!pane) return [];

                if (pane.type === 'Leaf' && pane.termId) {
                  return [pane];
                }

                if (pane.type !== 'Leaf') {
                  let result: Terminal.PaneNode[] = [];
                  pane.childrenId.forEach(childId => {
                    result = result.concat(getLeafPanesInOrder(childId));
                  });
                  return result;
                }

                return [];
              };

              const leafPanes = getLeafPanesInOrder(rootPaneId);

              if (leafPanes.length <= 1) break; // No need to cycle if there's only one or no pane

              const currentIndex = leafPanes.findIndex(pane => pane.id === draft.state.windows[activeIndex].activePaneId);
              let nextIndex;

              if (action.direction === 'next') {
                nextIndex = (currentIndex + 1) % leafPanes.length;
              } else { // previous
                nextIndex = (currentIndex - 1 + leafPanes.length) % leafPanes.length;
              }

              if (nextIndex >= 0 && nextIndex < leafPanes.length) {
                draft.state.windows[activeIndex].activePaneId = leafPanes[nextIndex].id;
              }
              break;
          }
        })
      );
    },
  })
);

// 在页面关闭时清除session, 确保下次打开时能创建新的pty进程
// window.ipcRenderer.on('window-close', () => {
//   const currentState = { ...useTerminalStore.getState().state };
//   currentState.windows = currentState.windows.map((w) => {
//     // 通知electron关闭pty
//     Object.values(w.session).forEach(pid => {
//       window.ipcRenderer.invoke('terminal:destroy', pid);
//     })
//     return {
//       ...w,
//       session: {}
//     }
//   });
//   useTerminalStore.setState({ state: currentState });
// });
