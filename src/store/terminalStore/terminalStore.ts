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
};

export const useTilingWMStore = create<Store>()(
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

