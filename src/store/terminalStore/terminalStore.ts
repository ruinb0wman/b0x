import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { createTerm, createPane, attachPane, resizePane, closePane } from './lib';

type Store = {
  state: Terminal.TilingWMState;
  dispatch: (action: Terminal.TilingWMAction) => void;
};

// 初始化 state
const initialTerm = createTerm();
const rootPane = createPane(initialTerm.id, null);
const initialState: Terminal.TilingWMState = {
  panes: { [rootPane.id]: rootPane },
  rootPaneId: rootPane.id,
  activePaneId: null,
  // termId -> node-pty process id(pid)
  session: new Map<string, number>()
};

export const useTerminalStore = create<Store>()(
  persist(
    (set) => ({
      state: initialState,

      dispatch: (action) => {
        set(
          produce<Store>((draft) => {
            switch (action.type) {
              case 'SET_ACTIVE_PANE':
                draft.state.activePaneId = action.paneId;
                break;

              case 'ATTACH_PANE':
                attachPane(draft.state, action);
                break;

              case 'RESIZE_PANE':
                resizePane(draft.state, action);
                break;

              case 'CLOSE_PANE':
                closePane(draft.state, action);
                break;
              case 'SET_SESSION':
                draft.state.session.set(action.termId, action.pid);
                break;
            }
          })
        );
      },
    }),
    {
      name: 'tiling-wm-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Restore Map from serialized array
          if (parsed.state?.state?.session) {
            parsed.state.state.session = new Map(parsed.state.state.session);
          }
          return parsed;
        },
        setItem: (name, value) => {
          // Convert Map to array for serialization
          const toSerialize = {
            ...value,
            state: {
              ...value.state,
              state: {
                ...value.state.state,
                session: Array.from(value.state.state.session.entries())
              }
            }
          };
          localStorage.setItem(name, JSON.stringify(toSerialize));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

