// TilingWMProvider.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
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
  childrenId: string[];     // 子节点ID数组
  termId: string | null;    // 指向 Term 的 ID
  flex: number | null;
  parentId: string | null;  // 父节点ID
}

interface TilingWMState {
  panes: Record<string, PaneNode>; // 扁平化存储所有Pane
  rootPaneId: string;              // 根Pane ID
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

function createPane(termId: string | null = null, parentId: string | null = null): PaneNode {
  return {
    id: uuidV4(),
    type: 'Leaf',
    childrenId: [],
    termId,
    flex: null,
    parentId
  };
}

const initialTerm = createTerm();
const rootPane = createPane(initialTerm.id, null);

const initialState: TilingWMState = {
  panes: { [rootPane.id]: rootPane },
  rootPaneId: rootPane.id,
  terms: { [initialTerm.id]: initialTerm },
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
        const targetPane = draft.panes[targetId];
        if (!targetPane) return;

        const newTerm = createTerm();
        const newPane = createPane(newTerm.id);
        draft.terms[newTerm.id] = newTerm;

        const newType: NodeType = direction === 'left' || direction === 'right' ? 'Horizon' : 'Vertical';

        // 转换 targetPane 为容器
        targetPane.type = newType;
        const copyPane = createPane(targetPane.termId, targetPane.id);
        const copyId = copyPane.id;
        draft.panes[copyId] = copyPane;

        targetPane.termId = null;

        // 创建新Pane
        newPane.parentId = targetPane.id;
        draft.panes[newPane.id] = newPane;

        // 排列顺序
        targetPane.childrenId =
          direction === 'left' || direction === 'up'
            ? [newPane.id, copyId]
            : [copyId, newPane.id];

        draft.activePaneId = newPane.id;
        break;
      }

      case 'RESIZE_PANE': {
        const { targetId, direction } = action;
        let currentId = targetId;

        function resize(id: string): boolean {
          const pane = draft.panes[id];
          if (!pane) return false;

          const parent = pane.parentId ? draft.panes[pane.parentId] : null;
          if (pane.type === 'Leaf' && parent) {
            if (direction === 'up') {
              if (parent.type === 'Vertical') {
                parent.childrenId.forEach((cid, idx) => {
                  if (idx === 0) draft.panes[cid].flex = (draft.panes[cid].flex || 1) - 0.1;
                });
              } else if (parent.type === 'Horizon' && parent.parentId) {
                currentId = draft.panes[parent.parentId].childrenId[0];
                return resize(currentId);
              }
            } else if (direction === 'down') {
              if (parent.type === 'Vertical') {
                parent.childrenId.forEach((cid, idx) => {
                  if (idx === 0) draft.panes[cid].flex = (draft.panes[cid].flex || 1) + 0.1;
                });
              } else if (parent.type === 'Horizon' && parent.parentId) {
                currentId = draft.panes[parent.parentId].childrenId[0];
                return resize(currentId);
              }
            } else if (direction === 'left') {
              if (parent.type === 'Horizon') {
                parent.childrenId.forEach((cid, idx) => {
                  if (idx === 0) draft.panes[cid].flex = (draft.panes[cid].flex || 1) - 0.1;
                });
              } else if (parent.type === 'Vertical' && parent.parentId) {
                currentId = draft.panes[parent.parentId].childrenId[0];
                return resize(currentId);
              }
            } else if (direction === 'right') {
              if (parent.type === 'Horizon') {
                parent.childrenId.forEach((cid, idx) => {
                  if (idx === 0) draft.panes[cid].flex = (draft.panes[cid].flex || 1) + 0.1;
                });
              } else if (parent.type === 'Vertical' && parent.parentId) {
                currentId = draft.panes[parent.parentId].childrenId[0];
                return resize(currentId);
              }
            }
            return true;
          }
          return pane.childrenId.some(cid => resize(cid));
        }

        resize(currentId);
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

