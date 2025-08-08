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

        // 查找需要修改 flex 的容器类型
        const targetLayout: NodeType =
          direction === 'left' || direction === 'right'
            ? 'Horizon'
            : 'Vertical';

        // flex 调整值（左右/上下的 +/-）
        const delta =
          direction === 'left' || direction === 'up'
            ? -0.1
            : 0.1;

        // 从 targetId 向上找合适的父节点
        let currentId: string | null = targetId;
        while (currentId) {
          const pane = draft.panes[currentId] as PaneNode | undefined;
          if (!pane) break;
          const parentId = pane.parentId;
          if (!parentId) break; // 到根节点还没找到

          const parent = draft.panes[parentId];
          if (!parent) break;

          if (parent.type === targetLayout) {
            // 修改第一个子 Pane 的 flex
            const firstChildId = parent.childrenId[0];
            if (firstChildId) {
              draft.panes[firstChildId].flex =
                (draft.panes[firstChildId].flex || 1) + delta;
            }
            break; // 找到就结束
          }

          // 否则继续往上找
          currentId = parentId;
        }

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

