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
    terms: Record<string, TermInstance>;
    activePaneId: string | null;
  }

  type TilingWMAction =
    | { type: 'ATTACH_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
    | { type: 'SET_ACTIVE_PANE'; paneId: string }
    | { type: 'UPDATE_TERM_COUNT'; termId: string; count: number }
    | { type: 'RESIZE_PANE'; targetId: string; direction: 'left' | 'right' | 'up' | 'down' }
    | { type: 'CLOSE_PANE'; targetId: string };
}
