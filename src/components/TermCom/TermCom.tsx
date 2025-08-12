import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import { ClipboardAddon } from '@xterm/addon-clipboard' // Import ClipboardAddon
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
    terminal.loadAddon(new ClipboardAddon()); // Load ClipboardAddon

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


      // 🔍 检查是否已有该 termId 的 backend session
      console.log('session', activeWindow.session)
      if (activeWindow.session && termId in activeWindow.session) {
        pid = activeWindow.session[termId]
        console.log(`Reusing existing terminal session for termId: ${termId}, backendId: ${pid}`)
      } else {
        // 🆕 创建新终端
        window.ipcRenderer
          .invoke('terminal:create', { cols: initialCols, rows: initialRows })
          .then((id: number) => {
            console.log(`New terminal created for termId: ${termId}, backendId: ${id}`)
            dispatch({ type: 'SET_SESSION', termId, pid: id })
            pid = id
            bindTerminalEvents(terminal, id)
          })
          .catch((err: any) => {
            console.error('Failed to create terminal:', err)
          })
        return
      }

      // 绑定事件处理
      cleaner.push(bindTerminalIO(terminal, pid));
      cleaner.push(observeResize(fitAddon, container, terminal, pid));
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
      // 清除xtermIO监听, 清除窗口大小变化监听
      cleaner.forEach(fn => fn());
      // 关闭xterm
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
