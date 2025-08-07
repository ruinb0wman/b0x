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
  flex: number | null;
  parent: PaneNode | null;
}

interface TilingWMState {
  rootPane: PaneNode;
  terms: Record<string, TermInstance>;
  activePaneId: string | null;
}

type TilingWMAction =
  | { type: 'ATTACH_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'SET_ACTIVE_PANE'; paneId: string }
  | { type: 'UPDATE_TERM_COUNT'; termId: string; count: number }
  | { type: 'RESIZE_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' };

// === Context 定义 ===
const TilingWMContext = createContext<{
  state: TilingWMState;
  dispatch: React.Dispatch<TilingWMAction>;
} | null>(null);

// === 初始化数据 ===
function createTerm(): TermInstance {
  return { id: uuidV4(), count: 0 };
}

function createPane(termId: string | null = null, parent?: PaneNode): PaneNode {
  return {
    id: uuidV4(),
    type: 'Leaf' as const,
    children: [],
    termId,
    flex: null,
    parent: parent || null
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

        const newType: NodeType = direction === 'left' || direction === 'right' ? 'Horizon' : 'Vertical';

        function findAndAttach(node: PaneNode): boolean {
          if (node.type === 'Leaf' && node.id === targetId) {
            node.type = newType;
            const copyPane = createPane(node.termId, node);
            node.termId = null;

            node.children =
              direction === 'left' || direction === 'up'
                ? [{ ...createPane(newTerm.id, node), id: newPaneId }, copyPane]
                : [copyPane, { ...createPane(newTerm.id, node), id: newPaneId }];

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

      case 'RESIZE_PANE': {
        const { targetId, direction } = action;
        console.log('RESIZE_PANE', targetId, direction);

        function findAndResize(node: PaneNode, parent?: PaneNode): boolean {
          if (node.type === 'Leaf' && node.id === targetId && parent) {
            if (direction == 'up') {
              if (parent.type == 'Vertical') {
                parent.children[0].flex = (parent.children[0].flex || 1) - 0.1;
              } else if (parent.type == 'Horizon' && parent.parent?.type == 'Vertical') {
                parent.parent.children[0].flex = (parent.parent.children[0].flex || 1) - 0.1;
              }
            } else if (direction == 'down') {
              if (parent.type == 'Vertical') {
                parent.children[0].flex = (parent.children[0].flex || 1) + 0.1;
              } else if (parent.type == 'Horizon' && parent.parent?.type == 'Vertical') {
                parent.parent.children[0].flex = (parent.parent.children[0].flex || 1) + 0.1;
              }
            } else if (direction == 'left') {
              if (parent.type == 'Horizon') {
                parent.children[0].flex = (parent.children[0].flex || 1) - 0.1;
              } else if (parent.type == 'Vertical' && parent.parent?.type == 'Horizon') {
                parent.parent.children[0].flex = (parent.parent.children[0].flex || 1) - 0.1;
              }
            } else if (direction == 'right') {
              if (parent.type == 'Horizon') {
                parent.children[0].flex = (parent.children[0].flex || 1) + 0.1;
              } else if (parent.type == 'Vertical' && parent.parent?.type == 'Horizon') {
                parent.parent.children[0].flex = (parent.parent.children[0].flex || 1) + 0.1;
              }
            }

            return true;
          }
          for (const child of node.children) {
            if (findAndResize(child, node)) return true;
          }
          return false;
        }

        findAndResize(draft.rootPane);
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
