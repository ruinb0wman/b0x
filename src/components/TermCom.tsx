import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import config from '@/config'
import { useTerminalStore } from '@/store/terminalStore/terminalStore'

interface Props {
  termId: string
}

export default function TermCom({ termId }: Props) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const { state, dispatch } = useTerminalStore();

  useEffect(() => {
    if (!terminalRef.current) return

    const container = terminalRef.current

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
    terminalInstance.current = terminal

    // 添加插件
    const fitAddonInstance = new FitAddon()
    terminal.loadAddon(fitAddonInstance)
    fitAddon.current = fitAddonInstance

    try {
      terminal.loadAddon(new WebglAddon())
    } catch (e) {
      console.warn('WebGL addon could not be loaded, falling back to canvas renderer')
    }

    // 打开 terminal
    terminal.open(container)

    // 强制布局
    const timeout = setTimeout(() => {
      if (!container || !fitAddon.current) return
      container.clientWidth
      container.clientHeight
      fitAddon.current.fit()

      const initialCols = Math.max(terminal.cols, 10)
      const initialRows = Math.max(terminal.rows, 5)

      let backendId: number
      let isReconnected = false

      // 🔍 检查是否已有该 termId 的 backend session
      console.log('session', state.session)
      if (state.session && termId in state.session) {
        backendId = state.session[termId]
        isReconnected = true
        console.log(`Reusing existing terminal session for termId: ${termId}, backendId: ${backendId}`)
      } else {
        // 🆕 创建新终端
        window.ipcRenderer
          .invoke('terminal:create', { cols: initialCols, rows: initialRows })
          .then((id: number) => {
            console.log(`New terminal created for termId: ${termId}, backendId: ${id}`)
            dispatch({ type: 'SET_SESSION', termId, pid: id })
            backendId = id
            // 继续后续绑定
            bindTerminalEvents(terminal, id)
          })
          .catch((err: any) => {
            console.error('Failed to create terminal:', err)
          })
        return
      }

      // 如果是重连，立即绑定事件
      bindTerminalEvents(terminal, backendId)

      // 强制重新 fit（可选）
      if (isReconnected) {
        setTimeout(() => {
          fitAddon.current?.fit()
          const { cols, rows } = terminal
          window.ipcRenderer.invoke('terminal:resize', { id: backendId, cols, rows }).catch(console.error)
        }, 50)
      }
    }, 100)

    // 绑定事件的函数（可复用）
    function bindTerminalEvents(terminal: Terminal, pid: number) {
      // 监听后端输出
      const onData = (_: any, dataObj: any) => {
        if (dataObj.id === pid && terminalInstance.current) {
          terminalInstance.current.write(dataObj.data)
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
          if (fitAddon.current && container && terminalInstance.current) {
            try {
              fitAddon.current.fit()
              const { cols, rows } = terminal
              window.ipcRenderer.invoke('terminal:resize', { id: pid, cols, rows })
            } catch (e) {
              console.error('Resize error:', e)
            }
          }
        })
      })
      ro.observe(container)
      resizeObserver.current = ro

      // 清理函数
      const cleanup = () => {
        // window.ipcRenderer.removeAllListeners('terminal:data')
        // terminal?.offData(onTerminalData)
        window.ipcRenderer.off('terminal:data', onData)
        ro.disconnect()
        // 注意：不 destroy backend，除非显式关闭 pane
      }

        // 存储 cleanup 函数以便销毁时调用
        ; (terminal as any)._cleanup = cleanup
    }

    // 💥 组件卸载时清理
    return () => {
      clearTimeout(timeout);
      if (terminalInstance.current) {
        // 调用 cleanup
        ; (terminalInstance.current as any)._cleanup?.()
        terminalInstance.current.dispose()
      }
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [termId]) // 依赖 termId：切换 pane 时重建

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        overflow: 'hidden',
        position: 'relative',
      }}
    />
  )
}
