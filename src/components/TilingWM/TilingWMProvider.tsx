// TilingWMProvider.tsx
import { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { produce } from 'immer';
import { v4 as uuidV4 } from 'uuid';

// === 类型定义 ===
type TermInstance = {
  id: string;
  count: number;
};

type NodeType = 'Leaf' | 'Vertical' | 'Horizon';

interface PaneNode {
  id: string;
  type: NodeType;
  children: PaneNode[];
  termId: string | null; // 指向 Term 的 ID
}

interface TilingWMState {
  rootPane: PaneNode;
  terms: Record<string, TermInstance>;
  activePaneId: string | null;
}

type TilingWMAction =
  | { type: 'ATTACH_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'SET_ACTIVE_PANE'; paneId: string }
  | { type: 'UPDATE_TERM_COUNT'; termId: string; count: number };

// === Context 定义 ===
const TilingWMContext = createContext<{
  state: TilingWMState;
  dispatch: React.Dispatch<TilingWMAction>;
} | null>(null);

// === 初始化数据 ===
function createTerm(): TermInstance {
  return { id: uuidV4(), count: 0 };
}

function createPane(termId: string | null = null): PaneNode {
  return {
    id: uuidV4(),
    type: 'Leaf' as const,
    children: [],
    termId,
  };
}

const initialTerm = createTerm();
const initialState: TilingWMState = {
  terms: { [initialTerm.id]: initialTerm },
  rootPane: createPane(initialTerm.id),
  activePaneId: null,
};

// === Reducer（使用 Immer）===
function tilingWMReducer(state: TilingWMState, action: TilingWMAction) {
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
        const { targetId, direction } = action;
        const newTerm = createTerm();
        const newPaneId = uuidV4();

        // 添加新终端
        draft.terms[newTerm.id] = newTerm;

        const newType: NodeType = direction === 'left' || direction === 'right' ? 'Vertical' : 'Horizon';

        function findAndAttach(node: PaneNode): boolean {
          if (node.type === 'Leaf' && node.id === targetId) {
            node.type = newType;
            const copyPane = createPane(node.termId);
            node.termId = null;

            node.children =
              direction === 'left' || direction === 'up'
                ? [{ ...createPane(newTerm.id), id: newPaneId }, copyPane]
                : [copyPane, { ...createPane(newTerm.id), id: newPaneId }];

            return true;
          }
          for (const child of node.children) {
            if (findAndAttach(child)) return true;
          }
          return false;
        }

        findAndAttach(draft.rootPane);
        draft.activePaneId = newPaneId;
        break;
      }
    }
  });
}

// === Provider 组件 ===
export function TilingWMProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tilingWMReducer, initialState);

  return (
    <TilingWMContext.Provider value={{ state, dispatch }}>
      {children}
    </TilingWMContext.Provider>
  );
}

// === 自定义 Hook ===
export function useTilingWM() {
  const context = useContext(TilingWMContext);
  if (!context) throw new Error('useTilingWM must be used within TilingWMProvider');
  return context;
}
