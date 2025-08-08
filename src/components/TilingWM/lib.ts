import type { WritableDraft } from "immer";

import { v4 as uuidV4 } from 'uuid';

export function createTerm(): Terminal.TermInstance {
  return { id: uuidV4(), count: 0 };
}

export function createPane(termId: string | null = null, parentId: string | null = null): Terminal.PaneNode {
  return {
    id: uuidV4(),
    type: 'Leaf',
    childrenId: [],
    termId,
    flex: null,
    parentId
  };
}

export function attachPane(draft: WritableDraft<Terminal.TilingWMState>, action: Terminal.TilingWMAction) {
  if (action.type != 'ATTACH_PANE') return;
  const { targetId, direction } = action;
  const targetPane = draft.panes[targetId];
  if (!targetPane) return;

  const newTerm = createTerm();
  const newPane = createPane(newTerm.id);
  draft.terms[newTerm.id] = newTerm;

  const newType: Terminal.NodeType = direction === 'left' || direction === 'right' ? 'Horizon' : 'Vertical';

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
}

export function resizePane(draft: WritableDraft<Terminal.TilingWMState>, action: Terminal.TilingWMAction) {
  if (action.type != 'RESIZE_PANE') return;
  const { targetId, direction } = action;
  const targetLayout: Terminal.NodeType =
    direction === 'left' || direction === 'right'
      ? 'Horizon'
      : 'Vertical';

  const delta =
    direction === 'left' || direction === 'up'
      ? -0.1
      : 0.1;

  let currentId: string | null = targetId;
  while (currentId) {
    const pane = draft.panes[currentId] as Terminal.PaneNode | undefined;
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
}

export function closePane(draft: WritableDraft<Terminal.TilingWMState>, action: Terminal.TilingWMAction) {
  if (action.type != 'CLOSE_PANE') return;
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

  delete draft.panes[targetId];
  delete draft.panes[parent.id];

  draft.activePaneId = sibling.type === 'Leaf' ? sibling.id : null;
}
