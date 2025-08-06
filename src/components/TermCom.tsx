import { useEffect, useRef, memo } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import config from "../config";

function TermCom() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const terminalId = useRef<number | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize terminal
    const terminal = new Terminal(config.terminal)
    terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        return false; // 阻止 xterm 处理，让事件冒泡
      }
      return true; // 允许 xterm 处理
    });
    terminalInstance.current = terminal


    // Addons
    fitAddon.current = new FitAddon()
    terminal.loadAddon(fitAddon.current)
    try {
      terminal.loadAddon(new WebglAddon())
    } catch (e) {
      console.warn('WebGL addon could not be loaded, falling back to canvas renderer')
    }

    // Open terminal
    terminal.open(terminalRef.current)

    // Force layout calculation before fitting
    const timeout = setTimeout(() => {
      try {
        if (!fitAddon.current) throw new Error('FitAddon not initialized')

        // Force a layout pass
        terminalRef.current?.clientWidth
        terminalRef.current?.clientHeight

        // Fit terminal to container
        fitAddon.current.fit()
        const initialCols = Math.max(terminal.cols, 10)
        const initialRows = Math.max(terminal.rows, 5)

        // Create terminal session with initial dimensions
        console.log('Creating terminal with dimensions:', { cols: initialCols, rows: initialRows })
        window.ipcRenderer.invoke('terminal:create', {
          cols: initialCols,
          rows: initialRows
        }).then((id) => {
          console.log('Terminal created with id:', id)
          terminalId.current = id

          // Handle terminal output from backend
          window.ipcRenderer.on('terminal:data', (_: any, dataObj: any) => {
            console.log('terminal:data', dataObj)
            if (dataObj.id === terminalId.current) {
              terminal.write(dataObj.data)
            }
          })

          terminal.onData((data) => {
            console.log('Sending data to terminal:', data)
            if (terminalId.current) {
              window.ipcRenderer.invoke('terminal:write', {
                id: terminalId.current,
                data
              }).catch(err => {
                console.error('Failed to write to terminal:', err)
              })
            }
          })

          // Handle resize with animation frame
          let resizeRequest: number
          const resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(resizeRequest)
            resizeRequest = requestAnimationFrame(() => {
              if (fitAddon.current && terminalId.current && terminalRef.current) {
                try {
                  fitAddon.current.fit()
                  const { cols, rows } = terminal
                  window.ipcRenderer.invoke('terminal:resize', {
                    id: terminalId.current,
                    cols,
                    rows
                  })
                } catch (e) {
                  console.error('Resize error:', e)
                }
              }
            })
          })

          if (terminalRef.current) {
            resizeObserver.observe(terminalRef.current)
          }

          return () => {
            if (terminalId.current) {
              window.ipcRenderer.invoke('terminal:destroy', terminalId.current)
            }
            window.ipcRenderer.removeAllListeners('terminal:data')
            resizeObserver.disconnect()
          }
        }).catch(err => {
          console.error('Terminal initialization failed:', err)
        })
      } catch (e) {
        console.error('Terminal setup error:', e)
      }
    }, 100) // 100ms delay to ensure terminal is ready

    return () => {
      clearTimeout(timeout)
      terminal.dispose()
    }
  }, [])

  return (
    <div ref={terminalRef} style={{
      width: '100%',
      height: '100%',
      minHeight: '300px',
      overflow: 'hidden'
    }} />
  )
}
export default memo(TermCom)
