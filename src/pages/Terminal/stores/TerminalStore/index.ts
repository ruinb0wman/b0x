import { create } from 'zustand';
import { produce } from 'immer';
import { closeWindow, createTerm, createPane, attachPane, resizePane, closePane, cyclePane } from './lib';

type Store = {
  state: Terminal.WindowTabState;
  dispatch: (action: Terminal.TilingWMAction) => void;
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
          const activeIndex = draft.state.activeWindowIndex;

          switch (action.type) {
            case 'SET_ACTIVE_WINDOW':
              draft.state.activeWindowIndex = action.windowIndex;
              break;
            case 'NEW_WINDOW':
              draft.state.windows.push(genTilingState());
              draft.state.activeWindowIndex = draft.state.windows.length - 1;
              break;
            case 'CLOSE_WINDOW':
              closeWindow(draft.state, action);
              break;
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
              cyclePane(draft.state.windows[activeIndex], action);
              break;
          }
        })
      );
    },
  })
);
