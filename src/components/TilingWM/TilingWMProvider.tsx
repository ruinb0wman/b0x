import { createContext, useContext, useReducer, ReactNode } from 'react';
import { produce } from 'immer';
import { v4 as uuidV4 } from 'uuid';
import { Terminal } from '../../types/terminal'; // This line is crucial

// === 类型定义 ===
type TermInstance = Terminal.TermInstance;
type NodeType = Terminal.NodeType;
interface PaneNode extends Terminal.PaneNode {}
interface TilingWMState extends Terminal.TilingWMState {}
type TilingWMAction = Terminal.TilingWMAction;

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
        const targetLayout: NodeType =
          direction === 'left' || direction === 'right'
            ? 'Horizon'
            : 'Vertical';

        const delta =
          direction === 'left' || direction === 'up'
            ? -0.1
            : 0.1;

        let currentId: string | null = targetId;
        while (currentId) {
          const pane = draft.panes[currentId] as PaneNode | undefined;
          if (!pane) break;
          const parentId = pane.parentId;
          if (!parentId) break;

          const parent = draft.panes[parentId];
          if (!parent) break;

          if (parent.type === targetLayout) {
            const firstChildId = parent.childrenId[0];
            if (firstChildId) {
              draft.panes[firstChildId].flex =
                (draft.panes[firstChildId].flex || 1) + delta;
            }
            break;
          }
          currentId = parentId;
        }
        break;
      }

      case 'CLOSE_PANE': {
        const { targetId } = action;
        const targetPane = draft.panes[targetId];
        if (!targetPane) return;

        // If this is the root and only pane, do nothing
        if (!targetPane.parentId) {
          return;
        }

        // Remove associated term if any
        if (targetPane.termId && draft.terms[targetPane.termId]) {
          delete draft.terms[targetPane.termId];
        }

        const parent = draft.panes[targetPane.parentId];
        if (!parent) return;

        // Get sibling id
        const siblingId = parent.childrenId.find(id => id !== targetId);
        if (!siblingId) return;

        // Promote sibling to take parent's place
        const sibling = draft.panes[siblingId];
        if (!sibling) return;

        // If parent is root
        if (!parent.parentId) {
          sibling.parentId = null;
          draft.rootPaneId = sibling.id;
        } else {
          const gp = draft.panes[parent.parentId];
          const index = gp.childrenId.indexOf(parent.id);
          if (index !== -1) {
            gp.childrenId[index] = sibling.id;
          }
          sibling.parentId = gp.id;
        }

        // Copy sibling data into parent if we want to keep parent's id
        // But here simpler: promote sibling to parent's position by replacing parent in the tree structures
        // Remove old panes
        delete draft.panes[targetId];
        delete draft.panes[parent.id];

        draft.activePaneId = sibling.type === 'Leaf' ? sibling.id : null;
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
