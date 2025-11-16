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
  draft.focusedTermId = newTerm.id; // Focus the terminal in the newly created pane
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
  console.log('closePane', draft, action);
  if (action.type != 'CLOSE_PANE') return;
  const { targetId } = action;
  const targetPane = draft.panes[targetId];
  // 找不到pane或者pane是根节点则退出
  if (!targetPane || !targetPane.parentId) return;

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

  // Clear session and notify electron to destroy pty
  if (targetPane?.termId) {
    const pid = draft.session[targetPane.termId];
    if (pid) {
      window.ipcRenderer.invoke('terminal:destroy', pid);
    }
    delete draft.session[targetPane.termId];
  }

  // 清除pane
  delete draft.panes[targetId];
  delete draft.panes[parent.id];

  draft.activePaneId = sibling.type === 'Leaf' ? sibling.id : null;

  // If the closed pane was the focused terminal, update focusedTermId
  if (draft.focusedTermId === targetPane.termId) {
    // Set focus to the remaining sibling's terminal if it has one
    if (sibling.termId) {
      draft.focusedTermId = sibling.termId;
    } else {
      // If the sibling is a container, set focus to null or find another terminal in the window
      draft.focusedTermId = null;
    }
  }
}

export function cyclePane(draft: WritableDraft<Terminal.TilingWMState>, action: Terminal.TilingWMAction) {
  if (action.type != 'CYCLE_PANE') return;
  // Get all leaf panes in the current window in document order
  const allPanes = draft.panes;
  const rootPaneId = draft.rootPaneId;

  const leafPanes = getLeafPanesInOrder(allPanes, rootPaneId);
  // No need to cycle if there's only one or no pane
  if (leafPanes.length <= 1) return;

  const currentIndex = leafPanes.findIndex(pane => pane.id === draft.activePaneId);
  let nextIndex;

  if (action.direction === 'next') {
    nextIndex = (currentIndex + 1) % leafPanes.length;
  } else { // previous
    nextIndex = (currentIndex - 1 + leafPanes.length) % leafPanes.length;
  }

  if (nextIndex >= 0 && nextIndex < leafPanes.length) {
    draft.activePaneId = leafPanes[nextIndex].id;
  }
}

export function closeWindow(draft: WritableDraft<Terminal.WindowTabState>, action: Terminal.TilingWMAction) {
  if (action.type != 'CLOSE_WINDOW') return;
  const { windowIndex } = action;
  if (draft.windows.length > 1) {
    // Close all pty sessions for the window being closed
    const windowToClose = draft.windows[windowIndex];
    Object.values(windowToClose.session).forEach(pid => {
      window.ipcRenderer.invoke('terminal:destroy', pid);
    });

    draft.windows.splice(windowIndex, 1);
    if (draft.activeWindowIndex >= draft.windows.length) {
      draft.activeWindowIndex = draft.windows.length - 1;
    }
  }
}

function getLeafPanesInOrder(allPanes: WritableDraft<Record<string, Terminal.PaneNode>>, paneId: string): Terminal.PaneNode[] {
  const pane = allPanes[paneId];
  if (!pane) return [];

  if (pane.type === 'Leaf' && pane.termId) {
    return [pane];
  }

  if (pane.type !== 'Leaf') {
    let result: Terminal.PaneNode[] = [];
    pane.childrenId.forEach(childId => {
      result = result.concat(getLeafPanesInOrder(allPanes, childId));
    });
    return result;
  }

  return [];
}
