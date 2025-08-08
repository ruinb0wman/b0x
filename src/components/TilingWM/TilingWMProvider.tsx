import { createContext, useContext, useReducer, ReactNode } from 'react';
import { produce } from 'immer';
import { createTerm, createPane, attachPane, resizePane, closePane } from "./lib"

// init
const initialTerm = createTerm();
const rootPane = createPane(initialTerm.id, null);
const initialState: Terminal.TilingWMState = {
  panes: { [rootPane.id]: rootPane },
  rootPaneId: rootPane.id,
  terms: { [initialTerm.id]: initialTerm },
  activePaneId: null,
};


const TilingWMContext = createContext<{
  state: Terminal.TilingWMState;
  dispatch: React.Dispatch<Terminal.TilingWMAction>;
} | null>(null);

function tilingWMReducer(state: Terminal.TilingWMState, action: Terminal.TilingWMAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SET_ACTIVE_PANE':
        draft.activePaneId = action.paneId;
        break;

      case 'UPDATE_TERM_COUNT':
        if (draft.terms[action.termId]) {
          draft.terms[action.termId].count = action.count;
        }
        break;

      case 'ATTACH_PANE': {
        attachPane(draft, action);
        break;
      }

      case 'RESIZE_PANE': {
        resizePane(draft, action);
        break;
      }

      case 'CLOSE_PANE': {
        closePane(draft, action);
        break;
      }
    }
  });
}

export function TilingWMProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tilingWMReducer, initialState);

  return (
    <TilingWMContext.Provider value={{ state, dispatch }}>
      {children}
    </TilingWMContext.Provider>
  );
}

export function useTilingWM() {
  const context = useContext(TilingWMContext);
  if (!context) throw new Error('useTilingWM must be used within TilingWMProvider');
  return context;
}
