import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const terminalId = useRef<number | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize terminal
    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: 'Consolas, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      }
    })
    terminalInstance.current = terminal

    // Addons
    fitAddon.current = new FitAddon()
    terminal.loadAddon(fitAddon.current)
    terminal.loadAddon(new WebglAddon())

    // Open terminal and wait for initialization
    terminal.open(terminalRef.current)
    
    // Initial fit right after opening
    try {
      if (!fitAddon.current) throw new Error('FitAddon not initialized')
      
      // Force a layout calculation
      setTimeout(() => {
        fitAddon.current?.fit()
        const initialCols = Math.max(terminal.cols || 80, 10)
        const initialRows = Math.max(terminal.rows || 24, 5)

        // Create terminal session with initial dimensions
        window.ipcRenderer.invoke('terminal:create', {
          cols: initialCols,
          rows: initialRows
        }).then((id) => {
          terminalId.current = id

          // Handle data from terminal
          window.ipcRenderer.on('terminal:data', (_, data) => {
            terminal.write(data)
          })

          // Handle input from user
          terminal.onData((data) => {
            window.ipcRenderer.invoke('terminal:write', {
              id: terminalId.current,
              data
            })
          })

          // Handle resize with debounce
          let resizeTimeout: NodeJS.Timeout
          const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
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
          
          if (terminalRef.current) {
            resizeObserver.observe(terminalRef.current)
          }

          return () => {
            if (terminalId.current) {
              window.ipcRenderer.invoke('terminal:destroy', terminalId.current)
            }
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
      terminal.dispose()
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh',
      padding: '8px',
      boxSizing: 'border-box',
      backgroundColor: '#1e1e1e',
      overflow: 'hidden'
    }}>
      <div ref={terminalRef} style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        overflow: 'hidden'
      }} />
    </div>
  )
}
