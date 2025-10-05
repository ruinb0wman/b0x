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
  const { state, dispatch } = useTerminalStore();

  useEffect(() => {
    if (!terminalRef.current) return
    const container = terminalRef.current
    const cleaner: (() => void)[] = [];
    let pid: number

    // 创建 xterm 实例
    const terminal = new Terminal(config.terminal)
    preventShortcutCapture(terminal);

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
    }
  }, [termId])

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        overflow: 'hidden',
        position: 'relative',
        padding: '5px',
        boxSizing: 'border-box'
      }}
    />
  )
}
