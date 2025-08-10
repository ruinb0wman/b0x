import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import config from '@/config'
import { useTerminalStore } from '@/store/terminalStore/terminalStore'
import { bindTerminalIO, observeResize } from "./lib"
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

    // 创建 xterm 实例
    const terminal = new Terminal(config.terminal)
    terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.altKey) &&
        event.shiftKey &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        return false
      } else if (event.ctrlKey && event.key.toLowerCase() == 'w') {
        return false;
      }
      return true
    })

    // 添加插件
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    try {
      terminal.loadAddon(new WebglAddon())
    } catch (e) {
      console.warn('WebGL addon could not be loaded, falling back to canvas renderer')
    }

    // 打开 terminal
    terminal.open(container)

    // 强制布局
    const timeout = setTimeout(() => {
      if (!container || !fitAddon) return
      fitAddon.fit()
      const activeWindow = state.windows[state.activeWindowIndex];

      const initialCols = Math.max(terminal.cols, 10)
      const initialRows = Math.max(terminal.rows, 5)

      let backendId: number

      // 🔍 检查是否已有该 termId 的 backend session
      console.log('session', activeWindow.session)
      if (activeWindow.session && termId in activeWindow.session) {
        backendId = activeWindow.session[termId]
        console.log(`Reusing existing terminal session for termId: ${termId}, backendId: ${backendId}`)
      } else {
        // 🆕 创建新终端
        window.ipcRenderer
          .invoke('terminal:create', { cols: initialCols, rows: initialRows })
          .then((id: number) => {
            console.log(`New terminal created for termId: ${termId}, backendId: ${id}`)
            dispatch({ type: 'SET_SESSION', termId, pid: id })
            backendId = id
            bindTerminalEvents(terminal, id)
          })
          .catch((err: any) => {
            console.error('Failed to create terminal:', err)
          })
        return
      }

      // 绑定事件处理
      cleaner.push(bindTerminalIO(terminal, backendId));
      cleaner.push(observeResize(fitAddon, container, terminal, backendId));
    }, 100)

    function bindTerminalEvents(terminal: Terminal, pid: number) {
      // 监听后端输出
      const onData = (_: any, dataObj: any) => {
        if (dataObj.id === pid && terminal) {
          terminal.write(dataObj.data)
        }
      }
      window.ipcRenderer.on('terminal:data', onData)

      // 监听用户输入
      const onTerminalData = (data: string) => {
        window.ipcRenderer.invoke('terminal:write', { id: pid, data }).catch((err) => {
          console.error('Failed to write to terminal:', err)
        })
      }
      terminal.onData(onTerminalData)

      // 监听 resize
      let resizeRequest: number
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRequest)
        resizeRequest = requestAnimationFrame(() => {
          if (fitAddon && container && terminal) {
            try {
              fitAddon.fit()
              const { cols, rows } = terminal
              window.ipcRenderer.invoke('terminal:resize', { id: pid, cols, rows })
            } catch (e) {
              console.error('Resize error:', e)
            }
          }
        })
      })
      ro.observe(container)

      return () => {
        window.ipcRenderer.off('terminal:data', onData)
        ro.disconnect()
      }
    }

    return () => {
      clearTimeout(timeout);
      terminal.dispose()
      cleaner.forEach(fn => fn());
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
