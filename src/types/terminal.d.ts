declare namespace Terminal {
  type TermInstance = {
    id: string;
    count: number;
  };

  type NodeType = 'Leaf' | 'Vertical' | 'Horizon';

  interface TerminalContainer {
    id: number;
    show: boolean;
  }

  type SetTerminals = React.Dispatch<React.SetStateAction<TerminalContainer[]>>
  type Terminals = TerminalContainer[];

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
    activePaneId: string | null;
    focusedTermId: string | null;    // 当前窗口聚焦的终端ID
    session: Record<string, number>
  }

  type TilingWMAction =
    | { type: 'ATTACH_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
    | { type: 'SET_ACTIVE_PANE'; paneId: string }
    | { type: 'RESIZE_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
    | { type: 'CLOSE_PANE'; targetId: string }
    | { type: 'SET_SESSION'; termId: string, pid: number }
    | { type: 'SET_FOCUSED_TERM'; termId: string | null }
    | { type: 'CYCLE_PANE'; direction: 'next' | 'previous' };

  interface WindowTabState {
    windows: TilingWMState[];
    activeWindowIndex: number;
  }
}
