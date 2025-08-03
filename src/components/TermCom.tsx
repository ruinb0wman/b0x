import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'

export default function TermCom() {
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

          // Handle data from terminal
          window.ipcRenderer.on('terminal:data', (_, data) => {
            console.log('Received data from pty:', data)
            try {
              terminal.write(data)
            } catch (e) {
              console.error('Failed to write terminal data:', e)
            }
          })

          // Handle input from user
          // Focus terminal when clicked
          terminalRef.current?.addEventListener('click', () => {
            terminal.focus()
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

          // Initial focus
          setTimeout(() => terminal.focus(), 200)

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
            }, 100)
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
      clearTimeout(timeout)
      terminal.dispose()
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: '8px',
      boxSizing: 'border-box',
      backgroundColor: '#1e1e1e'
    }}>
      <div ref={terminalRef} style={{
        width: '100%',
        height: '100%',
        minHeight: '300px'
      }} />
    </div>
  )
}
