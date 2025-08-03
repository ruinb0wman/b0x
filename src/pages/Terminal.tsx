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

    // Open terminal
    terminal.open(terminalRef.current)
    
    // Initial fit and get dimensions
    fitAddon.current.fit()
    const initialCols = terminal.cols
    const initialRows = terminal.rows

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

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        if (fitAddon.current && terminalId.current) {
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
        // resizeObserver.disconnect()
      }
    })

    return () => {
      terminal.dispose()
    }
  }, [])

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
}
