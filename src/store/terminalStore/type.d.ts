export interface Store {
  panes: { [key: string]: Terminal.PaneNode };
  rootPaneId: string;
  activePaneId: string | null;
  // termId -> node-pty process id(pid)
  session: Map<string, number>;

  activePane: (paneId: string) => void;
  attachPane: (targetId: string, direction: 'left' | 'right' | 'up' | 'down') => void;
}
