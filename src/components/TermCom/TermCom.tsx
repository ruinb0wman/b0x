import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import config from '@/config'
import { useTerminalStore } from '@/store/terminalStore/terminalStore'
import { bindTerminalIO, observeResize, preventShortcutCapture } from "./lib"
import "./style.css"

interface Props {
  termId: string
}

export default function TermCom({ termId }: Props) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<Terminal | null>(null)
  const { state, dispatch } = useTerminalStore();

  // Effect to handle focusing when the window changes and this terminal was the last focused
  useEffect(() => {
    const activeWindow = state.windows[state.activeWindowIndex];

    // If this terminal is the one that was focused in the current window, focus it
    if (activeWindow.focusedTermId === termId && xtermRef.current) {
      // Use setTimeout to ensure DOM is ready before focusing
      setTimeout(() => {
        xtermRef.current?.focus();
      }, 0);
    }
  }, [state.activeWindowIndex, state.windows, termId]);

  // Effect to handle focusing when this pane becomes the active pane within the current window
  useEffect(() => {
    const activeWindow = state.windows[state.activeWindowIndex];
    const targetPane = Object.values(activeWindow.panes).find(pane => pane.termId === termId);

    // If this terminal's pane becomes the active pane, focus the terminal and update focusedTermId
    if (targetPane && activeWindow.activePaneId === targetPane.id && xtermRef.current) {
      // Use setTimeout to ensure DOM is ready before focusing
      setTimeout(() => {
        if (xtermRef.current) {
          xtermRef.current.focus();
          // Update the store to track this as the focused terminal
          dispatch({ type: 'SET_FOCUSED_TERM', termId });
        }
      }, 0);
    }
  }, [state.activeWindowIndex, state.windows, termId, dispatch]);

  useEffect(() => {
    if (!terminalRef.current) return
    const container = terminalRef.current
    const cleaner: (() => void)[] = [];
    let pid: number

    // 创建 xterm 实例
    const terminal = new Terminal(config.terminal)
    preventShortcutCapture(terminal);
    xtermRef.current = terminal;

    // 添加插件
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    try {
      terminal.loadAddon(new WebglAddon())
    } catch (e) {
      console.warn('WebGL addon could not be loaded, falling back to canvas renderer')
    }

    // Open terminal
    terminal.open(container)

    // Force layout
    const timeout = setTimeout(async () => {
      if (!container || !fitAddon) return
      fitAddon.fit()
      const activeWindow = state.windows[state.activeWindowIndex];

      const initialCols = Math.max(terminal.cols, 10)
      const initialRows = Math.max(terminal.rows, 5)


      // 🔍 Check if there's an existing backend session for this termId
      if (activeWindow.session && termId in activeWindow.session) {
        pid = activeWindow.session[termId]
        console.log(`Reusing existing terminal session for termId: ${termId}, backendId: ${pid}`)
      } else {
        // 🆕 Create new terminal
        const id = await window.ipcRenderer
          .invoke('terminal:create', { cols: initialCols, rows: initialRows })
          .catch((err: any) => {
            console.error('Failed to create terminal:', err)
          });
        console.log(`New terminal created for termId: ${termId}, backendId: ${id}`)
        dispatch({ type: 'SET_SESSION', termId, pid: id })
        pid = id
      }

      // If this is the first terminal in the window or the window has no focused terminal,
      // set it as the focused terminal
      if (!activeWindow.focusedTermId) {
        dispatch({ type: 'SET_FOCUSED_TERM', termId });
        terminal.focus();
      }

      // Bind event handlers
      cleaner.push(bindTerminalIO(terminal, pid));
      cleaner.push(observeResize(fitAddon, container, terminal, pid));
    }, 100)

    return () => {
      clearTimeout(timeout);
      // Clean up xtermIO listeners, window resize listeners
      cleaner.forEach(fn => fn());
      // Dispose xterm
      terminal.dispose()
      if (xtermRef.current === terminal) {
        xtermRef.current = null;
      }
    }
  }, [termId, dispatch])

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        padding: '5px',
        boxSizing: 'border-box'
      }}
    />
  )
}
